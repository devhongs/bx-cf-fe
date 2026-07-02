import { describe, expect, it } from 'vitest';

import { buildSubmitPayload, validateFormValues } from './form-rules';
import type { FormFieldConfig } from './form.types';

const field = (config: FormFieldConfig): FormFieldConfig => config;

describe('form rules', () => {
  it('validates standard field rules and keeps the first field-level error', async () => {
    const fields = [
      field({ name: 'userId', rules: { required: true, minLength: 4 } }),
      field({ name: 'email', rules: { required: true, email: true } }),
    ];

    const result = await validateFormValues(
      { userId: '', email: 'bad-email' },
      fields,
      () => ({ userId: '업무 오류가 기본 오류를 덮으면 안 됩니다.' }),
    );

    expect(result.success).toBe(false);
    expect(result.errors).toEqual({
      userId: '필수 입력 항목입니다.',
      email: '올바른 이메일 형식으로 입력해주세요.',
    });
  });

  it('supports dynamic field-level validate and form-level validate', async () => {
    const fields = [
      field({ name: 'password', rules: { required: true, minLength: 8 } }),
      field({
        name: 'passwordConfirm',
        rules: {
          required: true,
          validate: (value, values) => value === values.password || '비밀번호가 일치하지 않습니다.',
        },
      }),
    ];

    const fieldResult = await validateFormValues(
      { password: 'password1', passwordConfirm: 'password2' },
      fields,
    );
    const formResult = await validateFormValues(
      { password: 'password1', passwordConfirm: 'password2' },
      fields.map((item) =>
        item.name === 'passwordConfirm'
          ? { ...item, rules: { required: true } }
          : item,
      ),
      (values) =>
        values.password === values.passwordConfirm
          ? true
          : { passwordConfirm: '비밀번호가 일치하지 않습니다.' },
    );

    expect(fieldResult.errors).toEqual({
      passwordConfirm: '비밀번호가 일치하지 않습니다.',
    });
    expect(formResult.errors).toEqual({
      passwordConfirm: '비밀번호가 일치하지 않습니다.',
    });
  });

  it('applies hidden and disabled validation policies', async () => {
    const result = await validateFormValues(
      {
        hiddenMemo: '',
        disabledRequired: '',
        disabledRequiredExcluded: '',
        disabledOptional: '',
        readOnlyName: '',
      },
      [
        field({ name: 'hiddenMemo', hidden: true, rules: { required: true } }),
        field({ name: 'disabledRequired', disabled: true, rules: { required: true } }),
        field({
          name: 'disabledRequiredExcluded',
          disabled: true,
          excludeDisabledValue: true,
          rules: { required: true },
        }),
        field({ name: 'disabledOptional', disabled: true, rules: { minLength: 5 } }),
        field({ name: 'readOnlyName', readOnly: true, rules: { required: true } }),
      ],
    );

    expect(result.errors).toEqual({
      disabledRequired: '필수 입력 항목입니다.',
      disabledRequiredExcluded: '필수 입력 항목입니다.',
      readOnlyName: '필수 입력 항목입니다.',
    });
  });

  it('builds submit payload using field visibility policy before transform', () => {
    const values = {
      userId: 'tester',
      hiddenMemo: 'kept locally',
      includedHidden: 'included',
      disabledMemo: 'included by default',
      excludedDisabled: 'excluded',
      readOnlyName: '홍길동',
    };

    const payload = buildSubmitPayload(
      values,
      [
        field({ name: 'userId' }),
        field({ name: 'hiddenMemo', hidden: true }),
        field({ name: 'includedHidden', hidden: true, includeHiddenValue: true }),
        field({ name: 'disabledMemo', disabled: true }),
        field({ name: 'excludedDisabled', disabled: true, excludeDisabledValue: true }),
        field({ name: 'readOnlyName', readOnly: true }),
      ],
      (visibleValues) => ({
        id: visibleValues.userId,
        profile: {
          name: visibleValues.readOnlyName,
        },
        disabledMemo: visibleValues.disabledMemo,
        includedHidden: visibleValues.includedHidden,
      }),
    );

    expect(payload).toEqual({
      id: 'tester',
      profile: {
        name: '홍길동',
      },
      disabledMemo: 'included by default',
      includedHidden: 'included',
    });
  });
});
