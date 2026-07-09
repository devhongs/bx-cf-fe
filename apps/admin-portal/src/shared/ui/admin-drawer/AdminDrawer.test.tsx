// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminDrawer } from './AdminDrawer';

describe('AdminDrawer', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it('renders a non-modal drawer dialog and closes from the close button', () => {
    const onClose = vi.fn();

    render(
      <AdminDrawer open title="코드 상세" subtitle="USE_YN" onClose={onClose}>
        <div>상세 내용</div>
      </AdminDrawer>,
    );

    const dialog = screen.getByRole('dialog', { name: '코드 상세' });
    expect(dialog.getAttribute('aria-modal')).not.toBe('true');
    expect(screen.getByText('상세 내용')).toBeTruthy();
    expect(screen.queryByLabelText('상세 닫기')).toBeNull();

    fireEvent.click(screen.getByTitle('닫기'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('allows outside interactions without closing the drawer', async () => {
    const onClose = vi.fn();
    const onOutsideClick = vi.fn();

    render(
      <>
        <button type="button" onClick={onOutsideClick}>
          외부 row
        </button>
        <AdminDrawer open title="코드 상세" subtitle="USE_YN" onClose={onClose}>
          <div>상세 내용</div>
        </AdminDrawer>
      </>,
    );

    await waitFor(() => {
      expect(document.body.style.pointerEvents).toBe('auto');
    });

    fireEvent.click(screen.getByText('외부 row'));

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: '코드 상세' })).toBeTruthy();
  });

  it('closes from the Escape key', () => {
    const onClose = vi.fn();

    render(
      <AdminDrawer open title="코드 상세" subtitle="USE_YN" onClose={onClose}>
        <div>상세 내용</div>
      </AdminDrawer>,
    );

    fireEvent.keyDown(screen.getByRole('dialog', { name: '코드 상세' }), { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps the drawer mounted during the exit animation before removing it', () => {
    vi.useFakeTimers();

    const { rerender } = render(
      <AdminDrawer open title="코드 상세" onClose={vi.fn()}>
        <div>상세 내용</div>
      </AdminDrawer>,
    );

    rerender(
      <AdminDrawer open={false} title="코드 상세" onClose={vi.fn()}>
        <div>상세 내용</div>
      </AdminDrawer>,
    );

    expect(screen.getByRole('dialog', { name: '코드 상세' }).dataset.adminState).toBe('closing');

    act(() => {
      vi.advanceTimersByTime(160);
    });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps the last open content while the drawer is closing', () => {
    vi.useFakeTimers();

    const { rerender } = render(
      <AdminDrawer open title="사용 여부" subtitle="USE_YN" onClose={vi.fn()}>
        <div>선택된 상세 내용</div>
      </AdminDrawer>,
    );

    rerender(
      <AdminDrawer open={false} title="코드 그룹 등록" onClose={vi.fn()}>
        <div>초기화된 등록 폼</div>
      </AdminDrawer>,
    );

    expect(screen.getByRole('dialog', { name: '사용 여부' }).dataset.adminState).toBe('closing');
    expect(screen.getByText('USE_YN')).toBeTruthy();
    expect(screen.getByText('선택된 상세 내용')).toBeTruthy();
    expect(screen.queryByText('초기화된 등록 폼')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(160);
    });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('resizes from the left edge and restores the width by storage key', () => {
    const storageKey = 'admin-drawer:codes';

    render(
      <AdminDrawer open title="코드 상세" storageKey={storageKey} onClose={vi.fn()}>
        <div>상세 내용</div>
      </AdminDrawer>,
    );

    const resizeHandle = screen.getByRole('separator', { name: '상세 패널 너비 조절' });
    const dialog = screen.getByRole('dialog', { name: '코드 상세' });

    fireEvent.pointerDown(resizeHandle, { clientX: 464 });
    fireEvent.pointerMove(document, { clientX: 384 });
    fireEvent.pointerUp(document);

    expect(dialog.style.getPropertyValue('--admin-drawer-width')).toBe('640px');
    expect(window.localStorage.getItem(storageKey)).toBe('640');

    cleanup();

    render(
      <AdminDrawer open title="코드 상세" storageKey={storageKey} onClose={vi.fn()}>
        <div>상세 내용</div>
      </AdminDrawer>,
    );

    expect(
      screen
        .getByRole('dialog', { name: '코드 상세' })
        .style.getPropertyValue('--admin-drawer-width'),
    ).toBe('640px');
  });

  it('does not leave a placeholder panel when closed', () => {
    render(
      <AdminDrawer open={false} title="코드 상세" onClose={vi.fn()}>
        <div>상세 내용</div>
      </AdminDrawer>,
    );

    expect(screen.queryByText('목록에서 항목을 선택하세요.')).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
