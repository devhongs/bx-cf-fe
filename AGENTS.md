# Agent Instructions

## Code conventions

- Before adding a new file or feature, inspect the existing file structure in the same domain.
- Prefer the established patterns under `entities`.
- Put TanStack Query related code in `model/*.queries.ts`.
- Define query keys with the object pattern: `xxxQueryKeys = { all, list, detail, ... }`.
- Put API calls in `api/*.api.ts`, types in `model/*.type.ts`, and storage/cache logic in `model/*.storage.ts`.
- If a change needs to diverge from the existing convention, explain why before implementing it.

## OpenAPI sync

When the user asks "openapi 동기화" or a similar question:

- Run `pnpm gen:api` to fetch the latest OpenAPI schema.
- Generate TypeScript types from the latest schema.
- Check the generated schema/type changes with `git diff -- packages/shared/src/shared/api`.
- Report the changed API surface and any follow-up code updates needed.
