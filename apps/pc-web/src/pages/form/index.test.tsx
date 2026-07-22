// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FormPage } from './index';

afterEach(cleanup);

describe('FormPage', () => {
  it('starts empty and fills the form after querying', () => {
    render(<FormPage />);

    expect((screen.getByLabelText(/아이디/) as HTMLInputElement).value).toBe('');

    fireEvent.click(screen.getByRole('button', { name: '조회' }));

    expect((screen.getByLabelText(/아이디/) as HTMLInputElement).value).toBe('tester01');
    expect((screen.getByLabelText(/이름/) as HTMLInputElement).value).toBe('홍길동');
    expect((screen.getByLabelText(/이메일/) as HTMLInputElement).value).toBe('tester@example.com');
    expect((screen.getByLabelText(/^비밀번호\*/) as HTMLInputElement).value).toBe('password1');
    expect((screen.getByLabelText(/비밀번호 확인/) as HTMLInputElement).value).toBe('password1');
    expect((screen.getByLabelText(/가입 유형/) as HTMLSelectElement).value).toBe('personal');
  });

  it('restores the loaded values from the top reset button', () => {
    render(<FormPage />);

    fireEvent.click(screen.getByRole('button', { name: '조회' }));

    const userIdInput = screen.getByLabelText(/아이디/) as HTMLInputElement;
    fireEvent.change(userIdInput, { target: { value: 'changed-user' } });
    fireEvent.click(screen.getByRole('button', { name: '초기화' }));

    expect(userIdInput.value).toBe('tester01');
  });

  it('reloads the form from the top query button', () => {
    render(<FormPage />);

    fireEvent.click(screen.getByRole('button', { name: '조회' }));
    fireEvent.change(screen.getByLabelText(/아이디/), { target: { value: 'changed-user' } });
    fireEvent.click(screen.getByRole('button', { name: '조회' }));

    expect((screen.getByLabelText(/아이디/) as HTMLInputElement).value).toBe('tester01');
  });

  it('submits the form from the top save button', async () => {
    render(<FormPage />);

    fireEvent.click(screen.getByRole('button', { name: '조회' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(screen.getByText('SUCCESS')).toBeTruthy();
    });
  });
});
