# Form Components Requirements

Date: 2026-07-02

This document records the confirmed requirements for the shared form component layer.

## Direction

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-001 | The form stack uses React Hook Form, Zod, and `@hookform/resolvers`. | Confirmed |
| FRM-002 | Business screens should not directly handle RHF `register`, `Controller`, or `formState.errors` by default. | Confirmed |
| FRM-003 | Business screens should use strong shared form components from `@bx/shared`. | Confirmed |
| FRM-004 | Shared form code lives under `packages/shared/src/shared/form/`. | Confirmed |
| FRM-005 | Shared form APIs are exported from `@bx/shared`. | Confirmed |
| FRM-006 | Existing `shared/ui` components remain pure UI building blocks. | Confirmed |

## Initial Scope

The first implementation includes:

```txt
useZodForm
Form
FormField
FormInput
FormSelect
FormAccountInput
FormSubmitButton
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
| FRM-009 | Reusable domain field rules can be promoted to an entity model. | Confirmed |
| FRM-010 | Field components receive validation rules through field-level `rules` props. | Confirmed |
| FRM-011 | Business screens use business-friendly rules instead of writing Zod syntax directly. | Confirmed |
| FRM-012 | The shared form layer converts field rules into Zod validation. | Confirmed |
| FRM-013 | Field rules can be dynamic and may depend on screen state, API responses, permissions, or product conditions. | Confirmed |

Example:

```tsx
<FormInput
  name="userId"
  label="아이디"
  rules={{
    required: true,
    minLength: 4,
  }}
/>
```

## Dynamic Field Registry

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-014 | `Form` creates the form instance internally. | Confirmed |
| FRM-015 | A hook must expose the form instance when a screen needs `watch`, `setValue`, `reset`, or similar escape-hatch access. | Confirmed |
| FRM-016 | Field components register their config with the parent form context on mount and update. | Confirmed |
| FRM-017 | Field config includes `name`, `rules`, `hidden`, `disabled`, `readOnly`, and payload policy metadata. | Confirmed |
| FRM-018 | When field config changes, the form registry and validation behavior must reflect the latest config. | Confirmed |
| FRM-019 | Unmounted fields are removed from the form registry. | Confirmed |

Example:

```tsx
function DynamicFields() {
  const form = useFormInstance<SignupFormValues>();
  const userType = form.watch('userType');

  return (
    <FormInput
      name="companyName"
      label="회사명"
      hidden={userType !== 'business'}
      rules={{ required: userType === 'business' }}
    />
  );
}
```

## Validation

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-020 | Validation messages are shown as inline messages under the field by default. | Confirmed |
| FRM-021 | Error display should be configurable later at the form level. | Confirmed |
| FRM-022 | Required state is not inferred from Zod schema. | Confirmed |
| FRM-023 | Field states such as `required`, `disabled`, `hidden`, and `readOnly` are explicit props or computed screen values. | Confirmed |
| FRM-024 | Field-level custom validation is allowed through `rules.validate(value, values)`. | Confirmed |
| FRM-025 | Form-level validation is required for cross-field and business-policy checks. | Confirmed |
| FRM-026 | If field rules and form validation both produce an error for the same field, field rules take priority. | Confirmed |
| FRM-027 | Default RHF timing is submit-time validation with change-time revalidation. | Confirmed |

Default timing:

```ts
mode: 'onSubmit'
reValidateMode: 'onChange'
```

Field validation example:

```tsx
<FormInput
  name="passwordConfirm"
  label="비밀번호 확인"
  rules={{
    required: true,
    validate: (value, values) =>
      value === values.password || '비밀번호가 일치하지 않습니다.',
  }}
/>
```

Form validation example:

```tsx
<Form
  validate={(values) => {
    if (values.password !== values.passwordConfirm) {
      return { passwordConfirm: '비밀번호가 일치하지 않습니다.' };
    }

    return true;
  }}
>
  ...
</Form>
```

## Field State Policy

| State | Rendering | Validation | Payload | Value |
| --- | --- | --- | --- | --- |
| `hidden` | Not rendered | Excluded by default | Excluded by default | Kept by default |
| `disabled` | Rendered, not editable | Excluded by default, but `required` still validates | Included by default | Kept |
| `readOnly` | Rendered, not editable | Included | Included | Kept |

Additional confirmed rules:

- `hidden` fields can clear their value with `clearOnHidden`.
- `hidden` fields can be included in payload with an explicit include prop.
- `disabled` fields can be removed from payload with `excludeDisabledValue`.
- `disabled` fields can run all rules with `validateDisabled`.
- If a disabled field has `rules.required: true`, required validation still runs.

## Submit Payload

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-028 | Submit payload is built after validation succeeds. | Confirmed |
| FRM-029 | Single-field normalization belongs to specialized field components. | Confirmed |
| FRM-030 | `FormAccountInput` normalizes account input to an unmasked numeric value. | Confirmed |
| FRM-031 | Form-level `transform` runs only immediately before submit. | Confirmed |
| FRM-032 | `transform` converts form values into API or business payload shape. | Confirmed |
| FRM-033 | `onSubmit` receives the transformed payload. | Confirmed |
| FRM-034 | Original form values may be provided as a second `onSubmit` argument. | Confirmed |

Submit flow:

```txt
User input
-> Field component normalization
-> RHF form values
-> Validation
-> Payload include/exclude policy
-> Form transform
-> onSubmit(payload, values)
```

## Submit Button

| ID | Requirement | Status |
| --- | --- | --- |
| FRM-035 | `FormSubmitButton` reads form state. | Confirmed |
| FRM-036 | `isSubmitting` automatically disables or shows loading state. | Confirmed |
| FRM-037 | Explicit `disabled` prop forces disabled state. | Confirmed |
| FRM-038 | `disableWhenInvalid` is supported. | Confirmed |
| FRM-039 | By default, invalid forms do not disable the submit button before submit. | Confirmed |

## Playground Sample

The first sample is added to:

```txt
pc-web > Manage > Playground
```

The sample is a test-only signup form.

Fields:

```txt
아이디
이름
이메일
비밀번호
비밀번호 확인
가입 유형(select)
```

Validation examples:

- 아이디: required, minLength
- 이름: required
- 이메일: required, email
- 비밀번호: required, minLength
- 비밀번호 확인: required, password match
- 가입 유형: required

Submit behavior:

- On successful submit, show the final payload as a JSON preview below the form.

Example usage:

```tsx
<Form
  defaultValues={{
    userId: '',
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    userType: '',
  }}
  validate={(values) => {
    if (values.password !== values.passwordConfirm) {
      return { passwordConfirm: '비밀번호가 일치하지 않습니다.' };
    }

    return true;
  }}
  transform={(values) => ({
    userId: values.userId,
    name: values.name,
    email: values.email,
    password: values.password,
    userType: values.userType,
  })}
  onSubmit={(payload) => setResult(payload)}
>
  <FormInput name="userId" label="아이디" rules={{ required: true, minLength: 4 }} />
  <FormInput name="name" label="이름" rules={{ required: true }} />
  <FormInput name="email" label="이메일" rules={{ required: true, email: true }} />
  <FormInput name="password" label="비밀번호" type="password" rules={{ required: true, minLength: 8 }} />
  <FormInput name="passwordConfirm" label="비밀번호 확인" type="password" rules={{ required: true }} />
  <FormSelect
    name="userType"
    label="가입 유형"
    options={[
      { value: 'personal', label: '개인' },
      { value: 'business', label: '사업자' },
    ]}
    rules={{ required: true }}
  />
  <FormSubmitButton>가입하기</FormSubmitButton>
</Form>
```
