// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type FieldPath, useForm } from 'react-hook-form';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from './Form';
import { FormAccountInput } from './FormAccountInput';
import { FormInput } from './FormInput';
import { FormItem } from './FormItem';
import { FormSelect } from './FormSelect';
import { FormSubmitButton } from './FormSubmitButton';
import { FormTextarea } from './FormTextarea';
import { VALIDATION_MESSAGES } from './messages';
import { validators } from './rules';
import { useBaseForm } from './useBaseForm';

interface SignupValues {
  userId: string;
  email: string;
  password: string;
  passwordConfirm: string;
  userType: string;
  accountNo: string;
}

interface ProfileValues {
  introduction: string;
}

const defaultValues: SignupValues = {
  userId: '',
  email: '',
  password: '',
  passwordConfirm: '',
  userType: '',
  accountNo: '',
};

function TestSignupForm({ onSubmit }: { onSubmit: (values: SignupValues) => void }) {
  const form = useForm<SignupValues>({ defaultValues });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormInput<SignupValues> name="userId" label="아이디" required minLength={4} />
      <FormInput<SignupValues> name="email" label="이메일" required validate={validators.email} />
      <FormInput<SignupValues>
        name="password"
        label="비밀번호"
        type="password"
        required
        minLength={8}
        deps={['passwordConfirm']}
      />
      <FormInput<SignupValues>
        name="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        required
        validate={(value, values) => value === values.password || '비밀번호가 일치하지 않습니다.'}
      />
      <FormSelect<SignupValues>
        name="userType"
        label="가입 유형"
        emptyOption="SELECT"
        options={[
          { value: 'personal', label: '개인' },
          { value: 'business', label: '사업자' },
        ]}
        required
      />
      <FormAccountInput<SignupValues> name="accountNo" label="계좌번호" />
      <FormSubmitButton>가입하기</FormSubmitButton>
    </Form>
  );
}

function TestResettableForm({ defaultValues }: { defaultValues: SignupValues }) {
  const { form, resetToDefaultValues } = useBaseForm<SignupValues>({ defaultValues });

  return (
    <Form form={form} onSubmit={vi.fn()}>
      <FormInput<SignupValues> name="userId" label="아이디" />
      <button type="button" onClick={resetToDefaultValues}>
        초기화
      </button>
    </Form>
  );
}

function TestDeepCompareResetForm({ defaultValues }: { defaultValues: SignupValues }) {
  const { form } = useBaseForm<SignupValues>({ defaultValues, resetOnDefaultValuesChange: true });

  return (
    <Form form={form} onSubmit={vi.fn()}>
      <FormInput<SignupValues> name="userId" label="아이디" />
    </Form>
  );
}

function TestExplicitControlForm() {
  const { control } = useForm<SignupValues>({ defaultValues });
  return <FormInput<SignupValues> name="userId" label="아이디" control={control} />;
}

function FormCustomInput({ name }: { name: FieldPath<SignupValues> }) {
  return (
    <FormItem<SignupValues> name={name} label="커스텀 입력" required>
      {({ id, value, onChange, onBlur, ref, ...fieldProps }) => (
        <input
          {...fieldProps}
          id={id}
          ref={ref}
          value={String(value ?? '')}
          onBlur={onBlur}
          onChange={onChange}
        />
      )}
    </FormItem>
  );
}

function TestCustomFieldForm({ onSubmit }: { onSubmit: (values: SignupValues) => void }) {
  const form = useForm<SignupValues>({ defaultValues });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormCustomInput name="userId" />
      <button type="submit">저장</button>
    </Form>
  );
}

function TestTextareaForm({ onSubmit }: { onSubmit: (values: ProfileValues) => void }) {
  const form = useForm<ProfileValues>({ defaultValues: { introduction: '' } });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormTextarea<ProfileValues> name="introduction" label="소개" />
      <button type="submit">소개 저장</button>
    </Form>
  );
}

const getFormElement = () =>
  screen.getByRole('button', { name: '가입하기' }).closest('form') as HTMLFormElement;

afterEach(cleanup);

