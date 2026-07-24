// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGlobalLoadingStore } from '../../model/loading/loading.store';
import { GlobalLoadingOverlay } from './GlobalLoadingOverlay';
import { LoadingOverlayBoundary } from './LoadingOverlayBoundary';

beforeEach(() => {
  vi.useFakeTimers();
  useGlobalLoadingStore.setState({ overlayContainer: null, pendingCount: 0 });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('GlobalLoadingOverlay', () => {
  it('shows a centered blocking status after the delay', () => {
    render(<GlobalLoadingOverlay />);

    act(() => useGlobalLoadingStore.getState().start());
    expect(screen.queryByRole('status', { name: '요청 처리 중' })).toBeNull();

    act(() => vi.advanceTimersByTime(150));

    const overlay = screen.getByRole('status', { name: '요청 처리 중' });
    expect(overlay.getAttribute('data-slot')).toBe('global-loading-overlay');
    expect(overlay.getAttribute('data-position')).toBe('viewport');
    expect(overlay.getAttribute('aria-busy')).toBe('true');
    expect(overlay.querySelector('[data-slot="spinner"]')).not.toBeNull();
  });

  it('renders inside the registered layout boundary', () => {
    render(
      <>
        <GlobalLoadingOverlay />
        <LoadingOverlayBoundary data-testid="loading-boundary">콘텐츠</LoadingOverlayBoundary>
      </>,
    );

    act(() => useGlobalLoadingStore.getState().start());
    act(() => vi.advanceTimersByTime(150));

    const boundary = screen.getByTestId('loading-boundary');
    const overlay = screen.getByRole('status', { name: '요청 처리 중' });

    expect(boundary.contains(overlay)).toBe(true);
    expect(overlay.getAttribute('data-position')).toBe('container');
  });

  it('does not flash when the request finishes before the delay', () => {
    render(<GlobalLoadingOverlay />);

    act(() => useGlobalLoadingStore.getState().start());
    act(() => useGlobalLoadingStore.getState().finish());
    act(() => vi.advanceTimersByTime(150));

    expect(screen.queryByRole('status', { name: '요청 처리 중' })).toBeNull();
  });

  it('hides after the final request finishes', () => {
    render(<GlobalLoadingOverlay />);

    act(() => useGlobalLoadingStore.getState().start());
    act(() => vi.advanceTimersByTime(150));

    expect(screen.getByRole('status', { name: '요청 처리 중' })).toBeTruthy();

    act(() => useGlobalLoadingStore.getState().finish());

    expect(screen.queryByRole('status', { name: '요청 처리 중' })).toBeNull();
  });
});
