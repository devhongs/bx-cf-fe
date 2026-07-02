# Agent Instructions

## OpenAPI sync

When the user asks "openapi 동기화" or a similar question:

- Run `pnpm gen:api` to fetch the latest OpenAPI schema.
- Generate TypeScript types from the latest schema.
- Check the generated schema/type changes with `git diff -- packages/shared/src/shared/api`.
- Report the changed API surface and any follow-up code updates needed.
