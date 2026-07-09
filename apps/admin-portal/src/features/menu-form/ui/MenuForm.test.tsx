// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@bx/shared';

import { MenuForm } from './MenuForm';
import type { MenuFormValues } from '../model/menu-form.type';

const defaultValues: MenuFormValues = {
  menuCd: '',
  menuNm: '',
  menuType: 'MENU',
  path: '',
  sortSeq: '',
  visibleYn: 'Y',
};

function TestMenuForm({
  defaultValues: values = defaultValues,
  submitError = '',
  onSubmit = vi.fn(),
}: {
  defaultValues?: MenuFormValues;
  submitError?: string;
  onSubmit?: Parameters<typeof MenuForm>[0]['onSubmit'];
}) {
  return (
    <MenuForm
      id="test-menu-form"
      defaultValues={values}
      submitError={submitError}
      onSubmit={onSubmit}
    />
  );
}

const submitForm = () => {
  fireEvent.submit(document.getElementById('test-menu-form') as HTMLFormElement);
};

describe('MenuForm', () => {
  afterEach(cleanup);

  it('renders menu fields and submit error', () => {
    render(<TestMenuForm submitError="저장에 실패했습니다." />);

    expect(screen.getByLabelText(/메뉴코드/)).toBeTruthy();
    expect(screen.getByLabelText(/메뉴유형/)).toBeTruthy();
    expect(screen.getByLabelText(/메뉴명/)).toBeTruthy();
    expect(screen.getByLabelText(/경로/)).toBeTruthy();
    expect(screen.getByLabelText(/정렬/)).toBeTruthy();
    expect(screen.getByLabelText(/노출여부/)).toBeTruthy();
    expect(screen.getByText('저장에 실패했습니다.')).toBeTruthy();
  });

  it('shows common required errors before submit', async () => {
    const handleSubmit = vi.fn();

    render(<TestMenuForm onSubmit={handleSubmit} />);

    submitForm();

    expect(await screen.findAllByText(VALIDATION_MESSAGES.required)).toHaveLength(2);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits normalized menu payload after validation passes', async () => {
    const handleSubmit = vi.fn();

    render(<TestMenuForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/메뉴코드/), { target: { value: ' MENU001 ' } });
    fireEvent.change(screen.getByLabelText(/메뉴유형/), { target: { value: 'PAGE' } });
    fireEvent.change(screen.getByLabelText(/메뉴명/), { target: { value: ' 메뉴 관리 ' } });
    fireEvent.change(screen.getByLabelText(/경로/), { target: { value: ' /menus ' } });
    fireEvent.change(screen.getByLabelText(/정렬/), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText(/노출여부/), { target: { value: 'N' } });
    submitForm();

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        menuCd: 'MENU001',
        menuNm: '메뉴 관리',
        menuType: 'PAGE',
        path: '/menus',
        sortSeq: 7,
        visibleYn: 'N',
      });
    });
  });

  it('resets values when defaultValues changes', async () => {
    const { rerender } = render(
      <TestMenuForm defaultValues={{ ...defaultValues, menuCd: 'MENU001' }} />,
    );

    const menuCodeInput = screen.getByLabelText(/메뉴코드/) as HTMLInputElement;

    expect(menuCodeInput.value).toBe('MENU001');

    fireEvent.change(menuCodeInput, { target: { value: 'DRAFT' } });

    expect(menuCodeInput.value).toBe('DRAFT');

    rerender(<TestMenuForm defaultValues={{ ...defaultValues, menuCd: 'MENU002' }} />);

    await waitFor(() => {
      expect(menuCodeInput.value).toBe('MENU002');
    });
  });
});
