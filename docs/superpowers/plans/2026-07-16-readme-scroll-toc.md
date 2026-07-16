# README HTML Scroll TOC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate FE/BE README HTML with a right-side H2/H3 table of contents that scrolls to and highlights the current section without pagination.

**Architecture:** Tokenize Markdown once with `marked.lexer()`, annotate heading tokens with deterministic unique IDs, and use those same tokens to render both body anchors and the TOC. Keep output as a standalone HTML file with inline CSS and a small `IntersectionObserver` script for active-section state.

**Tech Stack:** Node.js 22, ESM, marked 18, Vitest 4, HTML/CSS/vanilla JavaScript

## Global Constraints

- Include `h2` as top-level TOC items and `h3` as indented child items; exclude `h1`.
- Preserve the existing single-document vertical scroll and standalone HTML output.
- Keep anchor navigation functional without JavaScript; JavaScript is only required for active-section highlighting.
- Hide the TOC on narrow screens and let the document use the available width.
- Do not parse generated HTML or Markdown headings with regular expressions.
- Apply the same generator behavior to FE and BE README targets.

---

### Task 1: Heading Outline And Stable Anchors

**Files:**
- Create: `scripts/gen-readme-html.test.mjs`
- Modify: `scripts/gen-readme-html.mjs`

**Interfaces:**
- Produces: `buildReadmeContent(markdown: string): { body: string; headings: Array<{ id: string; depth: 2 | 3; label: string }> }`
- Produces: `generateReadmeHtml(options?): Promise<Array<{ out: string; skipped: boolean }>>`
- Consumes: `marked.lexer()`, `marked.parser()`, and the existing `TARGETS`/`OUT_DIR` defaults.

- [ ] **Step 1: Write the failing heading test**

Create `scripts/gen-readme-html.test.mjs` with a sample containing `h1`, repeated `h2`, and `h3`. Assert that `buildReadmeContent()` returns only depths 2 and 3, produces IDs `overview`, `details`, and `overview-2`, and renders matching body IDs.

```js
import { describe, expect, it } from 'vitest';
import { buildReadmeContent } from './gen-readme-html.mjs';

describe('README HTML heading outline', () => {
  it('creates matching H2/H3 outline entries and unique body anchors', () => {
    const result = buildReadmeContent(`# Document\n\n## Overview\n\n### Details\n\n## Overview`);

    expect(result.headings).toEqual([
      { id: 'overview', depth: 2, label: 'Overview' },
      { id: 'details', depth: 3, label: 'Details' },
      { id: 'overview-2', depth: 2, label: 'Overview' },
    ]);
    expect(result.body).toContain('<h2 id="overview">Overview</h2>');
    expect(result.body).toContain('<h3 id="details">Details</h3>');
    expect(result.body).toContain('<h2 id="overview-2">Overview</h2>');
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec vitest run scripts/gen-readme-html.test.mjs`

Expected: FAIL because `buildReadmeContent` is not exported.

- [ ] **Step 3: Implement token annotation and testable direct-run boundary**

In `scripts/gen-readme-html.mjs`, add a deterministic slug counter, annotate depth 2/3 heading tokens, render headings with IDs through a `marked.Renderer`, and export `buildReadmeContent()` and `generateReadmeHtml()`. Wrap filesystem generation in the same `pathToFileURL(process.argv[1])` direct-run guard used by `scripts/gen-api.mjs` so test imports have no write side effects.

```js
const createHeadingId = (label, counts) => {
  const base = label
    .normalize('NFKC')
    .toLocaleLowerCase('ko')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '') || 'section';
  const count = (counts.get(base) ?? 0) + 1;
  counts.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
};

