# BX-CF Dual Redesign — Ink + Lime / AI PROOF

## Objective

Create two fully redesigned PowerPoint decks from `landing/assets/BX-CF.pptx` while preserving the approved visible content.

- Output A: `landing/assets/BX-CF_InkLime.pptx`
- Output B: `landing/assets/BX-CF_AIProof.pptx`
- Both outputs contain eight slides.
- The former ninth decision slide stays deleted.
- Slide 4 retains the added E2E test automation content.

## Shared Design Principles

- Replace the repeated gray-card system with page-specific compositions.
- Avoid decorative alternation of colors between peer items.
- Use typography, scale, rule weight, asymmetric alignment, and intentional color fields to create hierarchy.
- Preserve all source copy on slides 1–8. The only permitted content addition is the existing Slide 4 E2E automation statement.
- Use Malgun Gothic for reliable Korean rendering.
- Keep the deck suitable for executive review: one dominant message per slide, strong titles, and legible body text.
- Do not use external images, icons, charts, or decorative illustrations.
- Reuse inherited source slides and objects through the validated template-following workflow, with declared replacements where the layout changes.

## Output A — Ink + Lime

### Visual language

- Primary palette: warm ivory `#F8F3E8`, ink `#0B0B0B`, acid lime `#C8FF29`, brand blue `#1359FF`, white `#FFFFFF`.
- No gray background panels.
- Acid lime is a signal color, not a repeating fill.
- Brand blue is used for anchors, selected full-bleed pages, and structural emphasis.
- Large numbers and words may crop beyond normal text columns when they remain readable.

### Slide compositions

1. **Cover** — Warm ivory canvas, brand-blue left edge, oversized two-line Korean title, lime highlight, and one thin metadata baseline.
2. **Definition** — Oversized pale `CF` monogram on the left; definition and supporting statement on the right; three bottom pillars separated by colored top rules rather than cards.
3. **Why now** — Approved F concept: black headline, acid-lime highlight, short quote, and a three-part matrix using only thin ink rules.
4. **Architecture** — Full ink canvas with one horizontal lime system rail linking Frontend, API, and Backend; E2E automation appears as a bordered lime lane at the bottom.
5. **Plan** — White canvas with oversized month numerals placed on a staggered timeline; no repeated boxes.
6. **Deliverables** — Full brand-blue canvas, oversized `06`, and six typographic deliverables organized by thin white rules.
7. **Impact** — Ivory/acid-lime split field; six outcomes as typographic lines on the left and the core → mci → full roadmap on the right.
8. **AI proof** — Full ink canvas, oversized ghost `AI`, and three proof areas distinguished by white, lime, and blue top rules.

## Output B — AI PROOF

### Visual language

- Primary palette: near-black `#07090C`, white `#F9FAFF`, brand blue `#1359FF`, electric cyan `#43E6FF`, acid lime `#C8FF29`.
- The Slide 8 AI proof aesthetic becomes the deck-wide system.
- Every slide uses an oversized ghost numeral or keyword as a spatial anchor.
- Thin luminous rails and signal colors replace card fills.
- Near-black remains the dominant field, but layouts and accent placement change per page to avoid template repetition.

### Slide compositions

1. **Cover** — Full near-black field with a cropped ghost `CF`, white title, blue edge light, and lime metadata rule.
2. **Definition** — Cropped `FOUNDATION` keyword across the background; definition on the left and three standards aligned to a cyan rail.
3. **Why now** — Oversized `WHY` ghost type; three problem-to-outcome statements positioned as staggered signal stops in white, cyan, and lime.
4. **Architecture** — Dark technical map with a blue/cyan system rail connecting Frontend, API, and Backend; E2E automation is a high-contrast lime verification lane.
5. **Plan** — Oversized `01 / 02 / 03` numerals across a stepped route; month content alternates above and below the route without panels.
6. **Deliverables** — Cropped ghost `06`; six deliverables placed on scan lines with one active lime item and blue/cyan secondary markers.
7. **Impact** — Dark blue-black split composition; benefits form a left-side vertical signal list, while the core → mci → full roadmap occupies a luminous right-side track.
8. **AI proof** — Preserve the approved black, ghost `AI`, and three evidence zones; use this slide as the system's visual culmination.

## Content and Layout Rules

- Use the current eight-slide `BX-CF.pptx` as the content baseline.
- Preserve visible copy exactly, including English technical terms and punctuation.
- Page numbers and footer metadata remain present but visually subordinate.
- Titles must not wrap unexpectedly.
- Architecture labels must remain legible without shrinking below the deck's practical body-text threshold.
- Slide 7 benefit text is redistributed without changing wording.
- Slide 9 must not appear in either output.

## Verification

For each output:

1. Confirm eight slides and absence of the deleted decision slide.
2. Compare normalized visible text against source slides 1–8.
3. Confirm Slide 4 includes the E2E automation statement.
4. Render all slides through PowerPoint-compatible rendering and inspect each slide at full size.
5. Run overflow detection and fix clipping, unintended overlap, or boundary violations.
6. Validate template mapping and structural fidelity for the inherited source deck.
7. Confirm both output files open successfully and have distinct checksums.
