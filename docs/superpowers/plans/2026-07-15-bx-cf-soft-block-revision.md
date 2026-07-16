# BX-CF Soft Block Editorial Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revise the current nine-slide `landing/assets/BX-CF.pptx` into an eight-slide Soft Block Editorial deck at the same path, preserving existing slide 1–8 copy, adding the approved E2E content to slide 4, and deleting slide 9.

**Architecture:** Treat the current PowerPoint as the sole visual and content source. Build a validated eight-slide starter deck from source slides 1–8, edit inherited objects with `@oai/artifact-tool`, use bounded replacement primitives only where the approved panel system or E2E content cannot be represented by an inherited object, and verify the overwritten file against the backed-up source.

**Tech Stack:** `@oai/artifact-tool`, bundled template-following helpers, Node.js ES modules, LibreOffice rendering, bundled `slides_test.py`.

## Global Constraints

- Input and final output path: `landing/assets/BX-CF.pptx`.
- Input SHA-256: `90ffca459339c1815557b0791aab8ac5a6d1bb3b8db255a2f5156843f3badcf8`.
- Back up the input outside the repository before overwriting it.
- Final deck contains exactly 8 slides; source slide 9 is omitted.
- Preserve all visible text from source slides 1–8 exactly except for the approved slide 4 E2E addition.
- Add exactly `E2E 테스트 자동화` and `Playwright · PC · Mobile · Admin 주요 시나리오 검증  →  CI 파이프라인 연동 · Vitest 단위 테스트 병행` to slide 4.
- Preserve the current Executive Editorial typography, cobalt/blue palette, header marker, footer label, date, unit label, and page-number chrome.
- Use pale-blue grouping surfaces, cobalt rules, and hairlines without shadows or external visual assets.
- Implement presentation edits only with `@oai/artifact-tool`; do not use `python-pptx` or direct OOXML editing.

---

### Task 1: Freeze the current final and prepare an eight-slide starter

**Files:**
- Read: `landing/assets/BX-CF.pptx`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/source-backup.pptx`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/template-audit.txt`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/template-frame-map.json`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/deviation-log.txt`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/template-starter.pptx`

**Interfaces:**
- Consumes: the user-modified nine-slide final deck.
- Produces: a validated starter containing inherited source slides 1–8 and an audit recording source slide 9 as intentionally omitted.

- [ ] **Step 1: Back up and fingerprint the source**

Copy the current file to `source-backup.pptx`, then run `shasum -a 256` and verify the checksum is `90ffca459339c1815557b0791aab8ac5a6d1bb3b8db255a2f5156843f3badcf8`.

- [ ] **Step 2: Inspect every source slide and generate the frame map**

Generate a complete, non-truncated artifact-tool inspection. Map output slides 1–8 one-to-one to source slides 1–8, classify all inherited objects as `replace`, and record source slide 9 in `omittedSourceSlides` with reason `User requested deletion of the final decision slide`.

- [ ] **Step 3: Validate and create the starter**

Run `validate_template_plan.mjs` and `prepare_template_starter_deck.mjs`. Expected: validation passes with zero issues and the starter contains 8 slides.

### Task 2: Implement the Soft Block Editorial revision

**Files:**
- Create: `scripts/presentations/revise-bx-cf-soft-block.mjs`
- Read: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/template-starter.pptx`
- Modify: `landing/assets/BX-CF.pptx`

**Interfaces:**
- Consumes: the validated starter and its per-slide layout JSON.
- Produces: an eight-slide `landing/assets/BX-CF.pptx` plus scratch previews and layout snapshots.

- [ ] **Step 1: Implement shared editing primitives**

Create the following interfaces in `scripts/presentations/revise-bx-cf-soft-block.mjs`:

```js
function paintShape(shape, fill = "none", lineFill = "none", lineWidth = 0) {
  shape.fill = fill;
  shape.line = { style: "solid", fill: lineFill, width: lineWidth };
  return shape;
}

function styleText(shape, value, options = {}) {
  shape.text = value;
  shape.text.style = {
    typeface: "Malgun Gothic",
    fontSize: options.fontSize ?? 16,
    bold: options.bold ?? false,
    color: options.color ?? "#0F1B3D",
    alignment: options.alignment ?? "left",
    verticalAlignment: options.verticalAlignment ?? "middle",
    autoFit: "shrinkText",
    wrap: "square",
    insets: options.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function position(shape, box) {
  shape.position = box;
  return shape;
}

function inheritedShape(slide, order) {
  const shape = slide.shapes.items[order - 1];
  if (!shape) throw new Error(`Missing inherited shape at order ${order}`);
  return shape;
}

function replacePanel(slide, sourceShape, box, fill, lineFill) {
  position(sourceShape, box);
  paintShape(sourceShape, fill, lineFill, lineFill === "none" ? 0 : 1);
  return sourceShape;
}
```

