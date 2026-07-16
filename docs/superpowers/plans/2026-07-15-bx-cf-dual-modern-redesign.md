# BX-CF Dual Modern Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce two eight-slide PowerPoint decks, `BX-CF_InkLime.pptx` and `BX-CF_AIProof.pptx`, with identical approved content and two distinct modern design systems.

**Architecture:** Treat the current `BX-CF.pptx` as the inherited content source, create one validated eight-slide starter deck, and import that starter separately for each output. Keep source extraction, shared artifact-tool helpers, theme-specific slide composition, and verification in separate JavaScript modules under the external scratch workspace.

**Tech Stack:** Node.js ES modules, `@oai/artifact-tool`, presentation template-following helpers, LibreOffice/Poppler-backed render tools, Malgun Gothic.

## Global Constraints

- Source content: `/Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF.pptx`.
- Output A: `/Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_InkLime.pptx`.
- Output B: `/Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_AIProof.pptx`.
- Both outputs contain exactly eight slides; the former ninth slide stays deleted.
- Preserve normalized visible copy from source slides 1–8.
- Slide 4 retains `E2E 테스트 자동화` and its Playwright/CI/Vitest detail.
- Use Malgun Gothic throughout.
- Do not introduce external images, icons, charts, or decorative illustrations.
- No gray card alternation; use page-specific compositions and intentional color fields.
- Scratch workspace: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp`.
- Preserve unrelated repository changes; do not stage or commit generated decks or scratch code.

---

### Task 1: Prepare the inherited source and starter deck

**Files:**
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/source-backup.pptx`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/deck-source.mjs`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/template-audit.txt`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/template-frame-map.json`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/deviation-log.txt`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/template-starter.pptx`

**Interfaces:**
- Consumes: current eight-slide `BX-CF.pptx`.
- Produces: validated starter deck, complete inspect NDJSON, eight source layout JSON files, and a normalized source text snapshot used by both builders and verification.

- [ ] **Step 1: Initialize the artifact-tool workspace and back up the source**

Run:

```bash
mkdir -p /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp
cp /Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF.pptx /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/source-backup.pptx
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/container_tools/setup_artifact_tool_workspace.mjs --workspace /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp
```

Expected: the source and backup SHA-256 hashes match, and the workspace command prints the scratch path.

- [ ] **Step 2: Inspect the source deck**

Run:

```bash
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/template_following_scripts/inspect_template_deck.mjs --workspace /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp --pptx /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/source-backup.pptx
```

Expected: manifest reports `slideCount: 8` and no media, chart, or table dependencies.

- [ ] **Step 3: Implement complete source inspection and frame-map generation**

Create `deck-source.mjs` with these exact exported interfaces:

```js
export async function inspectFullSource(sourcePath, inspectPath) {
  const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePath));
  const snapshot = await presentation.inspect({
    kind: "slide,textbox,shape,image,table,chart",
    maxChars: 500_000,
  });
  if (snapshot.truncated) throw new Error("Source inspection truncated");
  await fs.writeFile(inspectPath, snapshot.ndjson, "utf8");
  if (presentation.slides.items.length !== 8) {
    throw new Error(`Expected 8 source slides, got ${presentation.slides.items.length}`);
  }
}

export async function writeFrameMap(inspectPath, mapPath) {
  const records = (await fs.readFile(inspectPath, "utf8"))
    .split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const outputSlides = Array.from({ length: 8 }, (_, index) => {
    const sourceSlide = index + 1;
    const sourceElementIds = records
      .filter((record) => record.slide === sourceSlide && record.kind !== "slide" && record.id)
      .map((record) => record.id);
    if (sourceElementIds.length === 0) throw new Error(`No source objects on slide ${sourceSlide}`);
    return {
      outputSlide: sourceSlide,
      sourceSlide,
      narrativeRole: ["cover", "definition", "why now", "architecture", "plan", "deliverables", "impact", "AI proof"][index],
      reuseMode: "duplicate-slide",
      editTargets: [{ action: "replace", sourceElementIds }],
    };
  });
  await fs.writeFile(mapPath, `${JSON.stringify({ outputSlides, omittedSourceSlides: [] }, null, 2)}\n`, "utf8");
}
```

The module also writes:

```text
template-audit.txt: current eight-slide content source; no media; Malgun Gothic; all objects eligible for approved redesign.
deviation-log.txt: full page-specific restyle; slide count and content retained; no overlays used to hide unedited source text.
```

- [ ] **Step 4: Validate the frame map and create the starter**

Run:

```bash
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/template_following_scripts/validate_template_plan.mjs --workspace /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp --map /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/template-frame-map.json --source-slide-count 8
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/template_following_scripts/prepare_template_starter_deck.mjs --workspace /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp --pptx /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/source-backup.pptx --map /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/template-frame-map.json --out /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/template-starter.pptx --contact-sheet /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/template-starter-contact-sheet.png
```

Expected: both commands pass with eight output slides.

---

### Task 2: Implement the shared presentation design system

**Files:**
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/design-system.mjs`

