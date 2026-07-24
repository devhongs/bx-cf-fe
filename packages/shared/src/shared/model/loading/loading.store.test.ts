import { beforeEach, describe, expect, it } from 'vitest';

import { useGlobalLoadingStore } from './loading.store';

beforeEach(() => {
  useGlobalLoadingStore.setState({ pendingCount: 0 });
});

describe('global loading store', () => {
  it('keeps loading until every concurrent request finishes', () => {
    const { start, finish } = useGlobalLoadingStore.getState();

    start();
    start();
    finish();

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(1);

    finish();
    expect(useGlobalLoadingStore.getState().pendingCount).toBe(0);
  });

  it('does not decrement below zero', () => {
    useGlobalLoadingStore.getState().finish();

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(0);
  });
});
