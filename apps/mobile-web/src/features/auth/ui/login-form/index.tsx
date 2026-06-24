import { useNavigate } from '@tanstack/react-router';
import { KeyRound, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { login as loginApi } from '@bx/shared';
import { useAuthStore } from '@bx/shared';
import { STORAGE_KEYS } from '@bx/shared';
import { local } from '@bx/shared';
import { sha256 } from '@bx/shared';
import { Input } from '@bx/shared';

import styles from './index.module.css';

export function LoginForm() {
  const navigate = useNavigate();
  const [id, setId] = useState(() => local.get<string>(STORAGE_KEYS.RECENT_USER_ID) || '');
  const [password, setPassword] = useState(
    () => local.get<string>(STORAGE_KEYS.RECENT_USER_PW) || '',
  );
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async () => {
    if (!id.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    try {
      const usrPwd = await sha256(password);
      const response = await loginApi({ usrId: id, usrPwd });
      // 다음 로그인 자동입력을 위해 아이디·비밀번호 저장 (개발 편의 — 운영 반영 전 제거 권장)
      local.set(STORAGE_KEYS.RECENT_USER_ID, response.usrId);
      local.set(STORAGE_KEYS.RECENT_USER_PW, password);
      setAuth(response);
      navigate({ to: '/main' });
    } catch (error) {
      alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
      console.error(error);
    }
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
          onClick={() => alert('비밀번호 찾기 팝업')}
        >
          <KeyRound size={13} />
          <span>Forgot password?</span>
        </button>
        <div className={styles.actionDivider} />
        <button
          type="button"
          className={styles.popupActionBtn}
          onClick={() => alert('회원가입 팝업')}
        >
          <UserPlus size={13} />
          <span>Create new account</span>
        </button>
      </div>
    </div>
  );
}
