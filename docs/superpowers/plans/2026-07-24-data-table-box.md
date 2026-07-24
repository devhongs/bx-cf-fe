# DataTableBox and Admin List Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compound `DataTableBox` that owns table selection state, place registration and selection actions in its header, and add explicit query/reset behavior to Admin list filters.

**Architecture:** `DataTableBox` is a shared Context provider with `Header` and `Table` compound components. `DataTableBox.Table` connects the existing `DataTable` to the provider-owned selection state, while Admin's `BulkActionBar` consumes that state and reports selected items through a delete callback. `AdminFilterBar` remains outside the box and only manages draft query controls.

**Tech Stack:** React 19, TypeScript, CSS Modules, TanStack Table, Vitest, Testing Library, Vite

## Global Constraints

- Use CSS Modules and existing semantic CSS variables; do not add raw color values.
- Keep `DataTable` standalone usage backward compatible.
- Use button labels `조회`, `초기화`, `등록`, and `삭제` without business-name prefixes.
- Keep `등록` visible at the right edge of `DataTableBox.Header` whether rows are selected or not.
- Keep actual delete API calls in each Admin page.
- Do not add fake status-change or miscellaneous actions without a real handler.
- Preserve partial-delete behavior by keeping callback-returned items selected.
- Do not stage or commit implementation files while the existing Tailwind migration worktree is dirty; commits listed below are handoff checkpoints only.

---

## File Structure

- Create `packages/shared/src/shared/ui/data-table-box/DataTableBox.tsx`
  - Generic selection Context, compound root/header/table components, and selection hook.
- Create `packages/shared/src/shared/ui/data-table-box/DataTableBox.module.css`
  - Unified header/table container styling and embedded DataTable CSS variables.
- Create `packages/shared/src/shared/ui/data-table-box/DataTableBox.test.tsx`
  - Selection, summary, clear-selection, and compound rendering tests.
- Modify `packages/shared/src/shared/ui/data-table/DataTable.module.css`
  - Make outer border and radius overridable by inherited CSS variables.
- Modify `packages/shared/src/shared/ui/index.ts`
  - Export `DataTableBox` and its selection hook.
- Modify `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.tsx`
  - Consume `DataTableBox` Context and invoke the selected-items delete callback.
- Modify `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.module.css`
  - Render inline actions suitable for `DataTableBox.Header`.
- Create `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.test.tsx`
  - Delete callback, success, partial failure, cancellation, and error-selection tests.
- Modify `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.tsx`
  - Replace result/registration controls with explicit query and reset controls.
- Modify `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.module.css`
  - Style the query control group.
- Create `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.test.tsx`
  - Submit, Enter, and reset behavior.
- Modify `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.stories.tsx`
  - Demonstrate the new filter-only API.
- Modify `apps/admin-portal/src/pages/codes/index.tsx`
  - Use draft/applied filters and compound `DataTableBox`.
- Modify `apps/admin-portal/src/pages/menus/index.tsx`
  - Use draft/applied filters and compound `DataTableBox`.
- Modify `apps/admin-portal/src/pages/users/index.tsx`
  - Use draft/applied filters and compound `DataTableBox`.
- Modify `apps/admin-portal/src/pages/menus/index.test.tsx`
  - Exercise the real selection/delete integration and partial-failure retention.

---

### Task 1: Shared DataTableBox Compound Component

**Files:**
- Create: `packages/shared/src/shared/ui/data-table-box/DataTableBox.tsx`
- Create: `packages/shared/src/shared/ui/data-table-box/DataTableBox.module.css`
- Create: `packages/shared/src/shared/ui/data-table-box/DataTableBox.test.tsx`
- Modify: `packages/shared/src/shared/ui/data-table/DataTable.module.css`
- Modify: `packages/shared/src/shared/ui/index.ts`

**Interfaces:**
- Consumes: `DataTable<T>` and `DataTableProps<T>` from `shared/ui/data-table/DataTable`.
- Produces:

```ts
export interface DataTableBoxProps<T> {
  rows: T[];
  getRowId: (row: T) => string | number;
  children: ReactNode;
}

export interface DataTableBoxSelection<T> {
  rows: T[];
  getRowId: (row: T) => string | number;
  selectedItems: T[];
  selectedRowIds: Array<string | number>;
  selectionCount: number;
  setSelectedItems: (items: T[]) => void;
  clearSelection: () => void;
}

export function useDataTableBoxSelection<T>(): DataTableBoxSelection<T>;

export const DataTableBox: {
  <T>(props: DataTableBoxProps<T>): ReactElement;
  Header: (props: { children: ReactNode }) => ReactElement;
  Table: <T>(
    props: Omit<
      DataTableProps<T>,
      'rows' | 'getRowId' | 'selectable' | 'selectedRowIds' | 'onSelectionChange'
    >,
  ) => ReactElement;
};
```

