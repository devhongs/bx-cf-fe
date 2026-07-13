# FormItem Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce the documented shared `FormItem` binding socket and rebuild the four finished `FormXxx` controls on top of it without changing screen-level form usage.

**Architecture:** `FormItem` owns `useController`, RHF rule mapping, label/description/error rendering, accessibility attributes, and inherited form styles. `FormInput`, `FormSelect`, `FormTextarea`, and `FormAccountInput` remain the only screen-level controls and only adapt their concrete control events and values to the render-prop binding.

**Tech Stack:** React 19, TypeScript 6, react-hook-form 7, Vitest, Testing Library

## Global Constraints

- Preserve the current screen-level `FormXxx` API and `useBaseForm` typed component references.
- Preserve explicit `control` support outside `FormProvider`.
- Keep validation in RHF native rules mode; do not add a resolver or validation DSL.
- Keep `FormItem` as a wrapper-authoring primitive, not a screen-level convention.
- Preserve unrelated and pre-existing worktree changes.

---

### Task 1: Define and implement the FormItem binding socket

**Files:**
- Create: `packages/shared/src/shared/form/FormItem.tsx`
- Modify: `packages/shared/src/shared/form/Form.test.tsx`
- Modify: `packages/shared/src/shared/form/index.ts`

**Interfaces:**
- Consumes: `FieldRuleProps<TValues>`, `buildFieldRules`, `useFormFieldStyle`, and RHF `useController`.
- Produces: `FormItem<TValues>` whose child receives the controller field plus `id`, `aria-invalid`, and `aria-describedby`.

- [x] **Step 1: Write the failing test**

Add a test-only wrapper that uses the desired primitive:

```tsx
function FormCustomInput({ name }: { name: FieldPath<SignupValues> }) {
  return (
    <FormItem<SignupValues> name={name} label="커스텀 입력" required>
      {(control) => <input {...control} value={control.value ?? ''} />}
    </FormItem>
  );
}
```

Assert that submit displays the shared required error and that changing the input submits its value.

- [x] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run packages/shared/src/shared/form/Form.test.tsx`

Expected: FAIL because `./FormItem` does not exist.

- [x] **Step 3: Implement FormItem**

Create `FormItem.tsx` with this responsibility split:

```tsx
export function FormItem<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  required,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  validate,
  deps,
  rules,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  children,
}: FormItemProps<TValues>) {
  const style = useFormFieldStyle();
  const { field, fieldState } = useController<TValues>({
    name,
    control,
    rules: buildFieldRules({
      required,
      minLength,
      maxLength,
      min,
      max,
      pattern,
      validate,
      deps,
      rules,
    }),
  });
  // Render label, child control, description, and fieldState.error using one generated id set.
}
```

Export `FormItem` from the form barrel.

- [x] **Step 4: Run the test to verify it passes**

Run: `pnpm exec vitest run packages/shared/src/shared/form/Form.test.tsx`

Expected: PASS.

### Task 2: Rebuild completed fields on FormItem

**Files:**
- Modify: `packages/shared/src/shared/form/FormInput.tsx`
- Modify: `packages/shared/src/shared/form/FormSelect.tsx`
- Modify: `packages/shared/src/shared/form/FormTextarea.tsx`
- Modify: `packages/shared/src/shared/form/FormAccountInput.tsx`
- Delete: `packages/shared/src/shared/form/FormField.tsx`
- Modify: `packages/shared/src/shared/form/index.ts`
- Modify: `docs/form-components.md`

**Interfaces:**
- Consumes: `FormItem<TValues>` from Task 1.
- Produces: unchanged `FormInputProps`, `FormSelectProps`, `FormTextareaProps`, and `FormAccountInputProps` screen APIs.

- [x] **Step 1: Add regression coverage before refactoring**

Keep the existing validation, cross-field dependency, normalization, reset, and explicit-control tests. Add a textarea interaction assertion if no existing test exercises it.

- [x] **Step 2: Run the regression test before implementation**

Run: `pnpm exec vitest run packages/shared/src/shared/form/Form.test.tsx`

Expected: PASS before the internal refactor.

- [x] **Step 3: Replace each field's duplicated binding**

Each finished control must delegate binding and field chrome to `FormItem`:

```tsx
return (
  <FormItem<TValues>
    name={name}
    control={control}
    label={label}
    description={description}
    required={required}
    rules={rules}
    className={fieldClassName}
    labelClassName={labelClassName}
    descriptionClassName={descriptionClassName}
    errorClassName={errorClassName}
  >
    {(field) => (
      <Input
        {...props}
        {...field}
        value={field.value ?? ''}
        onBlur={(event) => {
          field.onBlur();
          onBlur?.(event);
        }}
        onChange={(event) => {
          field.onChange(event);
          onChange?.(event);
        }}
      />
    )}
  </FormItem>
);
```

Pass each control's supported convenience rule props through to `FormItem`; preserve account-number normalization.

- [x] **Step 4: Remove the replaced primitive and update documentation**

Delete `FormField.tsx`, remove its barrel export, and mark `FormItem` introduction plus the four-control reconstruction complete in `docs/form-components.md`.

- [x] **Step 5: Verify behavior and types**

Run:

```bash
pnpm exec vitest run packages/shared/src/shared/form/Form.test.tsx
pnpm exec vitest run apps/admin-portal/src/features/menu-form/ui/MenuForm.test.tsx
pnpm --filter @bx/shared check
pnpm --filter admin-portal check
pnpm --filter pc-web check
pnpm exec biome check packages/shared/src/shared/form docs/form-components.md
```

Expected: all tests and type checks pass; Biome reports no errors in the changed scope.