**Interfaces:**
- Consumes: imported starter slides and starter layout JSON.
- Produces: `loadStarter()`, `loadLayouts()`, `shapeAt()`, `textAt()`, `position()`, `paint()`, `styleText()`, `addText()`, `addRect()`, `renderAndExport()`, and shared content-extraction helpers.

- [ ] **Step 1: Implement shared colors, type, and shape helpers**

Create these constants and function signatures:

```js
export const FONT = "Malgun Gothic";
export const INK_LIME = {
  ivory: "#F8F3E8", ink: "#0B0B0B", lime: "#C8FF29",
  blue: "#1359FF", white: "#FFFFFF", softBlue: "#EDF2FF",
};
export const AI_PROOF = {
  ink: "#07090C", white: "#F9FAFF", blue: "#1359FF",
  cyan: "#43E6FF", lime: "#C8FF29", ghost: "#151A22",
};

export function styleText(shape, value, options = {}) {
  shape.text = value;
  shape.fill = options.fill ?? "none";
  shape.line = { style: "solid", fill: options.lineFill ?? "none", width: options.lineWidth ?? 0 };
  shape.text.style = {
    typeface: FONT,
    fontSize: options.fontSize ?? 16,
    bold: options.bold ?? false,
    color: options.color ?? "#0B0B0B",
    alignment: options.alignment ?? "left",
    verticalAlignment: options.verticalAlignment ?? "middle",
    autoFit: "shrinkText",
    wrap: "square",
    insets: options.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
}
```

`renderAndExport(presentation, outputPath, previewDir, layoutDir)` must render every slide PNG, write every layout JSON, write a montage, inspect without truncation, then save the PPTX.

- [ ] **Step 2: Verify the helper module parses**

Run:

```bash
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/design-system.mjs
```

Expected: exit code 0 with no output.

---

### Task 3: Build the Ink + Lime deck

**Files:**
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/build-ink-lime.mjs`
- Create: `/Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_InkLime.pptx`

**Interfaces:**
- Consumes: `template-starter.pptx`, starter layout JSON, `design-system.mjs`.
- Produces: editable eight-slide Ink + Lime deck plus preview and layout evidence.

- [ ] **Step 1: Implement the eight approved compositions**

Define one function per slide and dispatch without a repeated card factory:

```js
const stylers = [
  styleCover,
  styleDefinition,
  styleWhyNow,
  styleArchitecture,
  stylePlan,
  styleDeliverables,
  styleImpact,
  styleAiProof,
];

presentation.slides.items.forEach((slide, index) => {
  stylers[index](slide, layouts[index]);
});
```

Use these dominant surfaces and layout signatures:

```js
const slideDesign = [
  { background: "ivory", signature: "blue edge + oversized two-line title + lime highlight + metadata baseline" },
  { background: "white", signature: "oversized CF monogram + right definition + three ruled pillars" },
  { background: "ivory", signature: "ink headline + lime highlight + quote + ruled three-part matrix" },
  { background: "ink", signature: "lime system rail + Frontend/API/Backend zones + E2E verification lane" },
  { background: "white", signature: "staggered oversized month numerals and timeline" },
  { background: "blue", signature: "oversized 06 + six ruled deliverables" },
  { background: "ivory/lime split", signature: "benefit typography + core/mci/full roadmap" },
  { background: "ink", signature: "ghost AI + three evidence zones" },
];
```

Keep source text values by reading `layout.elements[order]`; Slide 7 may split its inherited multiline benefit string into six separate text boxes without changing the line text.

- [ ] **Step 2: Build and render Ink + Lime**

Run:

```bash
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/build-ink-lime.mjs
```

Expected: eight rendered previews and `BX-CF_InkLime.pptx`.

---

### Task 4: Build the AI PROOF deck

**Files:**
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/build-ai-proof.mjs`
- Create: `/Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_AIProof.pptx`

