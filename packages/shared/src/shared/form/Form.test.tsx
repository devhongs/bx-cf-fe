import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from './Form';
import { FormAccountInput } from './FormAccountInput';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormSubmitButton } from './FormSubmitButton';

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

afterEach(cleanup);

describe('Form components', () => {
  it('applies default control classes and merges custom control classes', () => {
    render(
      <Form<Pick<SignupValues, 'userId'>>
        defaultValues={{ userId: '' }}
        controlClassName="rounded-none"
        onSubmit={vi.fn()}
      >
        <FormInput<Pick<SignupValues, 'userId'>> name="userId" label="아이디" placeholder="tester01" />
      </Form>,
    );

    const inputClassName = (screen.getByLabelText('아이디') as HTMLInputElement).className;

    expect(inputClassName).toContain('border-[#3c4043]');
    expect(inputClassName).toContain('bg-[#202124]');
    expect(inputClassName).toContain('text-[#e3e3e3]');
    expect(inputClassName).toContain('placeholder:text-[#80868b]');
    expect(inputClassName).toContain('rounded-none');
  });

  it('shows inline field errors and submits transformed payload after validation passes', async () => {
    const handleSubmit = vi.fn();

    render(
      <Form<SignupValues, { userId: string; email: string; userType: string; accountNo: string }>
        defaultValues={defaultValues}
        validate={(values) =>
          values.password === values.passwordConfirm
            ? true
            : { passwordConfirm: '비밀번호가 일치하지 않습니다.' }
        }
        transform={(values) => ({
          userId: values.userId ?? '',
          email: values.email ?? '',
          userType: values.userType ?? '',
          accountNo: values.accountNo ?? '',
        })}
        onSubmit={handleSubmit}
      >
        <FormInput<SignupValues> name="userId" label="아이디" rules={{ required: true, minLength: 4 }} />
        <FormInput<SignupValues> name="email" label="이메일" rules={{ required: true, email: true }} />
        <FormInput<SignupValues>
          name="password"
          label="비밀번호"
          type="password"
          rules={{ required: true, minLength: 8 }}
        />
        <FormInput<SignupValues>
          name="passwordConfirm"
          label="비밀번호 확인"
          type="password"
          rules={{ required: true }}
        />
        <FormSelect<SignupValues>
          name="userType"
          label="가입 유형"
          placeholder="가입 유형 선택"
          options={[
            { value: 'personal', label: '개인' },
            { value: 'business', label: '사업자' },
          ]}
          rules={{ required: true }}
        />
        <FormAccountInput<SignupValues> name="accountNo" label="계좌번호" />
        <FormSubmitButton>가입하기</FormSubmitButton>
      </Form>,
    );

    const formElement = screen.getByRole('button', { name: '가입하기' }).closest('form') as HTMLFormElement;

    fireEvent.submit(formElement);

    expect(await screen.findAllByText('필수 입력 항목입니다.')).toHaveLength(5);

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
        expect.objectContaining({
          accountNo: '123456',
          passwordConfirm: 'password1',
        }),
      );
    });
  });
});
