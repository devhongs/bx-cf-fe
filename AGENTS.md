# Agent Instructions

## API schema check

When the user asks "api 변경됐는지 확인해줘" or a similar question:

- Do not run `pnpm gen:api` immediately.
- Generate OpenAPI types into a temporary directory only.
- Compare the temporary output with `packages/shared/src/shared/api`.
- If there is no diff, report that the API spec has not changed.
- If there is a diff, ask the user for confirmation before running `pnpm gen:api`.
- Run `pnpm gen:api` only after explicit user approval.
