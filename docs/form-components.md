# Form Components Requirements

Date: 2026-07-02 (revision 3, 2026-07-06)

This document records the confirmed requirements for the shared form component layer.

> **Revision history**
>
> 1. **Initial (2026-07-02):** field-level `rules` props converted to Zod by a custom engine
>    (field registry + custom resolver inside `shared/form`). Rejected: duplicated what RHF and
>    Zod already provide (~700 lines of custom machinery).
> 2. **Revision 2:** schema-first — one Zod schema per form via `useZodForm` + `zodResolver`.
>    Rejected after review: with many screens, per-form schema boilerplate grows, and the team
>    prefers declaring validation next to the field.
> 3. **Revision 3 (current):** field-level rules executed by **RHF's native rules mode**.
>    Field components map convenience props to RHF `RegisterOptions` (~40 lines, no engine).
>    Zod and `@hookform/resolvers` removed from the form stack.

## Direction

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-001 | The form stack uses React Hook Form (native rules mode). Zod is no longer part of the form stack. | Revised |
| FRM-002 | Business screens should not directly handle RHF `register`, `Controller`, or `formState.errors` by default. | Confirmed |
| FRM-003 | Business screens should use shared form components from `@bx/shared`. | Confirmed |
| FRM-004 | Shared form code lives under `packages/shared/src/shared/form/`. | Confirmed |
| FRM-005 | Shared form APIs are exported from `@bx/shared`. | Confirmed |
| FRM-006 | Existing `shared/ui` components remain pure UI building blocks. | Confirmed |
| FRM-041 | **Resolver mode is not used.** RHF ignores field rules when a resolver is set, so the codebase standardizes on rules mode. Do not add `resolver`/`zodResolver` to forms. | Confirmed |

## Current Scope

```txt
Form                - FormProvider + <form> element, wires handleSubmit
FormField           - label / description / inline error / aria wiring
FormInput           - controlled Input, rule props -> RHF RegisterOptions
FormSelect          - controlled Select, rule props -> RHF RegisterOptions
FormAccountInput    - FormInput variant that normalizes to digits only
FormSubmitButton    - submit button that reflects isSubmitting
buildFieldRules     - convenience prop -> RegisterOptions mapping (no validation engine)
VALIDATION_MESSAGES - default Korean messages (single source, future i18n entry point)
validators          - shared validate functions (email, ...)
```

The form instance is created by the feature with plain `useForm({ defaultValues })` — RHF's
defaults (`mode: 'onSubmit'`, `reValidateMode: 'onChange'`, `shouldFocusError: true`) are already
the desired timing, so no wrapper hook is needed.

Deferred to later iterations:

```txt
FormMoneyInput / FormNumberInput
FormCheckbox
FormRadioGroup
CodeSelect / CodeRadioGroup / CodeCheckboxGroup
DatePicker components
errorDisplay variants (summary / modal)
```

## Validation Rules

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-007 | Business validation rules are not stored in `shared/form`. | Confirmed |
| FRM-008 | Business-specific rules stay near the relevant feature (in the field props). | Confirmed |
| FRM-009 | Reusable domain rules can be promoted to shared `validators` or entity-level rule objects. | Confirmed |
| FRM-010 | Field components receive validation through field-level props whose names match RHF `RegisterOptions` (`required`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `validate`, `deps`). | Confirmed |
| FRM-042 | Validation is executed by RHF's built-in rules engine. The shared layer only maps props and default messages; it never implements validation itself. | Confirmed |
| FRM-043 | `rules` prop is the escape hatch for full `RegisterOptions` access. | Confirmed |

Message convention (mirrors RHF's own value/message shape):

```tsx
<FormInput name="userId" required minLength={4} />
// required          -> '필수 입력 항목입니다.'
// minLength={4}     -> '4자 이상 입력해주세요.'

<FormInput name="userId" required="아이디를 입력하세요." minLength={{ value: 4, message: '너무 짧습니다.' }} />
// custom messages
```

Cross-field validation uses `validate(value, formValues)` plus `deps` on the counterpart field
(RHF semantics: when the field with `deps` changes, the listed fields are revalidated):

```tsx
<FormInput name="password" required minLength={8} deps={['passwordConfirm']} />
<FormInput
  name="passwordConfirm"
  required
  validate={(value, values) => value === values.password || '비밀번호가 일치하지 않습니다.'}
/>
```

## Field State Policy

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-022 | `required` prop drives both the validation rule and the label marker (*). | Revised |
| FRM-023 | `disabled` / `readOnly` are DOM-level props: the input is not editable but the value is kept and still submitted. To skip validation conditionally, make the rule conditional (e.g. `required={!isLocked}`). | Confirmed |
| FRM-044 | Conditional fields are plain conditional rendering; unmounted controlled fields keep their last value in form state unless the screen resets them. | Confirmed |
| FRM-020 | Validation messages are shown inline under the field. | Confirmed |
| FRM-027 | RHF default timing: submit-time validation, change-time revalidation, focus first error. | Confirmed |

## Submit

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-028 | Submit handler runs only after validation succeeds. | Confirmed |
| FRM-029 | Single-field normalization belongs to specialized field components (`FormAccountInput`). | Confirmed |
| FRM-033 | `onSubmit` receives the raw form values; payload shaping (e.g. dropping `passwordConfirm`) happens in the feature's submit handler. | Revised |
| FRM-035 ~ 037, 039 | `FormSubmitButton` reflects `isSubmitting`, supports `loadingLabel`, explicit `disabled`. Invalid forms do not disable the button before submit. | Confirmed |

## Example (SignupForm)

```tsx
interface SignupFormValues {
  userId: string;
  password: string;
  passwordConfirm: string;
}
type SignupPayload = Omit<SignupFormValues, 'passwordConfirm'>;

function SignupForm({ onSubmit }: { onSubmit: (payload: SignupPayload) => void }) {
  const form = useForm<SignupFormValues>({ defaultValues });

  const handleSubmit = ({ passwordConfirm: _omit, ...payload }: SignupFormValues) =>
    onSubmit(payload);

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormInput<SignupFormValues> name="userId" label="아이디" required minLength={4} />
      <FormInput<SignupFormValues>
        name="password"
        label="비밀번호"
        type="password"
        required
        minLength={8}
        deps={['passwordConfirm']}
      />
      <FormInput<SignupFormValues>
        name="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        required
        validate={(value, values) => value === values.password || '비밀번호가 일치하지 않습니다.'}
      />
      <FormSubmitButton loadingLabel="처리 중">가입하기</FormSubmitButton>
    </Form>
  );
}
```

The playground sample lives at `pc-web > Playground`
(`apps/pc-web/src/features/auth/ui/signup-form/SignupForm.tsx`); on successful submit it shows
the final payload as a JSON preview next to the form.
