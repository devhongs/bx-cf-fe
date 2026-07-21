import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './index';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  mutate: vi.fn(),
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
    useLogin: () => ({ mutate: mocks.mutate }),
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    mocks.navigate.mockClear();
    mocks.mutate.mockReset();
    mocks.localGet.mockReset();
    mocks.localSet.mockReset();
    mocks.sha256.mockReset();
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
  });

  afterEach(cleanup);

  it('renders page-level language and policy footer outside the login form', () => {
    mocks.localGet.mockReturnValue('');

    render(<LoginPage />);

    const footer = screen.getByRole('contentinfo');
    const loginForm = screen.getByPlaceholderText('이메일 또는 아이디').closest('form');

    expect(footer.textContent).toContain('한국어');
    expect(footer.textContent).toContain('개인정보처리방침');
    expect(loginForm?.contains(footer)).toBe(false);
  });

  it('logs in with a hashed password after LoginForm validation succeeds', async () => {
    mocks.localGet.mockReturnValue('');
    mocks.sha256.mockResolvedValue('hashed-password');
    // mutate는 성공 콜백을 호출부에서 받는다 — 로그인 성공을 흉내낸다.
    mocks.mutate.mockImplementation((_variables, options) => {
      options?.onSuccess?.({ usrId: 'tester01' });
    });

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
      expect(mocks.mutate).toHaveBeenCalledWith(
        { usrId: 'tester01', usrPwd: 'hashed-password' },
        expect.anything(),
      );
      expect(mocks.localSet).toHaveBeenCalledWith('recent-user-id', 'tester01');
      expect(mocks.localSet).toHaveBeenCalledWith('recent-user-pw', 'password1');
      expect(mocks.navigate).toHaveBeenCalledWith({ to: '/main' });
    });
  });
});
