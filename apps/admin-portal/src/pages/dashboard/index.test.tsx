// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DashboardPage } from './index';

describe('DashboardPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the management-focused dashboard without quick actions', () => {
    render(<DashboardPage />);

    expect(screen.queryByText('빠른 작업')).toBeNull();
    expect(screen.getByRole('heading', { name: '관리 지표' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '코드 관리 현황' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '메뉴 관리 현황' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '사용자/권한 현황' })).toBeTruthy();

    const changeTable = screen.getByRole('table', { name: '최근 변경 내역' });
    expect(within(changeTable).getByText('유형')).toBeTruthy();
    expect(within(changeTable).getByText('대상')).toBeTruthy();
    expect(within(changeTable).getByText('변경자')).toBeTruthy();
    expect(within(changeTable).getByText('시간')).toBeTruthy();
    expect(within(changeTable).getByText('상태')).toBeTruthy();
  });
});
