# WBS Notion Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize `docs/wbs.md` into the existing Notion `FE WBS` data source.

**Architecture:** Pure functions parse WBS Markdown and map tasks to Notion properties. A Node CLI queries pages by `Sync Key`, previews changes in dry-run mode, then creates or updates pages with rate-limit retries.

**Tech Stack:** Node.js ESM, node:test, Notion REST API 2026-03-11

## Global Constraints

- `docs/wbs.md` remains the source of truth.
- Never delete Notion pages.
- Preserve `In progress` for unchecked existing tasks.
- Use the existing `FE WBS` data source only.
- Create WBS sections as parent tasks and link work through `Parent task`.
- Render purpose, work details, and acceptance criteria as page blocks.

---

### Task 1: Parse and Map WBS Tasks

- [x] Write failing parser and property mapping tests.
- [x] Run tests and confirm missing module failure.
- [x] Implement pure parsing and mapping functions.
- [x] Run tests and confirm pass.

### Task 2: Implement Notion Sync CLI

- [x] Query existing pages with pagination.
- [x] Add dry-run create/update/unchanged summary.
- [x] Add create/update calls with 429 retry handling.
- [x] Add package script and README usage.

### Task 3: Verify and Execute

- [x] Run tests, syntax check, and Biome.
- [x] Run dry-run and inspect counts.
- [x] Execute live sync and rerun dry-run for idempotency.
