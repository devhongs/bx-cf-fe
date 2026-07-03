import { Form, FormInput, FormSelect, FormSubmitButton, useZodForm } from '@bx/shared';
import { z } from 'zod';

const REQUIRED_MESSAGE = '필수 입력 항목입니다.';

const signupSchema = z
  .object({
    userId: z.string().min(1, REQUIRED_MESSAGE).min(4, '4자 이상 입력해주세요.'),
    name: z.string().min(1, REQUIRED_MESSAGE),
    email: z
      .string()
      .min(1, REQUIRED_MESSAGE)
      .pipe(z.email('올바른 이메일 형식으로 입력해주세요.')),
    password: z.string().min(1, REQUIRED_MESSAGE).min(8, '8자 이상 입력해주세요.'),
    passwordConfirm: z.string().min(1, REQUIRED_MESSAGE),
    userType: z.string().min(1, REQUIRED_MESSAGE),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  })
  .transform(({ passwordConfirm: _passwordConfirm, ...payload }) => payload);

export type SignupFormValues = z.input<typeof signupSchema>;
export type SignupPayload = z.output<typeof signupSchema>;

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
  const form = useZodForm(signupSchema, { defaultValues });

  return (
    <Form className="space-y-5" form={form} onSubmit={onSubmit}>
      <FormInput<SignupFormValues>
        className={controlClassName}
        label="아이디"
        name="userId"
        placeholder="tester01"
        required
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
      />
      <FormInput<SignupFormValues>
        className={controlClassName}
        label="비밀번호"
        name="password"
        placeholder="8자 이상"
        required
        type="password"
      />
      <FormInput<SignupFormValues>
        className={controlClassName}
        label="비밀번호 확인"
        name="passwordConfirm"
        placeholder="비밀번호 재입력"
        required
        type="password"
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
