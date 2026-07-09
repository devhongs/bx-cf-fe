import { FormSubmitButton } from '@bx/shared';

import { AppForm, useAppForm } from '@/shared/ui/app-form';

import styles from './LoginForm.module.css';

export interface LoginFormValues {
  usrId: string;
  password: string;
}

export type LoginPayload = LoginFormValues;

interface LoginFormProps {
  defaultValues?: LoginFormValues;
  onSubmit: (payload: LoginPayload) => void | Promise<void>;
}

const emptyDefaultValues: LoginFormValues = {
  usrId: '',
  password: '',
};

export function LoginForm({ defaultValues = emptyDefaultValues, onSubmit }: LoginFormProps) {
  const { form, FormInput } = useAppForm<LoginFormValues>({
    defaultValues,
  });

  return (
    <div className={styles.page}>
      {/* 로그인 카드 */}
      <div className={styles.card}>
        {/* 좌측 영역 */}
        <div className={styles.left}>
          <div className={styles.logo}>
            <span className={styles.logoText}>BWG</span>
          </div>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>BWG 계정 사용</p>
        </div>

        {/* 우측 영역 */}
        <div className={styles.right}>
          <AppForm className={styles.form} form={form} onSubmit={onSubmit}>
            <FormInput
              className={styles.input}
              name="usrId"
              placeholder="이메일 또는 아이디"
              required
              autoFocus
            />
            <FormInput
              className={styles.input}
              name="password"
              placeholder="비밀번호"
              required
              type="password"
            />

            <button type="button" className={styles.forgotLink}>
              아이디를 잊으셨나요?
            </button>

            <p className={styles.guestText}>
              내 컴퓨터가 아닌가요?{' '}
              <button type="button" className={styles.guestLink}>
                게스트 모드 사용 방법 자세히 알아보기
              </button>
            </p>

            <div className={styles.actions}>
              <button type="button" className={styles.createBtn}>
                계정 만들기
              </button>
              <FormSubmitButton loadingLabel="처리 중">다음</FormSubmitButton>
            </div>
          </AppForm>
        </div>
      </div>

      {/* 하단 푸터 */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <button type="button" className={styles.footerBtn}>
            한국어 ▾
          </button>
        </div>
        <div className={styles.footerRight}>
          <button type="button" className={styles.footerBtn}>
            도움말
          </button>
          <button type="button" className={styles.footerBtn}>
            개인정보처리방침
          </button>
          <button type="button" className={styles.footerBtn}>
            약관
          </button>
        </div>
      </div>
    </div>
  );
}
