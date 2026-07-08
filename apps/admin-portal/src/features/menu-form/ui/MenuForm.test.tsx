// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAppForm } from '@bx/shared';

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

function TestMenuForm({ submitError = '' }: { submitError?: string }) {
  const { form } = useAppForm<MenuFormValues>({ defaultValues });

  return (
    <MenuForm
      id="test-menu-form"
      form={form}
      submitError={submitError}
      onSubmit={vi.fn()}
    />
  );
}

describe('MenuForm', () => {
  afterEach(cleanup);

  it('renders menu fields and submit error', () => {
    render(<TestMenuForm submitError="저장에 실패했습니다." />);

    expect(screen.getByLabelText('메뉴코드')).toBeTruthy();
    expect(screen.getByLabelText('메뉴유형')).toBeTruthy();
    expect(screen.getByLabelText('메뉴명')).toBeTruthy();
    expect(screen.getByLabelText('경로')).toBeTruthy();
    expect(screen.getByLabelText('정렬')).toBeTruthy();
    expect(screen.getByLabelText('노출여부')).toBeTruthy();
    expect(screen.getByText('저장에 실패했습니다.')).toBeTruthy();
  });
});
