import { local, STORAGE_KEYS, sha256, useLogin } from '@bx/shared';
import { useNavigate } from '@tanstack/react-router';

import { LoginForm, type LoginPayload } from '@/features/auth/ui/login-form';

import styles from './index.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  // 실패는 공통 에러 알럿이 처리한다. 서버 메시지 대신 로그인 화면 문구를 쓴다.
  const loginMutation = useLogin({
    meta: { error: { message: '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.' } },
  });

  const defaultValues: LoginPayload = {
    usrId: local.get<string>(STORAGE_KEYS.RECENT_USER_ID) || '',
    password: local.get<string>(STORAGE_KEYS.RECENT_USER_PW) || '',
  };

  const handleSubmit = async ({ usrId, password }: LoginPayload) => {
    const usrPwd = await sha256(password);

    loginMutation.mutate(
      { usrId, usrPwd },
      {
        onSuccess: (response) => {
          // 다음 로그인 자동입력을 위해 아이디·비밀번호 저장 (개발 편의 - 운영 반영 전 제거 권장)
          local.set(STORAGE_KEYS.RECENT_USER_ID, response.usrId);
          local.set(STORAGE_KEYS.RECENT_USER_PW, password);
          navigate({ to: '/main' });
        },
      },
    );
  };

  return (
    <div className={styles.page}>
      <LoginForm defaultValues={defaultValues} onSubmit={handleSubmit} />

      <footer className={styles.footer}>
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
      </footer>
    </div>
  );
}