export const buildReadmeContent = (markdown) => {
  const tokens = marked.lexer(markdown, { gfm: true });
  const headings = [];
  const counts = new Map();

  for (const token of tokens) {
    if (token.type !== 'heading' || (token.depth !== 2 && token.depth !== 3)) continue;
    token.headingId = createHeadingId(token.text, counts);
    headings.push({ id: token.headingId, depth: token.depth, label: token.text });
  }

  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens: inlineTokens, depth, headingId }) {
    const content = this.parser.parseInline(inlineTokens);
    return headingId
      ? `<h${depth} id="${headingId}">${content}</h${depth}>\n`
      : `<h${depth}>${content}</h${depth}>\n`;
  };

  return { body: marked.parser(tokens, { renderer }), headings };
};
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm exec vitest run scripts/gen-readme-html.test.mjs`

Expected: 1 test passes and importing the module does not regenerate assets.

- [ ] **Step 5: Commit heading generation**

```bash
git add scripts/gen-readme-html.mjs scripts/gen-readme-html.test.mjs
git commit -m "feat: generate readme heading anchors"
```

---

### Task 2: Sticky TOC And Active Section Tracking

**Files:**
- Modify: `scripts/gen-readme-html.test.mjs`
- Modify: `scripts/gen-readme-html.mjs`

**Interfaces:**
- Produces: `renderReadmeDocument(title: string, content: ReturnType<typeof buildReadmeContent>): string`
- Consumes: Task 1 `headings` and `body` without re-parsing either value.

- [ ] **Step 1: Write failing document-layout tests**

Add a second test that calls `renderReadmeDocument()` and asserts:

```js
expect(html).toContain('<nav class="toc" aria-label="문서 목차">');
expect(html).toContain('class="toc-link toc-link-depth-2" href="#overview"');
expect(html).toContain('class="toc-link toc-link-depth-3" href="#details"');
expect(html).toContain('scroll-behavior: smooth');
expect(html).toContain('position: sticky');
expect(html).toContain('@media (max-width: 1100px)');
expect(html).toContain('new IntersectionObserver');
expect(html).toContain("aria-current");
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec vitest run scripts/gen-readme-html.test.mjs`

Expected: the heading test passes and the layout test fails because the TOC markup is absent.

- [ ] **Step 3: Implement the standalone document layout**

Replace the single centered `.md` wrapper with a constrained `.readme-layout` containing `<main class="md">` and `<aside class="toc-column">`. Render a semantic `nav` from `headings`, use `.toc-link-depth-3` indentation, and keep the current dark palette.

Use these layout constraints:

```css
html { scroll-behavior: smooth; }
.readme-layout {
  display: grid;
  grid-template-columns: minmax(0, 880px) 260px;
  gap: 56px;
  width: min(100% - 48px, 1240px);
  margin: 0 auto;
}
.toc {
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}
.md h2, .md h3 { scroll-margin-top: 24px; }
@media (max-width: 1100px) {
  .readme-layout { display: block; width: min(100% - 32px, 880px); }
  .toc-column { display: none; }
}
```

Add an inline script that observes all TOC-targeted headings, sets exactly one link's `aria-current="location"`, and uses the current hash as the initial active item. Do not intercept link clicks; native hash navigation plus CSS smooth scrolling remains the navigation mechanism.

- [ ] **Step 4: Run focused and script test suites**

Run: `pnpm exec vitest run scripts/gen-readme-html.test.mjs scripts/gen-api.test.mjs scripts/check-api-paths.test.mjs`

Expected: all tests pass with no asset generation side effects.

- [ ] **Step 5: Commit TOC layout and behavior**

```bash
git add scripts/gen-readme-html.mjs scripts/gen-readme-html.test.mjs
git commit -m "feat: add readme scroll navigation"
```

---

### Task 3: Regenerate And Visually Verify README HTML

**Files:**
- Modify: `landing/assets/fe.readme.html`
- Modify if the sibling BE repository exists: `landing/assets/be.readme.html`

**Interfaces:**
- Consumes: `pnpm gen:readme` and the current FE/optional BE `README.md` files.
- Produces: deployable standalone README HTML files under `landing/assets/`.

- [ ] **Step 1: Regenerate assets**

Run: `pnpm gen:readme`

Expected: `fe.readme.html` is generated; `be.readme.html` is generated only when `../bx-cf-be/README.md` exists, otherwise it is explicitly skipped.

- [ ] **Step 2: Verify generated structure**

Run: `rg -n 'class="toc"|toc-link-depth-3|IntersectionObserver|id="시작하기-quick-start"' landing/assets/fe.readme.html`

Expected: TOC markup, nested links, active tracking, and heading IDs are present.

- [ ] **Step 3: Verify desktop interaction**

Open `landing/assets/fe.readme.html` in the in-app browser at a desktop viewport. Confirm the right TOC is visible and sticky, clicking a nested item updates the hash and scrolls to the matching heading, the active item changes while scrolling, and the document remains one continuous page.

- [ ] **Step 4: Verify narrow viewport**

At a viewport width below 1100px, confirm the TOC column is hidden, the body fits without horizontal overflow, and heading anchors remain navigable by hash.

- [ ] **Step 5: Run final checks**

Run: `pnpm exec vitest run scripts/gen-readme-html.test.mjs`

Run: `git diff --check -- scripts/gen-readme-html.mjs scripts/gen-readme-html.test.mjs landing/assets/fe.readme.html landing/assets/be.readme.html`

Expected: tests pass and diff check reports no whitespace errors.

- [ ] **Step 6: Commit generated output**

```bash
git add scripts/gen-readme-html.mjs scripts/gen-readme-html.test.mjs landing/assets/fe.readme.html
git add landing/assets/be.readme.html # only when regenerated
git commit -m "docs: regenerate readme html with navigation"
```
