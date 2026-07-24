# DataTableBox Default Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `DataTableBox` render its standard Header automatically from `onCreate` and `onDelete`, while reserving explicit `DataTableBox.Header` usage for additional actions.

**Architecture:** `DataTableBox` remains the owner of `selectedRows`. The root receives standard action callbacks and injects one default Header when needed; an explicitly declared Header replaces the implicit instance and adds its children beside the same standard actions. Admin pages provide only business callbacks and no longer compose a separate `BulkActionBar`.

**Tech Stack:** React 19, TypeScript, CSS Modules, Vitest, Testing Library

## Global Constraints

- Header omission must not suppress configured `등록` or `삭제` actions.
- Explicit `DataTableBox.Header` must not produce a duplicate Header.
- `onDelete` receives the internally managed `selectedRows`.
- `canDelete` is optional and only controls whether a visible delete button is enabled.
- Preserve delete confirmation, pending protection, success clearing, partial-failure retention, and exception retention.
- Keep actual delete API calls in each Admin page.
- Do not stage or commit implementation files while the existing Tailwind migration worktree is dirty.

---

### Task 1: Add Default Actions to DataTableBox

**Files:**
- Modify: `packages/shared/src/shared/ui/data-table-box/DataTableBox.test.tsx`
- Modify: `packages/shared/src/shared/ui/data-table-box/DataTableBox.tsx`

**Interfaces:**
- Consumes: existing `DataTable`, shared `Button`, `openDeleteConfirm`, and selection Context.
- Produces:

```ts
export type DataTableBoxDeleteHandler<T> = (
  selectedRows: T[],
) => undefined | T[] | Promise<undefined | T[]>;

export interface DataTableBoxProps<T> {
  rows: T[];
  getRowId: (row: T) => string | number;
  children: ReactNode;
  onCreate?: () => void;
  onDelete?: DataTableBoxDeleteHandler<T>;
  canDelete?: (selectedRows: T[]) => boolean;
}

export interface DataTableBoxHeaderProps {
  children?: ReactNode;
}
```

- [ ] **Step 1: Write failing tests for implicit and explicit Header behavior**

Add tests that render:

```tsx
<DataTableBox
  rows={rows}
  getRowId={(row) => row.id}
  onCreate={onCreate}
  onDelete={onDelete}
>
  <DataTableBox.Table columns={columns} />
</DataTableBox>
```

Verify `전체 3건` and `등록` appear without an explicit Header, `삭제` appears after selection, and `onDelete` receives the selected rows. Add a second test with:

```tsx
<DataTableBox rows={rows} getRowId={(row) => row.id} onCreate={onCreate}>
  <DataTableBox.Header>
    <button type="button">엑셀 다운로드</button>
  </DataTableBox.Header>
  <DataTableBox.Table columns={columns} />
</DataTableBox>
```

Verify there is one `<header>`, one `등록`, and one `엑셀 다운로드`.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm --filter @bx/shared test -- src/shared/ui/data-table-box/DataTableBox.test.tsx
```

Expected: FAIL because standard action props do not exist and omitting Header renders no standard actions.

- [ ] **Step 3: Implement the implicit Header and standard actions**

Add `onCreate`, `onDelete`, and `canDelete` to the root Context. Detect a direct `DataTableBox.Header` child with `Children.toArray` and `isValidElement`. Render one implicit Header before the remaining children only when no explicit Header exists and at least one standard action callback exists.

Inside Header:

```tsx
{children}
{selectionCount > 0 && onDelete ? (
  <Button
    type="button"
    variant="destructive"
    size="sm"
    disabled={pending || canDelete?.(selectedRows) === false}
    onClick={handleDelete}
  >
    <Trash2 size={14} />
    삭제
  </Button>
) : null}
{onCreate ? (
  <Button type="button" size="sm" onClick={onCreate}>
    <Plus size={15} />
    등록
  </Button>
) : null}
```

Keep the existing delete result contract:

```ts
const remainingRows = await onDelete([...selectedRows]);
setSelectedRows(Array.isArray(remainingRows) ? remainingRows : []);
```

- [ ] **Step 4: Run focused and full Shared verification**

Run:

```bash
pnpm --filter @bx/shared test -- src/shared/ui/data-table-box/DataTableBox.test.tsx
pnpm --filter @bx/shared test
pnpm --filter @bx/shared check
```

Expected: the focused test, all Shared tests, and TypeScript pass.

---

### Task 2: Remove Admin BulkActionBar Composition

**Files:**
- Modify: `apps/admin-portal/src/pages/codes/index.tsx`
- Modify: `apps/admin-portal/src/pages/menus/index.tsx`
- Modify: `apps/admin-portal/src/pages/users/index.tsx`
- Modify: `apps/admin-portal/src/pages/menus/index.test.tsx`
- Delete: `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.tsx`
- Delete: `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.module.css`
- Delete: `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.test.tsx`

**Interfaces:**
- Consumes: Task 1 `DataTableBoxProps<T>`.
- Produces: Admin pages with standard actions configured only through root props.

- [ ] **Step 1: Update the Admin integration test first**

Change the menu test to render the page without expecting a composed `BulkActionBar`. Select rows and verify the implicit Header still shows `등록` and `삭제`. Confirm deletion through the shared alert store and preserve the partial-failure assertion.

- [ ] **Step 2: Run the Admin test and verify RED**

Run:

```bash
pnpm --filter admin-portal test -- src/pages/menus/index.test.tsx
```

Expected: FAIL until the page moves `onCreate` and `onDelete` to `DataTableBox`.

- [ ] **Step 3: Migrate the three Admin pages**

Use this shape in codes, menus, and users:

```tsx
<DataTableBox
  rows={filteredRows}
  getRowId={getRowId}
  onCreate={() => openDrawer()}
  onDelete={handleBulkDelete}
>
  <DataTableBox.Table columns={columns} pageSize={10} />
</DataTableBox>
```

Remove page imports of `Plus`, `Button`, and `BulkActionBar`. Delete the now-unused BulkActionBar files.

- [ ] **Step 4: Run Admin tests and typecheck**

Run:

```bash
pnpm --filter admin-portal test
pnpm --filter admin-portal check
```

Expected: all Admin tests and TypeScript pass.

---

### Task 3: Final Regression Verification

**Files:**
- Verify all files modified in Tasks 1 and 2.

**Interfaces:**
- Consumes: completed Shared and Admin changes.
- Produces: verification evidence only.

- [ ] **Step 1: Run repository checks**

Run:

```bash
pnpm --filter @bx/shared test
pnpm --filter admin-portal test
pnpm --filter @bx/shared check
pnpm --filter admin-portal check
pnpm --filter pc-web check
pnpm --filter mobile-web check
pnpm lint
pnpm check:css-tokens
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Audit obsolete composition**

Run:

```bash
rg -n "BulkActionBar|<DataTableBox\\.Header>[[:space:]]*<BulkActionBar" apps/admin-portal/src
```

Expected: no matches.

- [ ] **Step 3: Self-review the final diff**

Confirm:

- Header omission still renders configured default actions.
- Explicit Header produces only one Header.
- No selected-row state moved into an Admin page.
- No generated `dist`, `.turbo`, Playwright report, or test-results directories remain.
