import { FormSubmitButton, validators } from '@bx/shared';

import { AppForm, useAppForm } from '@/shared/ui/app-form';

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
  defaultValues?: SignupFormValues;
  onSubmit: (payload: SignupPayload) => void | Promise<void>;
}

const emptyDefaultValues: SignupFormValues = {
  userId: '',
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  userType: '',
};

export function SignupForm({ defaultValues = emptyDefaultValues, onSubmit }: SignupFormProps) {
  const { form, FormInput, FormSelect } = useAppForm<SignupFormValues>({ defaultValues });

  const handleSubmit = ({ passwordConfirm: _passwordConfirm, ...payload }: SignupFormValues) =>
    onSubmit(payload);

  return (
    <AppForm className="space-y-5" form={form} onSubmit={handleSubmit}>
      <FormInput label="아이디" name="userId" placeholder="tester01" required minLength={4} />
      <FormInput label="이름" name="name" placeholder="홍길동" required />
      <FormInput
        label="이메일"
        name="email"
        placeholder="tester@example.com"
        required
        validate={validators.email}
      />
      <FormInput
        label="비밀번호"
        name="password"
        placeholder="8자 이상"
        required
        minLength={8}
        type="password"
        deps={['passwordConfirm']}
      />
      <FormInput
        label="비밀번호 확인"
        name="passwordConfirm"
        placeholder="비밀번호 재입력"
        required
        type="password"
        validate={(value, values) => value === values.password || '비밀번호가 일치하지 않습니다.'}
      />
      <FormSelect
        label="가입 유형"
        name="userType"
        groupCd="SIGNUP_USER_TYPE"
        emptyOption="SELECT"
        required
      />

      <div className="pt-2">
        <FormSubmitButton className="w-full" loadingLabel="처리 중">
          가입하기
        </FormSubmitButton>
      </div>
    </AppForm>
  );
}
