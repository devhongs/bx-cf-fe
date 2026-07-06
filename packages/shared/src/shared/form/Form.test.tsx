import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from './Form';
import { FormAccountInput } from './FormAccountInput';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormSubmitButton } from './FormSubmitButton';
import { VALIDATION_MESSAGES } from './messages';
import { validators } from './rules';

interface SignupValues {
  userId: string;
  email: string;
  password: string;
  passwordConfirm: string;
  userType: string;
  accountNo: string;
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
        placeholder="가입 유형 선택"
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

const getFormElement = () =>
  screen.getByRole('button', { name: '가입하기' }).closest('form') as HTMLFormElement;

afterEach(cleanup);

describe('Form components (rules mode)', () => {
  it('uses the submit button variant by default', () => {
    render(<TestSignupForm onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: '가입하기' });

    expect(submitButton.className).toContain('bg-blue-600');
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
});
