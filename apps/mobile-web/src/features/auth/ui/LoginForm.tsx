import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { login as loginApi } from '@bx/shared';
import { useUserStore } from '@bx/shared';

import './LoginForm.css';

export function LoginForm() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
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

  const handleQuickLogin = async (userId: string) => {
    try {
      const response = await loginApi(userId);
      if (response?.id) {
        loginStore(response);
        navigate({ to: '/main' });
      } else {
        alert('존재하지 않는 사용자입니다.');
      }
    } catch (error) {
      alert('로그인 처리 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Instagram Gradient Logo */}
        <div className="logo-wrapper">
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="ig-grad" cx="30%" cy="107%" r="130%" fx="30%" fy="107%">
                <stop offset="0%" stop-color="#fdf497" />
                <stop offset="5%" stop-color="#fdf497" />
                <stop offset="45%" stop-color="#fd5949" />
                <stop offset="60%" stop-color="#d6249f" />
                <stop offset="90%" stop-color="#285AEB" />
              </radialGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-grad)" />
            <rect
              x="5.5"
              y="5.5"
              width="13"
              height="13"
              rx="3.5"
              stroke="white"
              stroke-width="1.8"
            />
            <circle cx="12" cy="12" r="3.2" stroke="white" stroke-width="1.8" />
            <circle cx="16.7" cy="7.3" r="0.9" fill="white" />
          </svg>
        </div>

        {/* Inputs & Form */}
        <div className="form-wrapper">
          <input
            name="id"
            type="text"
            className="input-field"
            placeholder="Username, email or mobile number"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            name="password"
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSubmit}>
            Log in
          </button>
        </div>

        <a className="forgot-link" href="#forgot">
          Forgot password?
        </a>

        {/* Saved Accounts / Quick Login (Instagram style) */}
        <div className="saved-accounts-section">
          <div className="saved-accounts-title">Saved Accounts</div>
          <div className="accounts-grid">
            <div className="account-card" onClick={() => handleQuickLogin('user1')}>
              <div className="avatar-wrapper">
                <div className="avatar-inner">JE</div>
              </div>
              <div className="account-name">김지은</div>
            </div>
            <div className="account-card" onClick={() => handleQuickLogin('user2')}>
              <div className="avatar-wrapper">
                <div className="avatar-inner">SH</div>
              </div>
              <div className="account-name">박성훈</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Meta Brand */}
      <div className="footer-section">
        <button className="create-account-btn">Create new account</button>
        <div className="brand-wrapper">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#65676b"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 13c-1-1.5-2.5-2.5-4.5-2.5-2.5 0-4.5 2-4.5 4.5S5 19.5 7.5 19.5c2 0 3.5-1 4.5-2.5m0-1c1-1.5 2.5-2.5 4.5-2.5 2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5c-2 0-3.5-1-4.5-2.5" />
          </svg>
          Meta
        </div>
      </div>
    </div>
  );
}