The implementation must set `Malgun Gothic`, preserve exact supplied text values, use `autoFit: "shrinkText"`, and use the approved canvas, navy, cobalt, pale-blue, secondary-text, and hairline colors.

- [ ] **Step 2: Revise slides 1–3**

Slide 1 receives only alignment and separator refinement. Slide 2 receives one pale-blue thesis surface and three equal-width numbered panels. Slide 3 receives three full-width alternating horizontal bands with a cobalt number rail and aligned cause/result columns.

- [ ] **Step 3: Revise slide 4 and add E2E content**

Keep equal FRONTEND/API/BACKEND columns, reduce their height, and insert one bounded full-width bottom band containing exactly:

```text
E2E 테스트 자동화
Playwright · PC · Mobile · Admin 주요 시나리오 검증  →  CI 파이프라인 연동 · Vitest 단위 테스트 병행
```

- [ ] **Step 4: Revise slides 5–8**

Slide 5 uses three alternating month surfaces. Slide 6 uses six 3×2 deliverable surfaces. Slide 7 replaces the left checklist with six numbered 2×3 benefit blocks while preserving the right roadmap. Slide 8 uses three grouped surfaces with the center proof surface emphasized.

- [ ] **Step 5: Export to the requested in-place path**

Export through `PresentationFile.exportPptx` to `landing/assets/BX-CF.pptx`, then write eight full-size artifact previews and eight layout JSON snapshots under the scratch workspace.

### Task 3: Verify content and presentation quality

**Files:**
- Read: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/source-backup.pptx`
- Read: `landing/assets/BX-CF.pptx`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/verification.json`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/tmp/final-render/slide-1.png` through `slide-8.png`

**Interfaces:**
- Consumes: the nine-slide backup and final eight-slide deck.
- Produces: machine-verifiable content results and full-size visual evidence.

- [ ] **Step 1: Verify slide count and copy contract**

Re-import both files, compare ordered visible text for source slides 1–8 and final slides 1–8, and permit only the two approved E2E strings as additions on slide 4. Expected: 8 final slides, source slide 9 absent, and no other copy differences.

- [ ] **Step 2: Verify structure and package integrity**

Run `unzip -tq`, count `ppt/slides/slide*.xml`, and run `slides_test.py`. Expected: valid package, exactly 8 slide XML files, and no overflow.

- [ ] **Step 3: Render and inspect all eight slides**

Render through LibreOffice at 1600×900, inspect every slide at full size, and verify panel separation, consistent margins, equal slide 4 columns, readable slide 4 E2E band, improved slide 7 benefit emphasis, footer consistency, and no unintended overlap or clipping.

- [ ] **Step 4: Correct and repeat verification if necessary**

If any visual or content defect is found, update only `scripts/presentations/revise-bx-cf-soft-block.mjs`, rebuild, and repeat Task 3 Steps 1–3 until all checks pass.

### Task 4: Deliver the overwritten final

**Files:**
- Keep: `landing/assets/BX-CF.pptx`
- Keep: `scripts/presentations/revise-bx-cf-soft-block.mjs`
- Keep: `docs/superpowers/specs/2026-07-15-bx-cf-soft-block-revision-design.md`
- Keep: `docs/superpowers/plans/2026-07-15-bx-cf-soft-block-revision.md`

**Interfaces:**
- Consumes: verified final deck.
- Produces: one user-facing final link to the requested PowerPoint.

- [ ] **Step 1: Confirm only intended workspace files changed**

Run `git status --short`, preserve unrelated user modifications and untracked files, and confirm the final PPTX and reproducible revision script exist.

- [ ] **Step 2: Report the final artifact**

Provide exactly one standalone absolute Markdown link to `landing/assets/BX-CF.pptx` and summarize the 8-slide, E2E, panel, and slide 7 revisions.