**Interfaces:**
- Consumes: `template-starter.pptx`, starter layout JSON, `design-system.mjs`.
- Produces: editable eight-slide AI PROOF deck plus preview and layout evidence.

- [ ] **Step 1: Implement the eight dark-tech compositions**

Define separate slide functions and keep the dark system varied with one unique ghost anchor per slide:

```js
const ghostAnchors = ["CF", "FOUNDATION", "WHY", "SYSTEM", "01·02·03", "06", "IMPACT", "AI"];
const accentBySlide = ["lime", "cyan", "lime", "cyan", "blue", "lime", "cyan", "lime"];
```

Implement these signatures:

```js
const slideDesign = [
  "cropped CF + white cover title + blue edge light + lime metadata rule",
  "cropped FOUNDATION + left definition + cyan three-stop rail",
  "ghost WHY + staggered white/cyan/lime problem-to-outcome signals",
  "blue/cyan technical rail + three architecture zones + lime E2E lane",
  "ghost 01/02/03 + stepped route with content above and below",
  "ghost 06 + six scan-line deliverables",
  "blue-black split + benefit signal list + luminous roadmap",
  "ghost AI + three evidence zones",
];
```

Use near-black as the dominant field and preserve source text exactly.

- [ ] **Step 2: Build and render AI PROOF**

Run:

```bash
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/build-ai-proof.mjs
```

Expected: eight rendered previews and `BX-CF_AIProof.pptx`.

---

### Task 5: Verify both decks and deliver

**Files:**
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/verify-dual-decks.mjs`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/verification.json`

**Interfaces:**
- Consumes: source backup, both final decks, source and final layout JSON.
- Produces: slide count, normalized visible-text equality, E2E presence, bounds, checksum, and render QA evidence.

- [ ] **Step 1: Implement structural and content verification**

The verifier must enforce:

```js
if (source.slideCount !== 8) throw new Error("Source must contain 8 slides");
if (inkLime.slideCount !== 8 || aiProof.slideCount !== 8) throw new Error("Both outputs must contain 8 slides");
compareNormalizedLineMultisets(source.slides, inkLime.slides);
compareNormalizedLineMultisets(source.slides, aiProof.slides);
assertContains(inkLime.slides[3].lines, "E2E 테스트 자동화");
assertContains(aiProof.slides[3].lines, "E2E 테스트 자동화");
assertNoOutOfBounds(inkLime);
assertNoOutOfBounds(aiProof);
```

Write source and output SHA-256 hashes and confirm the two output hashes differ.

- [ ] **Step 2: Run artifact verification**

Run:

```bash
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/verify-dual-decks.mjs
```

Expected: `sourceSlideCount: 8`, both output slide counts 8, text preservation true, E2E present, out-of-bounds count 0, and distinct output checksums.

- [ ] **Step 3: Run PowerPoint-compatible overflow checks and renders**

Run:

```bash
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/container_tools/slides_test.py /Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_InkLime.pptx
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/container_tools/slides_test.py /Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_AIProof.pptx
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/container_tools/render_slides.py /Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_InkLime.pptx --output_dir /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/ink-lime-powerpoint-render
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/container_tools/render_slides.py /Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_AIProof.pptx --output_dir /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-dual-modern/tmp/ai-proof-powerpoint-render
```

Expected: both overflow tests pass and both render directories contain eight PNG files.

- [ ] **Step 4: Inspect all 16 rendered slides and run template structural checks**

Create one contact sheet per output for deck-level flow, then inspect every slide PNG at full size. Run `check_template_fidelity.mjs` for each output with the validated frame map, starter provenance, final layout directory, and scratch edit directory. Document approved full replacements in `deviation-log.txt`; no unresolved placeholders or hidden source overlays may remain.

- [ ] **Step 5: Deliver exactly two PowerPoint links**

Return standalone links to:

```text
/Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_InkLime.pptx
/Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_AIProof.pptx
```
