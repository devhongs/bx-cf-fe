import { describe, expect, it, vi } from 'vitest';

import { deleteSelectedItems } from './deleteSelectedItems';

const items = ['a', 'b', 'c', 'd'];

describe('deleteSelectedItems', () => {
  it('모두 성공하면 deleted에 원래 순서로 담는다', async () => {
    const result = await deleteSelectedItems(items, () => Promise.resolve());

    expect(result.deleted).toEqual(items);
    expect(result.failed).toEqual([]);
  });

  it('실패한 항목만 failed로 나눈다', async () => {
    const result = await deleteSelectedItems(items, (item) =>
      item === 'b' || item === 'd' ? Promise.reject(new Error('실패')) : Promise.resolve(),
    );

    expect(result.deleted).toEqual(['a', 'c']);
    expect(result.failed).toEqual(['b', 'd']);
  });

  it('동기적으로 던져도 failed로 분류한다', async () => {
    const result = await deleteSelectedItems(items, (item) => {
      if (item === 'a') throw new Error('동기 실패');
      return Promise.resolve();
    });

    expect(result.deleted).toEqual(['b', 'c', 'd']);
    expect(result.failed).toEqual(['a']);
  });

  it('빈 목록은 요청 없이 빈 결과를 준다', async () => {
    const deleteItem = vi.fn();
    const result = await deleteSelectedItems([], deleteItem);

    expect(deleteItem).not.toHaveBeenCalled();
    expect(result).toEqual({ deleted: [], failed: [] });
  });

  it('동시 실행 수를 concurrency 이하로 유지한다', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const many = Array.from({ length: 12 }, (_, i) => i);

    const result = await deleteSelectedItems(
      many,
      () => {
        inFlight += 1;
        maxInFlight = Math.max(maxInFlight, inFlight);
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            inFlight -= 1;
            resolve();
          }, 1);
        });
      },
      { concurrency: 3 },
    );

    expect(maxInFlight).toBe(3);
    expect(result.deleted).toHaveLength(12);
  });

  it('일부가 실패해도 남은 항목을 계속 처리한다', async () => {
    const deleteItem = vi.fn((item: string) =>
      item === 'a' ? Promise.reject(new Error('실패')) : Promise.resolve(),
    );

    const result = await deleteSelectedItems(items, deleteItem, { concurrency: 1 });

    expect(deleteItem).toHaveBeenCalledTimes(4);
    expect(result.deleted).toEqual(['b', 'c', 'd']);
  });
});
