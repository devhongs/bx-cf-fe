# BX-CF Executive Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve every visible string and all eight slides in `landing/assets/BX-CF.pptx` while producing a new, executive-editorial blue presentation at `landing/assets/BX-CF_ExecutiveEditorial.pptx`.

**Architecture:** Treat the current presentation as the only content and object source. Import a validated starter deck with `@oai/artifact-tool`, restyle and reposition inherited slide objects by stable artifact IDs, export the revised deck, then re-import it for structural, text, overflow, and visual checks.

**Tech Stack:** `@oai/artifact-tool`, bundled presentation inspection/rendering helpers, LibreOffice/Poppler rendering, Node.js, Python QA helpers.

## Global Constraints

- Preserve the original `landing/assets/BX-CF.pptx` byte-for-byte.
- Keep exactly eight slides in the original order.
- Preserve every visible string exactly; do not add, delete, correct, summarize, or rewrite copy.
- Use `Malgun Gothic` throughout.
- Use the approved Executive Editorial palette: canvas `#F7F9FC`, text `#0F1B3D`, cobalt `#1F57F8`, supporting blue `#3A83D8`, pale blue `#DCE7FA`, secondary text `#58657B`, hairline `#CBD8EF`.
- Minimize dashboard-style cards; use large editorial headlines, open space, hairlines, and aligned report columns.
- Keep the source deck as a template and edit inherited objects instead of overlaying a replacement deck.
- Use only `@oai/artifact-tool` for presentation edits; do not use `python-pptx` or direct OOXML editing.

---

### Task 1: Freeze the source and validate the editable template

**Files:**
- Read: `landing/assets/BX-CF.pptx`
- Create: `/private/tmp/bx-cf-executive-editorial/template-audit.txt`
- Create: `/private/tmp/bx-cf-executive-editorial/template-frame-map.json`
- Create: `/private/tmp/bx-cf-executive-editorial/deviation-log.txt`
- Create: `/private/tmp/bx-cf-executive-editorial/template-starter.pptx`

**Interfaces:**
- Consumes: the eight-slide source deck and the approved design specification.
- Produces: a validated starter deck whose inherited slide objects retain stable artifact IDs.

- [ ] **Step 1: Record the source checksum, slide count, dimensions, and visible text inventory**

Run the bundled template inspector and calculate a SHA-256 checksum. Expected: 8 slides, 16:9 layout, and one ordered text inventory per slide.

- [ ] **Step 2: Build the complete frame map**

Map output slides 1–8 to source slides 1–8. Classify every inherited object by stable artifact ID as `keep`, `rewrite-and-reposition`, `replace`, or `delete`; all visible text objects must remain represented.

- [ ] **Step 3: Validate the map and prepare the starter deck**

Run `validate_template_frame_map.py` and `prepare_template_starter.py`. Expected: validation succeeds and the starter contains exactly 8 slides with no unsupported additions.

### Task 2: Apply the Executive Editorial visual system

**Files:**
- Create: `scripts/presentations/build-bx-cf-executive-editorial.mjs`
- Read: `/private/tmp/bx-cf-executive-editorial/template-starter.pptx`
- Create: `landing/assets/BX-CF_ExecutiveEditorial.pptx`

**Interfaces:**
- Consumes: `template-starter.pptx`, stable artifact IDs, and the palette/type scale in Global Constraints.
- Produces: `landing/assets/BX-CF_ExecutiveEditorial.pptx` with all inherited content retained.

- [ ] **Step 1: Add reusable styling primitives**

Implement functions for light canvas backgrounds, cobalt section markers, navy/secondary typography, pale-blue emphasis, hairlines, consistent footer alignment, and safe text fitting. Every color and font must use the exact values in Global Constraints.

- [ ] **Step 2: Restyle slides 1–2**

Slide 1: left cobalt rail, large editorial title, and three aligned bottom metrics. Slide 2: full-width thesis with three open editorial columns separated by short top rules.

- [ ] **Step 3: Restyle slides 3–4**

Slide 3: three numbered horizontal report rows. Slide 4: equal-width FE/API/BE columns with a pale-blue API core and a full-width E2E validation band.

- [ ] **Step 4: Restyle slides 5–6**

Slide 5: three aligned month columns with consistent deliverable baselines. Slide 6: a restrained 2×3 editorial grid using short cobalt rules and no heavy outer cards.

- [ ] **Step 5: Restyle slides 7–8**

Slide 7: split impact and roadmap layout with growing `core → mci → full` bands and monitoring at lower right. Slide 8: three editorial columns with the center proof column highlighted in pale blue.

- [ ] **Step 6: Export the presentation**

Use `presentation.write()` to create `landing/assets/BX-CF_ExecutiveEditorial.pptx`. Expected: artifact-tool export succeeds with 8 slides.

### Task 3: Verify content, structure, and visual quality

**Files:**
- Read: `landing/assets/BX-CF.pptx`
- Read: `landing/assets/BX-CF_ExecutiveEditorial.pptx`
- Create: `/private/tmp/bx-cf-executive-editorial/rendered/slide-1.png` through `slide-8.png`
- Create: `/private/tmp/bx-cf-executive-editorial/contact-sheet.png`

**Interfaces:**
- Consumes: source and redesigned decks.
- Produces: objective checks and rendered slide evidence supporting delivery.

- [ ] **Step 1: Verify source preservation and package integrity**

Recalculate the source SHA-256 checksum and compare it with Task 1. Run `unzip -tq` on the output. Expected: source checksum unchanged and output package valid.

- [ ] **Step 2: Verify slide count and exact text equality**

Re-import both decks with artifact-tool, extract ordered visible text per slide, and compare exact strings. Expected: both decks have 8 slides and all eight text inventories are identical.

- [ ] **Step 3: Run overflow and bounds checks**

Run `slides_test.py` and artifact-tool inspection for out-of-bounds objects and text overflow. Expected: no unintended overlaps, no clipped text, and no objects outside slide bounds.

- [ ] **Step 4: Render and inspect every slide**

Render all eight slides at full size, generate a contact sheet, and inspect each full-size slide. Verify hierarchy, alignment, contrast, footer consistency, slide 4 equal columns, and slide 7 roadmap progression.

- [ ] **Step 5: Correct and re-run all checks if any defect is found**

Make only design corrections in `scripts/presentations/build-bx-cf-executive-editorial.mjs`, re-export, and repeat Steps 1–4 until every check passes.

### Task 4: Clean temporary working state and deliver

**Files:**
- Delete: `.superpowers/brainstorm/93825-1784092648/`
- Keep: `docs/superpowers/specs/2026-07-15-bx-cf-executive-editorial-redesign.md`
- Keep: `docs/superpowers/plans/2026-07-15-bx-cf-executive-editorial-redesign.md`
- Keep: `scripts/presentations/build-bx-cf-executive-editorial.mjs`
- Keep: `landing/assets/BX-CF_ExecutiveEditorial.pptx`

**Interfaces:**
- Consumes: verified output and temporary concept-review state.
- Produces: a clean workspace with one reproducible build script and one final presentation.

- [ ] **Step 1: Stop the local visual review server**

Terminate the companion server process and confirm the localhost process is no longer running.

- [ ] **Step 2: Remove only generated review-state files**

Delete the `.superpowers/brainstorm/93825-1784092648/` files created for this design review without touching unrelated user files.

- [ ] **Step 3: Report the final artifact**

Provide one absolute clickable link to `landing/assets/BX-CF_ExecutiveEditorial.pptx`, state that the original is preserved, and summarize the verification results.
