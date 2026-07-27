export interface DeleteSelectedItemsResult<T> {
  deleted: T[];
  failed: T[];
}

export interface DeleteSelectedItemsOptions {
  /** 동시에 보낼 요청 수. 선택 건수가 많아도 서버를 한 번에 때리지 않게 제한한다. */
  concurrency?: number;
}

const DEFAULT_CONCURRENCY = 5;

/**
 * 선택 항목을 삭제하고 성공/실패를 나눠 돌려준다.
 * 개별 실패는 삼키지 않고 failed로 모아 호출부가 재시도 대상으로 쓸 수 있게 한다.
 */
export async function deleteSelectedItems<T>(
  items: T[],
  deleteItem: (item: T) => Promise<unknown>,
  { concurrency = DEFAULT_CONCURRENCY }: DeleteSelectedItemsOptions = {},
): Promise<DeleteSelectedItemsResult<T>> {
  const succeeded = new Array<boolean>(items.length);
  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  let cursor = 0;

  const runWorker = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;

      try {
        await deleteItem(items[index]);
        succeeded[index] = true;
      } catch {
        succeeded[index] = false;
      }
    }
  };

  await Promise.all(Array.from({ length: workerCount }, runWorker));

  const deleted: T[] = [];
  const failed: T[] = [];
  items.forEach((item, index) => {
    (succeeded[index] ? deleted : failed).push(item);
  });

  return { deleted, failed };
}
