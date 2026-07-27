// @vitest-environment jsdom

import { useAlertStore } from '@bx/shared';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MenusPage } from './index';

const mocks = vi.hoisted(() => ({
  deleteMenu: vi.fn(),
}));

/**
 * 실제 앱은 삭제 성공 시 쿼리를 무효화해 목록에서 해당 행이 사라진다.
 * 목록이 고정이면 그 흐름을 재현하지 못하므로 구독 가능한 스토어로 둔다.
 */
const menuStore = vi.hoisted(() => {
  const initial = [
    { menuId: 0, menuCd: 'ROOT', menuNm: '루트 메뉴', visibleYn: 'Y', useYn: 'Y' },
    { menuId: 1, menuCd: 'CHILD', menuNm: '하위 메뉴', visibleYn: 'Y', useYn: 'Y' },
  ];
  let data = initial;
  const listeners = new Set<() => void>();
  const emit = () => {
    for (const listener of listeners) listener();
  };

  return {
    getSnapshot: () => data,
    reset: () => {
      data = initial;
      emit();
    },
    remove: (menuId: number) => {
      data = data.filter((menu) => menu.menuId !== menuId);
      emit();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
});

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();
  const { useSyncExternalStore } = await import('react');

  return {
    ...actual,
    useFetchMenuList: () => ({
      data: useSyncExternalStore(menuStore.subscribe, menuStore.getSnapshot),
    }),
    useDeleteMenu: () => ({ mutateAsync: mocks.deleteMenu, isPending: false }),
  };
});

vi.mock('@/features/menu-form/ui/MenuFormDrawer', () => ({
  MenuFormDrawer: () => null,
}));

describe('MenusPage', () => {
  beforeEach(() => {
    mocks.deleteMenu.mockReset();
    menuStore.reset();
    useAlertStore.setState({ queue: [] });
  });

  afterEach(() => {
    while (useAlertStore.getState().queue.length > 0) {
      useAlertStore.getState().close(false);
    }
    cleanup();
  });

  it('menuId가 0인 행도 선택 상태를 표시한다', () => {
    render(<MenusPage />);

    const row = screen.getByText('루트 메뉴').closest('tr');
    const initialClassName = row?.className;

    fireEvent.click(screen.getByText('루트 메뉴'));

    expect(row?.className).not.toBe(initialClassName);
  });

  it('다중 삭제 중 실패한 메뉴만 선택 상태에 남긴다', async () => {
    // menuId 0은 성공(목록에서 제거), 1은 실패 → 실패한 행만 선택에 남아야 한다.
    mocks.deleteMenu.mockImplementation((menuId: number) => {
      if (menuId !== 0) return Promise.reject(new Error('삭제 실패'));
      menuStore.remove(menuId);
      return Promise.resolve();
    });
    render(<MenusPage />);

    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    fireEvent.click(screen.getAllByRole('checkbox')[2]);
    expect(screen.getByText('2건 선택됨')).toBeTruthy();
    expect(screen.getByRole('button', { name: '등록' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    await waitFor(() => expect(useAlertStore.getState().queue).toHaveLength(1));
    act(() => useAlertStore.getState().close(true));

    await waitFor(() => {
      expect(screen.getByText('1건 선택됨')).toBeTruthy();
    });

    // 성공한 '루트 메뉴'는 목록에서 사라지고, 실패한 '하위 메뉴'만 선택된 채 남는다.
    expect(screen.queryByText('루트 메뉴')).toBeNull();
    const remainingRow = screen.getByText('하위 메뉴').closest('tr') as HTMLTableRowElement;
    expect((within(remainingRow).getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
  });

  it('조회 버튼을 눌렀을 때 검색 조건을 적용하고 초기화한다', () => {
    render(<MenusPage />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '하위' } });
    expect(screen.getByText('루트 메뉴')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '조회' }));
    expect(screen.queryByText('루트 메뉴')).toBeNull();
    expect(screen.getByText('하위 메뉴')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '초기화' }));
    expect(screen.getByText('루트 메뉴')).toBeTruthy();
  });
});
