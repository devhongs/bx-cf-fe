import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { STORAGE_KEYS } from '@/shared/constants';
import { session } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!id.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
    session.set(STORAGE_KEYS.USER_ID, id);
    navigate({ to: '/main' });
  };

  const handleQuickLogin = (userId: string) => {
    session.set(STORAGE_KEYS.USER_ID, userId);
    navigate({ to: '/main' });
  };

  return (
    <section>
      <div>
        <div className="signup-form">
          <div className="signup-form__header">
            <h2 className="signup-form__title">Hello 👋 Sign up here</h2>
          </div>

          <input
            name="id"
            type="text"
            className="signup-form__input"
            placeholder="아이디를 입력하세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            name="password"
            type="password"
            className="signup-form__input"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="signup-form__submit" onClick={handleSubmit}>
            Login
          </Button>

          <div className="signup-form__divider" style={{ margin: '16px 0' }}>
            또는
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              className="signup-form__submit"
              style={{ flex: 1, backgroundColor: '#d63d8aff', border: 'none' }}
              onClick={() => handleQuickLogin('user1')}
            >
              user1
            </Button>
            <Button
              className="signup-form__submit"
              style={{ flex: 1, backgroundColor: '#10b981', border: 'none' }}
              onClick={() => handleQuickLogin('user2')}
            >
              user2
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute('/(auth)/_auth/login')({
  component: LoginPage,
});
