# BX-CF Executive Deck Redesign

## Goal

Create two fully redesigned executive presentation variants that secure approval for two decisions:

1. Assign two people for three months to build Channel Foundation phase 1.
2. Approve the proposed direction and bounded phase-1 scope.

By the end, executives should approve the phase-1 investment because Channel Foundation converts repeated project setup into a reusable delivery asset while limiting the initial scope to work that can be completed and validated in three months.

## Audience and communication constraints

- Primary audience: executives and senior decision-makers who may not have a software-development background.
- Communication job: enable a resource-and-scope decision, not provide a detailed technical briefing.
- Lead with business meaning, investment boundaries, and execution confidence.
- Use technical terms only where they establish feasibility or define the reusable asset.
- Do not invent savings percentages, delivery-time reductions, ROI, customer outcomes, or other unsupported metrics.
- Treat the current `landing/assets/BX-CF.pptx` and the stakeholder comments in `docs/ppt-intro.md` as the content sources of truth.

## Deliverables

- `landing/assets/BX-CF_codex_A.pptx` — Executive Decision
- `landing/assets/BX-CF_codex_B.pptx` — Midnight Blueprint

The source PPTX and existing backups remain unchanged.

## Shared narrative

Both variants use the same eight decision beats, but change their opening emphasis and visual rhythm.

1. **Decision summary** — request approval for two people, three months, and phase 1.
2. **Why action is needed** — repeated FE/BE setup consumes time and produces inconsistent starting points; customer-specific differences still require controlled extension points.
3. **Investment logic** — turn one-off setup work into a reusable organizational delivery asset.
4. **Phase-1 boundary** — include common structure, authentication/authorization, gateway, MCI integration foundation, API/type automation, sample flow, tests, and development guidance; exclude customer-specific business logic and production-grade productization.
5. **Foundation structure** — explain Frontend, Backend, MCI, and OpenAPI/TypeBridge as one reusable base in executive-friendly language.
6. **Three-month execution** — month 1 establishes the base, month 2 implements core shared flows, and month 3 validates integration, E2E automation, samples, and guidance.
7. **Expected impact and expansion** — faster project initiation, clearer customization boundaries, reusable integration structure, pre-sales/PoC support, and later `core`, `mci`, and `full` modules. Include the main guardrails and risks without unsupported numerical claims.
8. **Approval close** — repeat the requested decision and state the immediate post-approval start items.

The original AI-development material is not retained as a standalone section. It is condensed into slide 6 as an execution enabler for analysis, consistency checks, automation, and quality, so it supports rather than competes with the investment decision.

## Variant A — Executive Decision

### Story emphasis

Lead with the decision and move quickly through the minimum evidence needed to approve it:

`approval request -> recurring problem -> phase-1 boundary -> feasible structure -> execution plan -> impact -> guardrails -> approval`

### Visual system

- Dark charcoal background, electric mint accent, white primary text, cool-gray secondary text.
- Large, direct claim titles and explicit decision callouts.
- Sparse compositions with one dominant message per slide.
- Strong contrast and short reading paths suitable for a live executive meeting.
- Use flat planes, rules, and limited geometry; avoid dashboard-like card grids.

## Variant B — Midnight Blueprint

### Story emphasis

Frame the work as a controlled organizational asset investment before resolving into the same approval request:

`asset thesis -> current friction -> standardize/extend model -> phase-1 boundary -> foundation blueprint -> validation roadmap -> expansion path -> approval`

### Visual system

- Deep navy background, cobalt blue for structure, amber for investment and decision emphasis, near-white text.
- Fine grid and blueprint cues used as restrained background structure.
- More structured diagrams and stepwise sequencing than variant A, while keeping executive-level density.
- Suitable for both presentation and document circulation.
- Use cobalt for architecture and process; reserve amber for the decision, selected scope, and milestones.

## Content treatment by slide

| Slide | Executive takeaway | Content treatment |
| --- | --- | --- |
| 1 | Approve a bounded 2-person, 3-month phase 1 | Minimal cover with the request and one-sentence rationale |
| 2 | Repeated setup is a recurring delivery problem | Three concise causes: no common base, customer differences, available timing |
| 3 | Foundation standardizes the common core and isolates variation | Plain-language definition plus `standard core / extension points` model |
| 4 | Phase 1 is deliberately limited | Clear `included / excluded` boundary; customer business logic is excluded |
| 5 | The proposed base is technically coherent and reusable | Simplified FE–API–BE–MCI blueprint with OpenAPI/type automation highlighted |
| 6 | Two people can produce verifiable outputs in three months | Monthly milestones, concrete deliverables, E2E validation, AI-enabled quality support |
| 7 | The asset improves delivery and creates a staged expansion path | Qualitative impact, `core -> mci -> full`, and concise guardrails/risks |
| 8 | The decision and next action are unambiguous | Restate approval request and immediate kickoff actions |

## Source-slide mapping strategy

The current deck is the source presentation and content inventory. Output slides will inherit and edit the closest source slide rather than overwrite the original file:

- Output 1 <- source 1
- Output 2 <- source 3
- Output 3 <- source 2
- Output 4 <- source 6
- Output 5 <- source 4
- Output 6 <- source 5
- Output 7 <- source 7
- Output 8 <- source 9

Source slide 8 is omitted because its useful AI material is condensed into the execution slide. Every output slide is restyled under the user-approved redesign direction; inherited content elements are explicitly rewritten, repositioned, replaced, or deleted in the template frame map.

## Implementation constraints

- Use JavaScript ES modules and `@oai/artifact-tool`; do not use `python-pptx` or direct OOXML mutation.
- Preserve the source deck and export two new PPTX files.
- Keep Korean copy natural and executive-facing.
- Use at least 35 pt for slide titles and at least 16 pt for body text; shorten copy before reducing size.
- Do not use external research or generated evidence. Any visual structure must be based on source content.
- Keep diagrams simple and editable. Use native PowerPoint shapes only where they materially improve comprehension.
- All inherited placeholders must be filled or explicitly removed.

## Verification

- Render every slide in both variants and inspect each slide at full size.
- Review each deck as a contact sheet for pacing, hierarchy, and consistency.
- Run overflow and slide-boundary checks.
- Inspect for unintended overlap, clipping, unexpected wrapping, unresolved placeholders, inconsistent page markers, and missing source content.
- Verify the final narrative supports the two requested approvals and does not overstate quantified benefits.
- Run template-fidelity checks against each mapped starter deck, allowing only documented redesign deviations.

## Success criteria

- An executive can identify the requested decision from slide 1 and slide 8 without presenter explanation.
- Phase-1 included and excluded scope is explicit.
- The two variants feel meaningfully different while reaching the same decision.
- Technical detail demonstrates feasibility without dominating the business case.
- Both PPTX files open, render, and pass layout and placeholder QA.