- [ ] **Step 1: Write failing compound-component tests**

Create tests covering:

```tsx
function Example() {
  return (
    <DataTableBox rows={rows} getRowId={(row) => row.id}>
      <DataTableBox.Header>
        <button type="button">등록</button>
      </DataTableBox.Header>
      <DataTableBox.Table columns={columns} />
    </DataTableBox>
  );
}

render(<Example />);
expect(screen.getByText('전체 3건')).toBeTruthy();
expect(screen.getByRole('button', { name: '등록' })).toBeTruthy();

fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));
expect(screen.getByText('1건 선택됨')).toBeTruthy();
expect(screen.getByRole('button', { name: '선택 해제' })).toBeTruthy();

fireEvent.click(screen.getByRole('button', { name: '선택 해제' }));
expect(screen.getByText('전체 3건')).toBeTruthy();
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```bash
cd packages/shared
./node_modules/.bin/vitest run src/shared/ui/data-table-box/DataTableBox.test.tsx
```

Expected: FAIL because `DataTableBox` does not exist.

- [ ] **Step 3: Implement the Context and compound components**

Implement:

```tsx
const DataTableBoxContext = createContext<DataTableBoxContextValue<unknown> | null>(null);

export function useDataTableBoxSelection<T>() {
  const value = useContext(DataTableBoxContext);
  if (!value) {
    throw new Error('DataTableBox compound components must be used inside DataTableBox.');
  }
  return value as DataTableBoxContextValue<T>;
}

function DataTableBoxRoot<T>({ rows, getRowId, children }: DataTableBoxProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const selectedRowIds = selectedItems.map(getRowId);
  const clearSelection = useCallback(() => setSelectedItems([]), []);

  const value = useMemo(
    () => ({
      rows,
      getRowId,
      selectedItems,
      selectedRowIds,
      selectionCount: selectedItems.length,
      setSelectedItems,
      clearSelection,
    }),
    [clearSelection, getRowId, rows, selectedItems, selectedRowIds],
  );

  return (
    <DataTableBoxContext.Provider value={value as DataTableBoxContextValue<unknown>}>
      <section className={styles.box}>{children}</section>
    </DataTableBoxContext.Provider>
  );
}

function DataTableBoxHeader({ children }: { children: ReactNode }) {
  const { rows, selectionCount, clearSelection } = useDataTableBoxSelection<unknown>();

  return (
    <header className={styles.header}>
      <div className={styles.summary} aria-live="polite">
        {selectionCount > 0 ? (
          <>
            <strong>{selectionCount}건 선택됨</strong>
            <button type="button" className={styles.clear} onClick={clearSelection}>
              선택 해제
            </button>
          </>
        ) : (
          <span>전체 {rows.length}건</span>
        )}
      </div>
      <div className={styles.actions}>{children}</div>
    </header>
  );
}

