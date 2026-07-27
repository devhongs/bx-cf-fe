// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminFilterBar } from './AdminFilterBar';

afterEach(cleanup);

describe('AdminFilterBar', () => {
  it('조회 버튼을 강조된 secondary 스타일로 표시한다', () => {
    render(
      <AdminFilterBar
        searchValue=""
        onSearchChange={vi.fn()}
        onSearch={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    const searchButton = screen.getByRole('button', { name: '조회' });

    expect(searchButton.className).toContain('secondary');
    expect(searchButton.className).toContain('searchButton');
  });

  it('조회 버튼과 form submit으로 조회를 요청한다', () => {
    const onSearch = vi.fn();
    render(
      <AdminFilterBar
        searchValue=""
        onSearchChange={vi.fn()}
        onSearch={onSearch}
        onReset={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '조회' }));
    expect(onSearch).toHaveBeenCalledTimes(1);

    fireEvent.submit(screen.getByRole('textbox').closest('form') as HTMLFormElement);
    expect(onSearch).toHaveBeenCalledTimes(2);
  });

  it('초기화 버튼으로 조건 초기화를 요청한다', () => {
    const onReset = vi.fn();
    render(
      <AdminFilterBar
        searchValue="검색어"
        onSearchChange={vi.fn()}
        onSearch={vi.fn()}
        onReset={onReset}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '초기화' }));

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('데이터 등록 액션을 렌더링하지 않는다', () => {
    render(
      <AdminFilterBar
        searchValue=""
        onSearchChange={vi.fn()}
        onSearch={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: '등록' })).toBeNull();
  });
});
