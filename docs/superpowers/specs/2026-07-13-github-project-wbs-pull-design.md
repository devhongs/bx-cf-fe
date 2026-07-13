# GitHub Project to WBS Pull Design

## Goal

Import GitHub Project items that are not represented in `docs/wbs.md`, while keeping `docs/wbs.md` as the source of truth for subsequent GitHub pushes.

## Direction

The pull is explicit and one-way. `pnpm wbs:pull` reads Project V2 items, compares them with the local WBS, and appends only untracked work. It never deletes or rewrites existing WBS entries.

## Mapping

- GitHub Issue and DraftIssue items are importable; pull requests are ignored.
- Closed issues and Project items whose Status is `Done` become checked WBS items.
- Project Priority values `P0`, `P1`, and `P2` map to `Must`, `Should`, and `Could`.
- Imported issue bodies are retained as indented Markdown beneath the item.
- New items are appended under `### GitHub Project 가져오기` because the Project does not contain the WBS section hierarchy.
- A `<!-- github-item:TYPE:ID -->` marker provides a stable identity. Existing WBS entries without markers also match by normalized title for backward compatibility.

## Safety

- `--dry-run` prints the proposed additions without changing `docs/wbs.md`.
- An empty or failed GitHub response must not modify the WBS.
- Re-running the command is idempotent.
- GitHub access continues to use the existing authenticated `gh` CLI and Project constants.

## Verification

Pure functions for item normalization, duplicate detection, and Markdown generation are tested with Node's built-in test runner. CLI behavior is verified first with `--dry-run`, then an explicit live pull can update the WBS.