function DataTableBoxTable<T>(
  props: Omit<
    DataTableProps<T>,
    'rows' | 'getRowId' | 'selectable' | 'selectedRowIds' | 'onSelectionChange'
  >,
) {
  const context = useDataTableBoxSelection<T>();
  return (
    <DataTable
      {...props}
      rows={context.rows}
      getRowId={context.getRowId}
      selectable
      selectedRowIds={context.selectedRowIds}
      onSelectionChange={context.setSelectedItems}
    />
  );
}
```

Attach the compound members with `Object.assign(DataTableBoxRoot, { Header, Table })`.

- [ ] **Step 4: Make DataTable embeddable through CSS variables**

Change the existing wrapper declarations to:

```css
.tableWrap {
  overflow: auto;
  border: var(--data-table-border, 1px solid var(--border));
  border-radius: var(--data-table-border-radius, 8px);
  background: var(--surface);
}
```

Set these values from `DataTableBox.module.css`:

```css
.box {
  --data-table-border: 0;
  --data-table-border-radius: 0;

  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
```

Style `.header`, `.summary`, `.clear`, and `.actions` with existing semantic variables.

- [ ] **Step 5: Export the component and run shared tests**

Add:

```ts
export * from './data-table-box/DataTableBox';
```

Run:

```bash
cd packages/shared
./node_modules/.bin/vitest run src/shared/ui/data-table-box/DataTableBox.test.tsx src/shared/ui/data-table/DataTable.test.tsx
./node_modules/.bin/tsc --noEmit
```

Expected: all selected tests pass and TypeScript exits 0.

- [ ] **Step 6: Commit checkpoint**

```bash
git add packages/shared/src/shared/ui/data-table-box packages/shared/src/shared/ui/data-table/DataTable.module.css packages/shared/src/shared/ui/index.ts
git commit -m "feat: add data table box"
```

Skip this checkpoint in the current dirty worktree unless the user explicitly requests implementation commits.

---

### Task 2: Context-Aware BulkActionBar

**Files:**
- Modify: `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.tsx`
- Modify: `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.module.css`
- Create: `apps/admin-portal/src/shared/ui/bulk-action-bar/BulkActionBar.test.tsx`

**Interfaces:**
- Consumes:

```ts
useDataTableBoxSelection<T>(): DataTableBoxSelection<T>
```

- Produces:

```ts
export type BulkDeleteHandler<T> = (
  selectedItems: T[],
) => undefined | T[] | Promise<undefined | T[]>;

export interface BulkActionBarProps<T> {
  children?: ReactNode;
  onDelete: BulkDeleteHandler<T>;
}
```

- [ ] **Step 1: Write failing delete-action tests**

Render `BulkActionBar` inside the Task 1 example and verify:

```tsx
expect(screen.queryByRole('button', { name: '삭제' })).toBeNull();

fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));
expect(screen.getByRole('button', { name: '삭제' })).toBeTruthy();

mockOpenDeleteConfirm.mockResolvedValue(true);
fireEvent.click(screen.getByRole('button', { name: '삭제' }));
await waitFor(() => expect(onDelete).toHaveBeenCalledWith([rows[0]]));
```

Add separate cases for:

- `onDelete` returning `undefined` clears selection.
- `onDelete` returning `[rows[0]]` keeps that row selected.
- `onDelete` throwing keeps the original selection.
- confirmation returning `false` does not call `onDelete`.
- `children` render before the delete button only while items are selected.

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
cd apps/admin-portal
./node_modules/.bin/vitest run src/shared/ui/bulk-action-bar/BulkActionBar.test.tsx
```

Expected: FAIL because the current component requires external count and clear callbacks.

- [ ] **Step 3: Implement Context-driven deletion**

Implement the action flow:

```tsx
export function BulkActionBar<T>({ children, onDelete }: BulkActionBarProps<T>) {
  const { selectedItems, selectionCount, setSelectedItems } =
    useDataTableBoxSelection<T>();
  const [pending, setPending] = useState(false);

  if (selectionCount === 0) return null;

  const handleDelete = async () => {
    const confirmed = await openDeleteConfirm({
      message: `선택한 ${selectionCount}건을 삭제하시겠습니까?`,
    });
    if (!confirmed) return;

    setPending(true);
    try {
      const remainingItems = await onDelete([...selectedItems]);
      setSelectedItems(remainingItems ?? []);
    } catch {
      // 업무 MutationCache가 오류를 표시하며 선택은 재시도를 위해 유지한다.
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.actions}>
      {children}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={pending}
      >
        <Trash2 size={14} />
        삭제
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Run the tests and TypeScript**

Run:

```bash
cd apps/admin-portal
./node_modules/.bin/vitest run src/shared/ui/bulk-action-bar/BulkActionBar.test.tsx
./node_modules/.bin/tsc --noEmit
```

Expected: all BulkActionBar tests pass and TypeScript exits 0.

- [ ] **Step 5: Commit checkpoint**

```bash
git add apps/admin-portal/src/shared/ui/bulk-action-bar
git commit -m "refactor: connect bulk actions to table selection"
```

Skip this checkpoint in the current dirty worktree unless the user explicitly requests implementation commits.

---

### Task 3: Explicit Admin Query Controls

**Files:**
- Modify: `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.tsx`
- Modify: `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.module.css`
- Create: `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.test.tsx`
- Modify: `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.stories.tsx`

**Interfaces:**
- Produces:

```ts
interface AdminFilterBarProps {
  searchValue: string;
  searchPlaceholder?: string;
  statusValue?: string;
  statusGroupCd?: string;
  extra?: ReactNode;
  onSearchChange: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}
