import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from './Form';
import { FormAccountInput } from './FormAccountInput';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormSubmitButton } from './FormSubmitButton';
import { useZodForm } from './useZodForm';

const REQUIRED_MESSAGE = '필수 입력 항목입니다.';

const signupSchema = z
  .object({
    userId: z.string().min(1, REQUIRED_MESSAGE).min(4, '4자 이상 입력해주세요.'),
    email: z
      .string()
      .min(1, REQUIRED_MESSAGE)
      .pipe(z.email('올바른 이메일 형식으로 입력해주세요.')),
    password: z.string().min(1, REQUIRED_MESSAGE).min(8, '8자 이상 입력해주세요.'),
    passwordConfirm: z.string().min(1, REQUIRED_MESSAGE),
    userType: z.string().min(1, REQUIRED_MESSAGE),
    accountNo: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  })
  .transform(({ password: _password, passwordConfirm: _passwordConfirm, ...payload }) => payload);

type SignupValues = z.input<typeof signupSchema>;
type SignupPayload = z.output<typeof signupSchema>;

const defaultValues: SignupValues = {
  userId: '',
  email: '',
  password: '',
  passwordConfirm: '',
  userType: '',
  accountNo: '',
};

function TestSignupForm({ onSubmit }: { onSubmit: (payload: SignupPayload) => void }) {
  const form = useZodForm(signupSchema, { defaultValues });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormInput<SignupValues> name="userId" label="아이디" required />
      <FormInput<SignupValues> name="email" label="이메일" required />
      <FormInput<SignupValues> name="password" label="비밀번호" type="password" required />
      <FormInput<SignupValues>
        name="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        required
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

afterEach(cleanup);

describe('Form components', () => {
  it('shows inline field errors and submits transformed payload after validation passes', async () => {
    const handleSubmit = vi.fn();

    render(<TestSignupForm onSubmit={handleSubmit} />);

    const formElement = screen
      .getByRole('button', { name: '가입하기' })
      .closest('form') as HTMLFormElement;

    fireEvent.submit(formElement);

    expect(await screen.findAllByText(REQUIRED_MESSAGE)).toHaveLength(5);
    expect(handleSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/아이디/), { target: { value: 'tester' } });
    fireEvent.change(screen.getByLabelText(/이메일/), { target: { value: 'tester@example.com' } });
    fireEvent.change(screen.getByLabelText(/^비밀번호\*/), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/), { target: { value: 'password2' } });
    fireEvent.change(screen.getByLabelText(/가입 유형/), { target: { value: 'business' } });
    fireEvent.change(screen.getByLabelText('계좌번호'), { target: { value: '123-456' } });
    fireEvent.submit(formElement);

    expect(await screen.findByText('비밀번호가 일치하지 않습니다.')).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/비밀번호 확인/), { target: { value: 'password1' } });
    fireEvent.submit(formElement);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          userId: 'tester',
          email: 'tester@example.com',
          userType: 'business',
          accountNo: '123456',
        },
        expect.anything(),
      );
    });
  });

  it('shows field-level format errors from the schema', async () => {
    render(<TestSignupForm onSubmit={vi.fn()} />);

    const formElement = screen
      .getByRole('button', { name: '가입하기' })
      .closest('form') as HTMLFormElement;

    fireEvent.change(screen.getByLabelText(/아이디/), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/이메일/), { target: { value: 'not-an-email' } });
    fireEvent.submit(formElement);

    expect(await screen.findByText('4자 이상 입력해주세요.')).toBeTruthy();
    expect(screen.getByText('올바른 이메일 형식으로 입력해주세요.')).toBeTruthy();
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
