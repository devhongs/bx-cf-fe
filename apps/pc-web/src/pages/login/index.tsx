import { useNavigate } from '@tanstack/react-router';

import { STORAGE_KEYS, local, sha256, useLogin } from '@bx/shared';

import { LoginForm, type LoginPayload } from '@/features/auth/ui/login-form';

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const defaultValues: LoginPayload = {
    usrId: local.get<string>(STORAGE_KEYS.RECENT_USER_ID) || '',
    password: local.get<string>(STORAGE_KEYS.RECENT_USER_PW) || '',
  };

  const handleSubmit = async ({ usrId, password }: LoginPayload) => {
    try {
      const usrPwd = await sha256(password);
      const response = await loginMutation.mutateAsync({ usrId, usrPwd });
      // 다음 로그인 자동입력을 위해 아이디·비밀번호 저장 (개발 편의 - 운영 반영 전 제거 권장)
      local.set(STORAGE_KEYS.RECENT_USER_ID, response.usrId);
      local.set(STORAGE_KEYS.RECENT_USER_PW, password);
      navigate({ to: '/main' });
    } catch (error) {
      alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
      console.error(error);
    }
  };

  return <LoginForm defaultValues={defaultValues} onSubmit={handleSubmit} />;
}
