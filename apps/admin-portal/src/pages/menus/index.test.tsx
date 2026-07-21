// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MenusPage } from './index';

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    useFetchMenuList: () => ({
      data: [
        {
          menuId: 0,
          menuCd: 'ROOT',
          menuNm: '루트 메뉴',
          visibleYn: 'Y',
          useYn: 'Y',
        },
      ],
    }),
  };
});

vi.mock('@/features/menu-form/ui/MenuFormDrawer', () => ({
  MenuFormDrawer: () => null,
}));

describe('MenusPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('menuId가 0인 행도 선택 상태를 표시한다', () => {
    render(<MenusPage />);

    const row = screen.getByText('루트 메뉴').closest('tr');
    const initialClassName = row?.className;

    fireEvent.click(screen.getByText('루트 메뉴'));

    expect(row?.className).not.toBe(initialClassName);
  });
});
