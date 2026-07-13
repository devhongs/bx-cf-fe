# GitHub Project WBS Pull Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an idempotent command that imports untracked GitHub Project items into `docs/wbs.md`.

**Architecture:** A focused module owns normalization, duplicate detection, and Markdown rendering. A thin CLI queries Project V2 through `gh`, invokes the pure module, and either previews or appends the result.

**Tech Stack:** Node.js ESM, GitHub CLI, GitHub GraphQL API, node:test, pnpm

## Global Constraints

- Keep `docs/wbs.md` as the source of truth after an explicit pull.
- Never delete or rewrite existing WBS entries.
- Support GitHub Issue and DraftIssue items; ignore pull requests.
- Require a successful GitHub response before writing.

---

### Task 1: Pure WBS Import Transformation

**Files:**
- Create: `docs/wbs-pull.lib.js`
- Test: `docs/wbs-pull.test.mjs`

**Interfaces:**
- Consumes: Project item objects with `id`, `type`, `title`, `body`, `state`, `status`, and `priority`.
- Produces: `findUntrackedItems(wbs, items)` and `renderImportedSection(items)`.

- [x] **Step 1: Write failing tests for duplicate detection, field mapping, and Markdown rendering**
- [x] **Step 2: Run `node --test docs/wbs-pull.test.mjs` and confirm missing-module failure**
- [x] **Step 3: Implement the minimal pure functions**
- [x] **Step 4: Run the focused test and confirm all cases pass**

### Task 2: GitHub Project Pull CLI

**Files:**
- Create: `docs/wbs-pull.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: `gh api graphql` Project V2 response and optional `--dry-run`.
- Produces: an unchanged file, a preview, or an append-only update to `docs/wbs.md`.

- [x] **Step 1: Add a failing CLI normalization test using exported response conversion**
- [x] **Step 2: Run the focused test and confirm the expected failure**
- [x] **Step 3: Implement paginated Project querying and safe append behavior**
- [x] **Step 4: Add `wbs:pull` to package scripts**
- [x] **Step 5: Run focused tests and `pnpm wbs:pull -- --dry-run`**

### Task 3: Documentation and Final Verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the completed `wbs:pull` command.
- Produces: documented preview and update commands.

- [x] **Step 1: Document `pnpm wbs:pull -- --dry-run` and `pnpm wbs:pull`**
- [x] **Step 2: Run focused tests, Biome checks on changed scripts, and inspect `git diff`**
