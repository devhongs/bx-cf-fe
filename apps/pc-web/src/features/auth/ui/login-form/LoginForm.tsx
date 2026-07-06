import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormInput,
  FormSubmitButton,
  STORAGE_KEYS,
  local,
  sha256,
  useLogin,
} from '@bx/shared';

import styles from './LoginForm.module.css';

interface LoginFormValues {
  usrId: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      usrId: local.get<string>(STORAGE_KEYS.RECENT_USER_ID) || '',
      password: local.get<string>(STORAGE_KEYS.RECENT_USER_PW) || '',
    },
  });

  const handleSubmit = async ({ usrId, password }: LoginFormValues) => {
    try {
      const usrPwd = await sha256(password);
      const response = await loginMutation.mutateAsync({ usrId, usrPwd });
      // 다음 로그인 자동입력을 위해 아이디·비밀번호 저장 (개발 편의 — 운영 반영 전 제거 권장)
      local.set(STORAGE_KEYS.RECENT_USER_ID, response.usrId);
      local.set(STORAGE_KEYS.RECENT_USER_PW, password);
      navigate({ to: '/main' });
    } catch (error) {
      alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
      console.error(error);
    }
  };

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
          <Form className={styles.form} form={form} onSubmit={handleSubmit}>
            <FormInput<LoginFormValues>
              className={styles.input}
              name="usrId"
              placeholder="이메일 또는 아이디"
              required
              autoFocus
            />
            <FormInput<LoginFormValues>
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
          </Form>
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
