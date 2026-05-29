import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useUserStore } from '@/entities/user';
import { login as loginApi } from '@/entities/auth';
import { Button } from '@/shared/ui';

function LoginPage() {
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
      if (response && response.content && response.content.id) {
        loginStore(response.content);
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
      if (response && response.content && response.content.id) {
        loginStore(response.content);
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
