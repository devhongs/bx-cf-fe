import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { STORAGE_KEYS, local, login as loginApi, sha256, useAuthStore } from '@bx/shared';

import styles from './index.module.css';

export function LoginForm() {
  const navigate = useNavigate();
  const [id, setId] = useState(() => local.get<string>(STORAGE_KEYS.RECENT_USER_ID) || '');
  const [password, setPassword] = useState('');
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
      local.set(STORAGE_KEYS.RECENT_USER_ID, response.usrId);
      setAuth(response);
      navigate({ to: '/main' });
    } catch (error) {
      alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
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
          <input
            name="id"
            type="text"
            className={styles.input}
            placeholder="이메일 또는 아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <input
            name="password"
            type="password"
            className={styles.input}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
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
            <button type="button" className={styles.nextBtn} onClick={handleSubmit}>
              다음
            </button>
          </div>
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