```

- [ ] **Step 1: Write failing filter form tests**

Verify:

```tsx
fireEvent.click(screen.getByRole('button', { name: '조회' }));
expect(onSearch).toHaveBeenCalledTimes(1);

fireEvent.submit(screen.getByRole('textbox').closest('form') as HTMLFormElement);
expect(onSearch).toHaveBeenCalledTimes(2);

fireEvent.click(screen.getByRole('button', { name: '초기화' }));
expect(onReset).toHaveBeenCalledTimes(1);
```

Also assert that result and registration elements are not part of `AdminFilterBar`.

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
cd apps/admin-portal
./node_modules/.bin/vitest run src/shared/ui/admin-filter-bar/AdminFilterBar.test.tsx
```

Expected: FAIL because `조회` and `초기화` buttons do not exist.

- [ ] **Step 3: Implement a semantic query form**

Replace the root `div` with:

```tsx
<form
  className={styles.bar}
  onSubmit={(event) => {
    event.preventDefault();
    onSearch();
  }}
>
  {/* existing search input, status Select, and extra control */}
  <div className={styles.actions}>
    <Button type="submit" size="sm">조회</Button>
    <Button type="button" size="sm" variant="outline" onClick={onReset}>
      초기화
    </Button>
  </div>
</form>
```

Remove `resultLabel`, `primaryActionLabel`, and `onPrimaryAction`.

- [ ] **Step 4: Update the Storybook example**

The story must keep draft values and show `조회` and `초기화` callbacks:

```tsx
<AdminFilterBar
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  onSearch={() => setSubmittedValue(searchValue)}
  onReset={() => {
    setSearchValue('');
    setSubmittedValue('');
  }}
/>
```

- [ ] **Step 5: Run filter tests and lint**

Run:

```bash
cd apps/admin-portal
./node_modules/.bin/vitest run src/shared/ui/admin-filter-bar/AdminFilterBar.test.tsx
cd ../..
./node_modules/.bin/biome lint apps/admin-portal/src/shared/ui/admin-filter-bar
```

Expected: tests pass and Biome reports no errors.

- [ ] **Step 6: Commit checkpoint**

```bash
git add apps/admin-portal/src/shared/ui/admin-filter-bar
git commit -m "feat: add explicit admin query controls"
```

Skip this checkpoint in the current dirty worktree unless the user explicitly requests implementation commits.

---

### Task 4: Migrate Admin List Pages

**Files:**
- Modify: `apps/admin-portal/src/pages/codes/index.tsx`
- Modify: `apps/admin-portal/src/pages/menus/index.tsx`
- Modify: `apps/admin-portal/src/pages/users/index.tsx`
- Modify: `apps/admin-portal/src/pages/menus/index.test.tsx`

**Interfaces:**
- Consumes `DataTableBox`, `Button`, `BulkActionBar`, and the new `AdminFilterBar` API.
- Produces explicit draft/applied filter state and page-specific delete callbacks:

```ts
const handleBulkDelete = async (
  selectedItems: Entity[],
): Promise<Entity[]> => {
  const { failed } = await deleteSelectedItems(selectedItems, deleteOne);
  return failed;
};
```

- [ ] **Step 1: Update MenusPage integration test to use real selection actions**

Remove the `BulkActionBar` mock. Select two rows through the real checkboxes, confirm deletion, click `삭제`, and verify:

```tsx
expect(screen.getByText('2건 선택됨')).toBeTruthy();
fireEvent.click(screen.getByRole('button', { name: '삭제' }));

await waitFor(() => {
  expect(screen.getByText('1건 선택됨')).toBeTruthy();
});

expect(screen.getByRole('button', { name: '등록' })).toBeTruthy();
```

- [ ] **Step 2: Run the MenusPage test and verify RED**

Run:

```bash
cd apps/admin-portal
./node_modules/.bin/vitest run src/pages/menus/index.test.tsx
```

Expected: FAIL because the page still owns checked rows and uses the old layout.

- [ ] **Step 3: Add draft/applied filter state to each page**

For codes and menus:

```tsx
const emptyFilters = { search: '', status: '' };
const [draftFilters, setDraftFilters] = useState(emptyFilters);
const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

const handleReset = () => {
  setDraftFilters(emptyFilters);
  setAppliedFilters(emptyFilters);
};
```

