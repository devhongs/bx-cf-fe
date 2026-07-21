import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '../ajax/api-error';
import { useAlertStore } from '../model/alert/alert.store';

import { createQueryClient } from './queryClient';

const queuedMessages = () => useAlertStore.getState().queue.map((entry) => entry.message);

const failWith = (error: ApiError) => {
  const queryFn = vi.fn().mockRejectedValue(error);
  return { queryFn };
};

describe('createQueryClient', () => {
  beforeEach(() => {
    useAlertStore.setState({ queue: [] });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('routes query failures to the shared alert without any per-screen wiring', async () => {
    const client = createQueryClient();
    const { queryFn } = failWith(new ApiError('상품을 불러오지 못했습니다.', { code: '-4001' }));

    await expect(client.fetchQuery({ queryKey: ['product'], queryFn })).rejects.toThrow();

    await vi.waitFor(() => expect(queuedMessages()).toEqual(['상품을 불러오지 못했습니다.']));
  });

  it('stays silent when the screen opts out through meta', async () => {
    const client = createQueryClient();
    const { queryFn } = failWith(new ApiError('실패', { code: '-4001' }));

    await expect(
      client.fetchQuery({
        queryKey: ['product', 'silent'],
        queryFn,
        meta: { error: { silent: true } },
      }),
    ).rejects.toThrow();

    expect(queuedMessages()).toEqual([]);
  });

  it('does not retry business errors', async () => {
    const client = createQueryClient();
    const { queryFn } = failWith(new ApiError('필수값 누락', { code: '-1001' }));

    await expect(
      client.fetchQuery({ queryKey: ['product', 'business'], queryFn, retryDelay: 0 }),
    ).rejects.toThrow();

    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('retries once when the server was never reached', async () => {
    const client = createQueryClient();
    const { queryFn } = failWith(new ApiError('네트워크 오류', { kind: 'network' }));

    await expect(
      client.fetchQuery({ queryKey: ['product', 'network'], queryFn, retryDelay: 0 }),
    ).rejects.toThrow();

    expect(queryFn).toHaveBeenCalledTimes(2);
  });
});
