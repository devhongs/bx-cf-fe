# Form Components Requirements

Date: 2026-07-02 (revised)

This document records the confirmed requirements for the shared form component layer.

> **Revision note (2026-07-02):** The initial implementation converted field-level `rules` props
> into Zod validation inside the shared layer (former FRM-010 ~ FRM-013), backed by a custom field
> registry. This duplicated what React Hook Form and Zod already provide and made the shared layer
> hard to hand over. The layer was refactored so that **validation lives in a Zod schema owned by
> the feature**, and shared components are thin presentational wrappers over RHF. Superseded
> requirements are marked below.

## Direction

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-001 | The form stack uses React Hook Form, Zod, and `@hookform/resolvers`. | Confirmed |
| FRM-002 | Business screens should not directly handle RHF `register`, `Controller`, or `formState.errors` by default. | Confirmed |
| FRM-003 | Business screens should use strong shared form components from `@bx/shared`. | Confirmed |
| FRM-004 | Shared form code lives under `packages/shared/src/shared/form/`. | Confirmed |
| FRM-005 | Shared form APIs are exported from `@bx/shared`. | Confirmed |
| FRM-006 | Existing `shared/ui` components remain pure UI building blocks. | Confirmed |

## Current Scope

```txt
useZodForm          - useForm + zodResolver, standard defaults (onSubmit / onChange revalidation)
Form                - FormProvider + <form> element, wires handleSubmit
FormField           - label / description / inline error / aria wiring
FormInput           - controlled Input bound via useController
FormSelect          - controlled Select bound via useController
FormAccountInput    - FormInput variant that normalizes to digits only
FormSubmitButton    - submit button that reflects isSubmitting
```

The following are deferred to later iterations:

```txt
FormMoneyInput
FormCheckbox
FormRadioGroup
CodeSelect
CodeRadioGroup
CodeCheckboxGroup
DatePicker components
```

## Business Rules And Schema

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-007 | Business validation rules are not stored in `shared/form`. | Confirmed |
| FRM-008 | Business-specific rules stay near the relevant feature. | Confirmed |
| FRM-009 | Reusable domain field rules can be promoted to an entity model (as shared Zod schemas). | Confirmed |
| FRM-010 | ~~Field components receive validation rules through field-level `rules` props.~~ | Superseded |
| FRM-011 | ~~Business screens use business-friendly rules instead of writing Zod syntax directly.~~ | Superseded |
| FRM-012 | ~~The shared form layer converts field rules into Zod validation.~~ | Superseded |
| FRM-013 | Field rules can be dynamic and may depend on screen state, API responses, permissions, or product conditions. | Confirmed (via dynamic schema / `superRefine`) |
| FRM-040 | Each form declares one Zod schema next to the feature. Cross-field checks use `.refine`, payload shaping uses `.transform`. | Confirmed |

Example:

```tsx
const signupSchema = z
  .object({
    userId: z.string().min(1, '필수 입력 항목입니다.').min(4, '4자 이상 입력해주세요.'),
    password: z.string().min(1, '필수 입력 항목입니다.').min(8, '8자 이상 입력해주세요.'),
    passwordConfirm: z.string().min(1, '필수 입력 항목입니다.'),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  })
  .transform(({ passwordConfirm: _passwordConfirm, ...payload }) => payload);

type SignupFormValues = z.input<typeof signupSchema>;
type SignupPayload = z.output<typeof signupSchema>;
```

## Form Instance

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-014 | ~~`Form` creates the form instance internally.~~ The feature creates the instance with `useZodForm` and passes it to `Form`. | Superseded |
| FRM-015 | Escape-hatch access (`watch`, `setValue`, `reset`, ...) uses the `useZodForm` return value directly, or RHF `useFormContext` inside the form tree. | Confirmed |
| FRM-016 ~ FRM-019 | ~~Custom field config registry (register on mount, unregister on unmount, payload policy metadata).~~ RHF's own registration is the single source of truth. | Superseded |

Conditional fields are plain conditional rendering plus a conditional schema:

```tsx
const userType = form.watch('userType');

{userType === 'business' && (
  <FormInput<SignupFormValues> name="companyName" label="회사명" required />
)}
```

## Validation

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-020 | Validation messages are shown as inline messages under the field by default. | Confirmed |
| FRM-021 | Error display should be configurable later at the form level. | Deferred |
| FRM-022 | Required state is not inferred from Zod schema. The `required` prop controls the label marker only. | Confirmed |
| FRM-023 | Field states such as `required`, `disabled`, and `readOnly` are explicit props or computed screen values. | Confirmed |
| FRM-024 | ~~Field-level custom validation through `rules.validate(value, values)`.~~ Use schema `.refine` / `.superRefine`. | Superseded |
| FRM-025 | Form-level validation is required for cross-field and business-policy checks (schema `.refine`). | Confirmed |
| FRM-026 | ~~Field rules take priority over form validation.~~ Zod issue ordering applies. | Superseded |
| FRM-027 | Default RHF timing is submit-time validation with change-time revalidation. | Confirmed |

Default timing (set by `useZodForm`, overridable per form):

```ts
mode: 'onSubmit'
reValidateMode: 'onChange'
```

## Submit Payload

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-028 | Submit payload is built after validation succeeds. | Confirmed |
| FRM-029 | Single-field normalization belongs to specialized field components. | Confirmed |
| FRM-030 | `FormAccountInput` normalizes account input to an unmasked numeric value. | Confirmed |
| FRM-031 ~ FRM-032 | ~~Form-level `transform` prop.~~ Payload shaping is part of the schema (`.transform`). | Superseded |
| FRM-033 | `onSubmit` receives the transformed payload (`z.output` of the schema). | Confirmed |
| FRM-034 | ~~Original form values as a second `onSubmit` argument.~~ Read via the form instance when needed. | Superseded |

Submit flow:

```txt
User input
-> Field component normalization
-> RHF form values
-> Zod schema (validation + transform)
-> onSubmit(payload)
```

## Submit Button

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-035 | `FormSubmitButton` reads form state. | Confirmed |
| FRM-036 | `isSubmitting` automatically disables or shows loading state. | Confirmed |
| FRM-037 | Explicit `disabled` prop forces disabled state. | Confirmed |
| FRM-038 | ~~`disableWhenInvalid` is supported.~~ Dropped: RHF `isValid` requires change-time validation modes and silently fails with `mode: 'onSubmit'`. | Superseded |
| FRM-039 | By default, invalid forms do not disable the submit button before submit. | Confirmed |

## Playground Sample

The sample signup form lives at `pc-web > Playground`
(`apps/pc-web/src/features/auth/ui/signup-form/SignupForm.tsx`).

Example usage:

```tsx
function SignupForm({ onSubmit }: { onSubmit: (payload: SignupPayload) => void }) {
  const form = useZodForm(signupSchema, { defaultValues });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormInput<SignupFormValues> name="userId" label="아이디" required />
      <FormInput<SignupFormValues> name="password" label="비밀번호" type="password" required />
      <FormInput<SignupFormValues> name="passwordConfirm" label="비밀번호 확인" type="password" required />
      <FormSelect<SignupFormValues>
        name="userType"
        label="가입 유형"
        options={[
          { value: 'personal', label: '개인' },
          { value: 'business', label: '사업자' },
        ]}
        required
      />
      <FormSubmitButton loadingLabel="처리 중">가입하기</FormSubmitButton>
    </Form>
  );
}
```

On successful submit, the playground shows the final payload as a JSON preview next to the form.
