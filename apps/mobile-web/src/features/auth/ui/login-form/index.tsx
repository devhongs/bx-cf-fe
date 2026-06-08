import { useNavigate } from '@tanstack/react-router';
import { LogIn, KeyRound, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { login as loginApi } from '@bx/shared';
import { useUserStore } from '@bx/shared';
import { STORAGE_KEYS } from '@bx/shared';
import { local } from '@bx/shared';
import { Input } from '@bx/shared';

import styles from './index.module.css';

export function LoginForm() {
  const navigate = useNavigate();
  const [id, setId] = useState(() => local.get<string>(STORAGE_KEYS.RECENT_USER_ID) || '');
  const [password, setPassword] = useState('');
  const loginStore = useUserStore((state) => state.login);

  const handleSubmit = async () => {
    if (!id.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
    try {
      const response = await loginApi(id);
      if (response?.id) {
        local.set(STORAGE_KEYS.RECENT_USER_ID, response.id.toString());
        loginStore(response);
        navigate({ to: '/main' });
      } else {
        alert('존재하지 않는 사용자이거나 로그인 정보가 올바르지 않습니다.');
      }
    } catch (error) {
      alert('로그인 처리 중 오류가 발생했습니다.');
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
        <button type="button" className={styles.popupActionBtn} onClick={() => alert('비밀번호 찾기 팝업')}>
          <KeyRound size={13} />
          <span>Forgot password?</span>
        </button>
        <div className={styles.actionDivider} />
        <button type="button" className={styles.popupActionBtn} onClick={() => alert('회원가입 팝업')}>
          <UserPlus size={13} />
          <span>Create new account</span>
        </button>
      </div>
    </div>
  );
}
