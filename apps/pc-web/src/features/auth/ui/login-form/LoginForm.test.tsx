import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from './LoginForm';

const navigate = vi.fn();
const mutateAsync = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}));

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    useLogin: () => ({ mutateAsync }),
  };
});

describe('PC LoginForm', () => {
  beforeEach(() => {
    navigate.mockClear();
    mutateAsync.mockReset();
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
  });

  it('shows inline required errors before submitting login request', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    expect(await screen.findAllByText('필수 입력 항목입니다.')).toHaveLength(2);
    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
