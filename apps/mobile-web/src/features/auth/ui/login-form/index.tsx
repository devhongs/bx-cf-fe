import { useNavigate } from '@tanstack/react-router';
import { KeyRound, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { Input, STORAGE_KEYS, local, openAlert, sha256, useLogin } from '@bx/shared';

import styles from './index.module.css';

export function LoginForm() {
  const navigate = useNavigate();
  // 실패는 공통 에러 알럿이 처리한다. 서버 메시지 대신 로그인 화면 문구를 쓴다.
  const loginMutation = useLogin({
    meta: { error: { message: '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.' } },
  });
  const [id, setId] = useState(() => local.get<string>(STORAGE_KEYS.RECENT_USER_ID) || '');
  const [password, setPassword] = useState(
    () => local.get<string>(STORAGE_KEYS.RECENT_USER_PW) || '',
  );

  const handleSubmit = async () => {
    if (!id.trim()) {
      void openAlert({ message: '아이디를 입력해주세요.' });
      return;
    }
    if (!password) {
      void openAlert({ message: '비밀번호를 입력해주세요.' });
      return;
    }

    const usrPwd = await sha256(password);

    loginMutation.mutate(
      { usrId: id, usrPwd },
      {
        onSuccess: (response) => {
          // 다음 로그인 자동입력을 위해 아이디·비밀번호 저장 (개발 편의 — 운영 반영 전 제거 권장)
          local.set(STORAGE_KEYS.RECENT_USER_ID, response.usrId);
          local.set(STORAGE_KEYS.RECENT_USER_PW, password);
          navigate({ to: '/main' });
        },
      },
    );
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        {/* Modern BWG Text Logo wrapped in a sleek gradient border */}
        <div className={styles.logoTextContainer}>
          <h1 className={styles.logoText}>BWG</h1>
        </div>

        {/* Inputs & Form */}
        <div className={styles.formWrapper}>
          <Input
            name="id"
            type="text"
            className={styles.inputField}
            placeholder="Username, email or mobile number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onEnter={handleSubmit}
          />
          <Input
            name="password"
            type="password"
            className={styles.inputField}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onEnter={handleSubmit}
          />
          <button type="button" className={styles.submitBtn} onClick={handleSubmit}>
            <LogIn size={18} />
            Log in
          </button>
        </div>
      </div>

      {/* Bottom Popup Icons Section - Positioned 50px from bottom */}
      <div className={styles.bottomActions}>
        <button
          type="button"
          className={styles.popupActionBtn}
          onClick={() => void openAlert({ message: '비밀번호 찾기 팝업' })}
        >
          <KeyRound size={13} />
          <span>Forgot password?</span>
        </button>
        <div className={styles.actionDivider} />
        <button
          type="button"
          className={styles.popupActionBtn}
          onClick={() => void openAlert({ message: '회원가입 팝업' })}
        >
          <UserPlus size={13} />
          <span>Create new account</span>
        </button>
      </div>
    </div>
  );
}
