import { useNavigate } from '@tanstack/react-router';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { STORAGE_KEYS, local, sha256, useLogin } from '@bx/shared';

import styles from './index.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [usrId, setUsrId] = useState(local.get<string>(STORAGE_KEYS.RECENT_USER_ID) || '');
  const [password, setPassword] = useState(local.get<string>(STORAGE_KEYS.RECENT_USER_PW) || '');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const usrPwd = await sha256(password);
      const response = await loginMutation.mutateAsync({ usrId, usrPwd });
      local.set(STORAGE_KEYS.RECENT_USER_ID, response.usrId);
      local.set(STORAGE_KEYS.RECENT_USER_PW, password);
      navigate({ to: '/dashboard' });
    } catch (submitError) {
      setError('아이디 또는 비밀번호를 확인해주세요.');
      console.error(submitError);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <ShieldCheck size={22} />
          </div>
          <span>BX Admin</span>
        </div>
        <h1>관리자 로그인</h1>
        <p>코드, 메뉴, 사용자 운영 업무를 한 곳에서 관리합니다.</p>
      </section>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formTitle}>
          <LockKeyhole size={20} />
          <strong>운영자 인증</strong>
        </div>

        <label>
          <span>아이디</span>
          <input
            value={usrId}
            autoFocus
            required
            placeholder="admin"
            onChange={(event) => setUsrId(event.target.value)}
          />
        </label>

        <label>
          <span>비밀번호</span>
          <input
            value={password}
            required
            type="password"
            placeholder="비밀번호"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? '확인 중' : '로그인'}
        </button>
      </form>
    </main>
  );
}
