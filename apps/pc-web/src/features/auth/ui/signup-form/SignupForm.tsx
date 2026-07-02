import {
  Form,
  FormInput,
  FormSelect,
  FormSubmitButton,
  type FormTransform,
  type FormValidate,
} from '@bx/shared';

export interface SignupFormValues {
  userId: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  userType: string;
}

export interface SignupPayload {
  userId: string;
  name: string;
  email: string;
  password: string;
  userType: string;
}

interface SignupFormProps {
  onSubmit: (payload: SignupPayload, values: SignupFormValues) => void | Promise<void>;
}

const defaultValues: SignupFormValues = {
  userId: '',
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  userType: '',
};

const validateSignupForm: FormValidate<SignupFormValues> = (values) => {
  if (values.password !== values.passwordConfirm) {
    return { passwordConfirm: '비밀번호가 일치하지 않습니다.' };
  }

  return true;
};

const transformSignupPayload: FormTransform<SignupFormValues, SignupPayload> = (values) => ({
  userId: values.userId ?? '',
  name: values.name ?? '',
  email: values.email ?? '',
  password: values.password ?? '',
  userType: values.userType ?? '',
});

export function SignupForm({ onSubmit }: SignupFormProps) {
  return (
    <Form
      className="space-y-5"
      defaultValues={defaultValues}
      validate={validateSignupForm}
      transform={transformSignupPayload}
      onSubmit={onSubmit}
    >
      <FormInput
        label="아이디"
        name="userId"
        placeholder="tester01"
        rules={{ required: true, minLength: 4 }}
      />
      <FormInput label="이름" name="name" placeholder="홍길동" rules={{ required: true }} />
      <FormInput
        label="이메일"
        name="email"
        placeholder="tester@example.com"
        rules={{ required: true, email: true }}
      />
      <FormInput
        label="비밀번호"
        name="password"
        placeholder="8자 이상"
        rules={{ required: true, minLength: 8 }}
        type="password"
      />
      <FormInput
        label="비밀번호 확인"
        name="passwordConfirm"
        placeholder="비밀번호 재입력"
        rules={{ required: true }}
        type="password"
      />
      <FormSelect
        label="가입 유형"
        name="userType"
        options={[
          { value: 'personal', label: '개인' },
          { value: 'business', label: '사업자' },
        ]}
        placeholder="가입 유형 선택"
        rules={{ required: true }}
      />

      <div className="pt-2">
        <FormSubmitButton className="w-full" loadingLabel="처리 중">
          가입하기
        </FormSubmitButton>
      </div>
    </Form>
  );
}
