// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from './LoginForm';

describe('PC LoginForm', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
  });

  afterEach(cleanup);

  it('shows inline required errors before submitting payload', async () => {
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    expect(await screen.findAllByText('필수 입력 항목입니다.')).toHaveLength(2);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('passes a login payload after validation succeeds', async () => {
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('이메일 또는 아이디'), {
      target: { value: 'tester01' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password1' },
    });
    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          usrId: 'tester01',
          password: 'password1',
        },
        expect.anything(),
      );
    });
  });
});
