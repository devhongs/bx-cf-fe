# Admin Drawer Form Refactor Plan

> **Constraint:** Work in the current workspace and do not create a commit.

## Goal

Remove unsafe code-group fallback initialization, isolate the code-list field array, and share the repeated admin drawer form actions without moving feature mutations into shared UI.

## Steps

1. Add tests for code-group detail loading/error states and delete confirmation behavior.
2. Remove the code-group `fallback` prop and render the update form only after detail data is ready.
3. Move code-group form value types to `model` and extract the dynamic rows into `CodeListFields`.
4. Add `AdminDrawerFormActions`, including the common delete confirmation, and use it in code-group, menu, and user drawers.
5. Run the Admin Portal tests, TypeScript check, Vite build, Biome check, and `git diff --check`.

