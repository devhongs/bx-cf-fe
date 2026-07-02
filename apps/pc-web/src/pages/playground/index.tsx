import { useState } from 'react';

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmitButton,
  type FormTransform,
  type FormValidate,
} from '@bx/shared';

interface SignupFormValues {
  userId: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  userType: string;
}

interface SignupPayload {
  userId: string;
  name: string;
  email: string;
  password: string;
  userType: string;
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

export function PlaygroundPage() {
  const [payload, setPayload] = useState<SignupPayload | null>(null);
  const handleSubmit = (nextPayload: SignupPayload) => {
    setPayload(nextPayload);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#131314] p-8 text-[#e3e3e3]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Playground</h1>
          <p className="mt-2 text-sm text-[#9aa0a6]">회원가입 폼 샘플</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(360px,1fr)]">
          <section className="rounded-lg border border-[#2f3033] bg-[#1b1c1f] p-6 shadow-sm">
            <Form
              className="space-y-5"
              defaultValues={defaultValues}
              validate={validateSignupForm}
              transform={transformSignupPayload}
              onSubmit={handleSubmit}
            >
              <FormInput
                label="아이디"
                name="userId"
                placeholder="tester01"
                rules={{ required: true, minLength: 4 }}
              />
              <FormInput
                label="이름"
                name="name"
                placeholder="홍길동"
                rules={{ required: true }}
              />
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
          </section>

          <section className="rounded-lg border border-[#2f3033] bg-[#1b1c1f] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-[#2f3033] pb-3">
              <h2 className="text-base font-semibold">Submit Payload</h2>
              <span className="text-xs text-[#9aa0a6]">{payload ? 'SUCCESS' : 'EMPTY'}</span>
            </div>
            <pre className="min-h-72 overflow-auto rounded-md bg-[#101113] p-4 text-sm leading-6 text-[#c4d7ff]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
