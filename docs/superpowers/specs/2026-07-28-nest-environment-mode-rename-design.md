# Nest Environment Mode Rename Design

## Goal

Rename the local backend Vite mode from `spring` to `nest` so the command and
environment file names match the backend that developers actually run on
`http://127.0.0.1:18081`.

## Scope

- Rename each app's `.env.spring` file to `.env.nest`.
- Replace the three `dev:<app>:spring` commands with `dev:<app>:nest`.
- Update Vite environment and proxy tests to resolve the `nest` mode.
- Update runtime-facing README instructions and examples to use Nest terminology.
- Update the personal override example from `.env.spring.local` to `.env.nest.local`.

## Compatibility

The old `spring` mode, scripts, and environment files will not remain as aliases.
This configuration was introduced recently, so keeping both names would preserve
the ambiguity the rename is intended to remove.

## Non-goals

- Do not change the remote backend target or production API URL.
- Do not alter API wrappers, payload contracts, or generated OpenAPI types.
- Do not globally replace every historical or architecture-level mention of
  Spring in presentation material or unrelated source comments.
- Do not regenerate landing README HTML.

## Verification

- A contract test must fail before implementation because `dev:<app>:nest` and
  `.env.nest` do not exist.
- The focused environment tests must pass after the rename.
- `pnpm dev:pc:nest --help` must forward `--mode nest`.
- Biome, TypeScript checks, and `git diff --check` must pass.
- No `.env.spring` file or `dev:<app>:spring` command may remain.
