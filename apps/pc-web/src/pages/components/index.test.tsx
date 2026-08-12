import { fetchProductList, useGlobalLoadingStore } from '@bx/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ComponentsPage } from '.';

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();
  return {
    ...actual,
    fetchProductList: vi.fn(),
  };
});

vi.mock('@/assets/sample-logo.svg?react', () => ({
  default: () => <svg aria-label="샘플 로고" />,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
  useGlobalLoadingStore.setState({ pendingCount: 0 });
});

describe('ComponentsPage loading overlay sample', () => {
  it('기본 요청은 스피너 옵션을 생략한다', async () => {
    vi.mocked(fetchProductList).mockResolvedValue([]);
    render(<ComponentsPage />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole('button', { name: '기본 스피너 요청' }));

    await waitFor(() => {
      expect(fetchProductList).toHaveBeenCalledWith();
    });
  });

  it('제외 요청은 showSpinner false를 전달한다', async () => {
    vi.mocked(fetchProductList).mockResolvedValue([]);
    render(<ComponentsPage />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole('button', { name: '스피너 제외 요청' }));

    await waitFor(() => {
      expect(fetchProductList).toHaveBeenCalledWith(undefined, { showSpinner: false });
    });
  });

  it('빠른 응답이어도 기본 오버레이를 확인할 수 있도록 로딩 상태를 유지한다', async () => {
    vi.useFakeTimers();
    vi.mocked(fetchProductList).mockResolvedValue([]);
    render(<ComponentsPage />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole('button', { name: '기본 스피너 요청' }));
    await act(async () => Promise.resolve());

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(1);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(0);
  });
});
