import { useNavigate } from '@tanstack/react-router';

import { STORAGE_KEYS } from '@/shared/constants';
import { Button } from '@/shared/ui';

export function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, '1234567890');
    navigate({ to: '/main' });
  };

  return (
    <section>
      <div>
        <div className="signup-form">
          <div className="signup-form__header">
            <h2 className="signup-form__title">Hello 👋 Sign up here</h2>
          </div>

          <input name="email" type="email" className="signup-form__input" />
          <input
            name="password"
            type="password"
            className="signup-form__input"
          />
          <Button className="signup-form__submit" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </div>
    </section>
  );
}
