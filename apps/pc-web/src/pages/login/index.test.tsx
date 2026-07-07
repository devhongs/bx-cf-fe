import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './index';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  mutateAsync: vi.fn(),
  localGet: vi.fn(),
  localSet: vi.fn(),
  sha256: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    STORAGE_KEYS: {
      RECENT_USER_ID: 'recent-user-id',
      RECENT_USER_PW: 'recent-user-pw',
    },
    local: {
      get: mocks.localGet,
      set: mocks.localSet,
    },
    sha256: mocks.sha256,
    useLogin: () => ({ mutateAsync: mocks.mutateAsync }),
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    mocks.navigate.mockClear();
    mocks.mutateAsync.mockReset();
    mocks.localGet.mockReset();
    mocks.localSet.mockReset();
    mocks.sha256.mockReset();
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
  });

  it('logs in with a hashed password after LoginForm validation succeeds', async () => {
    mocks.localGet.mockReturnValue('');
    mocks.sha256.mockResolvedValue('hashed-password');
    mocks.mutateAsync.mockResolvedValue({ usrId: 'tester01' });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('이메일 또는 아이디'), {
      target: { value: 'tester01' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password1' },
    });
    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    await waitFor(() => {
      expect(mocks.sha256).toHaveBeenCalledWith('password1');
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        usrId: 'tester01',
        usrPwd: 'hashed-password',
      });
      expect(mocks.localSet).toHaveBeenCalledWith('recent-user-id', 'tester01');
      expect(mocks.localSet).toHaveBeenCalledWith('recent-user-pw', 'password1');
      expect(mocks.navigate).toHaveBeenCalledWith({ to: '/main' });
    });
  });
});