For users include `userType` in both objects. Filter rows from `appliedFilters`, while inputs update `draftFilters`.

- [ ] **Step 4: Replace the three page layouts**

Use this structure in codes, menus, and users:

```tsx
<AdminFilterBar
  searchValue={draftFilters.search}
  statusValue={draftFilters.status}
  searchPlaceholder="..."
  onSearchChange={(search) =>
    setDraftFilters((current) => ({ ...current, search }))
  }
  onStatusChange={(status) =>
    setDraftFilters((current) => ({ ...current, status }))
  }
  onSearch={() => setAppliedFilters(draftFilters)}
  onReset={handleReset}
/>

<DataTableBox rows={filteredRows} getRowId={getRowId}>
  <DataTableBox.Header>
    <BulkActionBar onDelete={handleBulkDelete} />
    <Button type="button" size="sm" onClick={() => openDrawer()}>
      <Plus size={15} />
      등록
    </Button>
  </DataTableBox.Header>

  <DataTableBox.Table
    columns={columns}
    selectedId={selectedId}
    onRowSelect={openSelectedDrawer}
    pageSize={10}
  />
</DataTableBox>
```

Remove page-owned `checkedGroups`, `checkedMenus`, and `checkedUsers` state. Remove `openDeleteConfirm` imports because `BulkActionBar` owns confirmation.

- [ ] **Step 5: Return partial deletion failures**

Codes:

```ts
const handleBulkDelete = async (
  selectedGroups: CommonCodeGroup[],
): Promise<CommonCodeGroup[]> => {
  const deletable = selectedGroups.filter(
    (group): group is CommonCodeGroup & { groupCd: string } => Boolean(group.groupCd),
  );
  const skipped = selectedGroups.filter((group) => !group.groupCd);
  const { failed } = await deleteSelectedItems(
    deletable,
    (group) => deleteGroup.mutateAsync(group.groupCd),
  );
  return [...skipped, ...failed];
};
```

Apply the same return pattern to menus and users.

- [ ] **Step 6: Run page tests and Admin type check**

Run:

```bash
cd apps/admin-portal
./node_modules/.bin/vitest run src/pages/codes/index.test.tsx src/pages/menus/index.test.tsx
./node_modules/.bin/tsc --noEmit
```

Expected: all page tests pass and TypeScript exits 0.

- [ ] **Step 7: Commit checkpoint**

```bash
git add apps/admin-portal/src/pages/codes/index.tsx apps/admin-portal/src/pages/menus/index.tsx apps/admin-portal/src/pages/users/index.tsx apps/admin-portal/src/pages/menus/index.test.tsx
git commit -m "feat: group admin table actions"
```

Skip this checkpoint in the current dirty worktree unless the user explicitly requests implementation commits.

---

### Task 5: Full Verification and Generated Artifact Cleanup

**Files:**
- Verify all modified files.
- Do not retain `dist`, `.turbo`, `playwright-report`, or `test-results`.

- [ ] **Step 1: Run focused and full unit tests**

```bash
cd packages/shared
./node_modules/.bin/vitest run
cd ../../apps/admin-portal
./node_modules/.bin/vitest run
```

Expected: all Shared and Admin tests pass.

- [ ] **Step 2: Run type checks and policy checks**

```bash
cd packages/shared
./node_modules/.bin/tsc --noEmit
cd ../../apps/admin-portal
./node_modules/.bin/tsc --noEmit
cd ../..
node scripts/check-css-tokens.mjs
./node_modules/.bin/biome lint packages/shared/src/shared/ui/data-table packages/shared/src/shared/ui/data-table-box apps/admin-portal/src/shared/ui apps/admin-portal/src/pages
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 3: Build Admin**

```bash
cd apps/admin-portal
./node_modules/.bin/vite build
```

Expected: Vite build succeeds. The existing large-chunk warning is non-blocking.

- [ ] **Step 4: Run Admin Chromium E2E**

```bash
cd apps/admin-portal
CI=1 pnpm_config_pm_on_fail=ignore ./node_modules/.bin/playwright test --project=chromium
```

Expected: one Chromium scenario passes.

- [ ] **Step 5: Remove generated local artifacts**

Remove only these exact generated directories if present:

```text
apps/admin-portal/dist
apps/admin-portal/.turbo
apps/admin-portal/playwright-report
apps/admin-portal/test-results
```

Verify none appear in `git status`.