describe('Form components (rules mode)', () => {
  it('uses the submit button variant by default', () => {
    render(<TestSignupForm onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: '가입하기' });

    expect(submitButton.className).toContain('bg-accent');
    expect(submitButton.className).not.toContain('bg-red-600');
  });

  it('shows required errors on submit and submits values after validation passes', async () => {
    const handleSubmit = vi.fn();

    render(<TestSignupForm onSubmit={handleSubmit} />);

    fireEvent.submit(getFormElement());

    expect(await screen.findAllByText(VALIDATION_MESSAGES.required)).toHaveLength(5);
    expect(handleSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/아이디/), { target: { value: 'tester' } });
    fireEvent.change(screen.getByLabelText(/이메일/), { target: { value: 'tester@example.com' } });
    fireEvent.change(screen.getByLabelText(/^비밀번호\*/), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText(/가입 유형/), { target: { value: 'business' } });
    fireEvent.change(screen.getByLabelText('계좌번호'), { target: { value: '123-456' } });
    fireEvent.submit(getFormElement());

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          userId: 'tester',
          email: 'tester@example.com',
          password: 'password1',
          passwordConfirm: 'password1',
          userType: 'business',
          accountNo: '123456',
        },
        expect.anything(),
      );
    });
  });

  it('shows field-level rule errors (minLength, email)', async () => {
    render(<TestSignupForm onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/아이디/), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/이메일/), { target: { value: 'not-an-email' } });
    fireEvent.submit(getFormElement());

    expect(await screen.findByText(VALIDATION_MESSAGES.minLength(4))).toBeTruthy();
    expect(screen.getByText(VALIDATION_MESSAGES.email)).toBeTruthy();
  });

  it('revalidates passwordConfirm when password changes (deps)', async () => {
    render(<TestSignupForm onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/^비밀번호\*/), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/), { target: { value: 'password2' } });
    fireEvent.submit(getFormElement());

    expect(await screen.findByText('비밀번호가 일치하지 않습니다.')).toBeTruthy();

    // passwordConfirm이 아니라 password를 고쳐서 일치시킴 → deps로 재검증되어 에러가 사라져야 함
    fireEvent.change(screen.getByLabelText(/^비밀번호\*/), { target: { value: 'password2' } });

    await waitFor(() => {
      expect(screen.queryByText('비밀번호가 일치하지 않습니다.')).toBeNull();
    });
  });

  it('normalizes account input to digits only', async () => {
    render(<TestSignupForm onSubmit={vi.fn()} />);

    const accountInput = screen.getByLabelText('계좌번호') as HTMLInputElement;

    fireEvent.change(accountInput, { target: { value: '110-123-456789' } });

    await waitFor(() => {
      expect(accountInput.value).toBe('110123456789');
    });
  });

  it('resets changed values back to defaultValues', async () => {
    render(<TestResettableForm defaultValues={{ ...defaultValues, userId: 'server-user' }} />);

    const userIdInput = screen.getByLabelText('아이디') as HTMLInputElement;

    expect(userIdInput.value).toBe('server-user');

    fireEvent.change(userIdInput, { target: { value: 'draft-user' } });

    expect(userIdInput.value).toBe('draft-user');

    fireEvent.click(screen.getByRole('button', { name: '초기화' }));

    await waitFor(() => {
      expect(userIdInput.value).toBe('server-user');
    });
  });

  it('does not reset form if defaultValues changes reference but is deeply equal', async () => {
    const initialDefault = { ...defaultValues, userId: 'initial-user' };
    const { rerender } = render(<TestDeepCompareResetForm defaultValues={initialDefault} />);

    const userIdInput = screen.getByLabelText('아이디') as HTMLInputElement;
    expect(userIdInput.value).toBe('initial-user');

    fireEvent.change(userIdInput, { target: { value: 'user-input' } });
    expect(userIdInput.value).toBe('user-input');

    // Rerender with a NEW object reference but identical field values
    const newDefaultRef = { ...defaultValues, userId: 'initial-user' };
    rerender(<TestDeepCompareResetForm defaultValues={newDefaultRef} />);

    // Value should NOT reset because fields are deeply equal
    expect(userIdInput.value).toBe('user-input');

    // Rerender with a different value
    const differentDefault = { ...defaultValues, userId: 'new-server-user' };
    rerender(<TestDeepCompareResetForm defaultValues={differentDefault} />);

    // Value should reset to new default
    await waitFor(() => {
      expect(userIdInput.value).toBe('new-server-user');
    });
  });

  it('supports passing explicit control prop to FormInput', async () => {
    render(<TestExplicitControlForm />);
    const userIdInput = screen.getByLabelText('아이디') as HTMLInputElement;
    expect(userIdInput).toBeDefined();
    fireEvent.change(userIdInput, { target: { value: 'explicit-control-value' } });
    expect(userIdInput.value).toBe('explicit-control-value');
  });

  it('binds custom controls and validation through FormItem', async () => {
    const handleSubmit = vi.fn();

    render(<TestCustomFieldForm onSubmit={handleSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByText(VALIDATION_MESSAGES.required)).toBeTruthy();
    expect(handleSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/커스텀 입력/), {
      target: { value: 'custom-value' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        { ...defaultValues, userId: 'custom-value' },
        expect.anything(),
      );
    });
  });

  it('binds textarea values through FormTextarea', async () => {
    const handleSubmit = vi.fn();

    render(<TestTextareaForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText('소개'), {
      target: { value: '폼 컴포넌트 소개' },
    });
    fireEvent.click(screen.getByRole('button', { name: '소개 저장' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        { introduction: '폼 컴포넌트 소개' },
        expect.anything(),
      );
    });
  });
});
