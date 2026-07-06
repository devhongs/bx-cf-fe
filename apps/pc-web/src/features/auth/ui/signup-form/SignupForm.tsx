import { useForm } from 'react-hook-form';

import { Form, FormInput, FormSelect, FormSubmitButton, validators } from '@bx/shared';

export interface SignupFormValues {
  userId: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  userType: string;
}

export type SignupPayload = Omit<SignupFormValues, 'passwordConfirm'>;

interface SignupFormProps {
  onSubmit: (payload: SignupPayload) => void | Promise<void>;
}

const defaultValues: SignupFormValues = {
  userId: '',
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  userType: '',
};

const controlClassName = 'border-[#3c4043] bg-[#202124] text-[#e3e3e3] placeholder:text-[#80868b]';

export function SignupForm({ onSubmit }: SignupFormProps) {
  const form = useForm<SignupFormValues>({ defaultValues });

  const handleSubmit = ({ passwordConfirm: _passwordConfirm, ...payload }: SignupFormValues) =>
    onSubmit(payload);

  return (
    <Form className="space-y-5" form={form} onSubmit={handleSubmit}>
      <FormInput<SignupFormValues>
        className={controlClassName}
        label="아이디"
        name="userId"
        placeholder="tester01"
        required
        minLength={4}
      />
      <FormInput<SignupFormValues>
        className={controlClassName}
        label="이름"
        name="name"
        placeholder="홍길동"
        required
      />
      <FormInput<SignupFormValues>
        className={controlClassName}
        label="이메일"
        name="email"
        placeholder="tester@example.com"
        required
        validate={validators.email}
      />
      <FormInput<SignupFormValues>
        className={controlClassName}
        label="비밀번호"
        name="password"
        placeholder="8자 이상"
        required
        minLength={8}
        type="password"
        deps={['passwordConfirm']}
      />
      <FormInput<SignupFormValues>
        className={controlClassName}
        label="비밀번호 확인"
        name="passwordConfirm"
        placeholder="비밀번호 재입력"
        required
        type="password"
        validate={(value, values) => value === values.password || '비밀번호가 일치하지 않습니다.'}
      />
      <FormSelect<SignupFormValues>
        className={controlClassName}
        label="가입 유형"
        name="userType"
        options={[
          { value: 'personal', label: '개인' },
          { value: 'business', label: '사업자' },
        ]}
        placeholder="가입 유형 선택"
        required
      />

      <div className="pt-2">
        <FormSubmitButton className="w-full" loadingLabel="처리 중">
          가입하기
        </FormSubmitButton>
      </div>
    </Form>
  );
}
