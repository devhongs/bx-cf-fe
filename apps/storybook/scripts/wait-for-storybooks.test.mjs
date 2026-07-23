import { describe, expect, it, vi } from 'vitest';

import { waitForUrls } from './wait-for-storybooks.mjs';

describe('waitForUrls', () => {
  it('waits until every Storybook index is available', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });
    const pause = vi.fn();

    await waitForUrls(['http://shared/index.json', 'http://pc/index.json'], {
      request,
      pause,
      now: () => 0,
    });

    expect(request).toHaveBeenCalledTimes(4);
    expect(pause).toHaveBeenCalledOnce();
  });

  it('retries rejected requests', async () => {
    const request = vi
      .fn()
      .mockRejectedValueOnce(new Error('not ready'))
      .mockResolvedValueOnce({ ok: true });

    await waitForUrls(['http://shared/index.json'], {
      request,
      pause: vi.fn(),
      now: () => 0,
    });

    expect(request).toHaveBeenCalledTimes(2);
  });

  it('reports persistently unavailable Storybooks after the deadline', async () => {
    let currentTime = 0;

    await expect(
      waitForUrls(['http://shared/index.json'], {
        request: vi.fn().mockResolvedValue({ ok: false }),
        timeoutMs: 10,
        intervalMs: 10,
        now: () => currentTime,
        pause: async (duration) => {
          currentTime += duration;
        },
      }),
    ).rejects.toThrow('http://shared/index.json');
  });

  it('aborts a stalled request at the deadline', async () => {
    let receivedSignal;
    const request = vi.fn((_url, options) => {
      receivedSignal = options?.signal;
      return receivedSignal ? new Promise(() => {}) : Promise.reject(new Error('signal required'));
    });

    await expect(
      waitForUrls(['http://shared/index.json'], {
        request,
        timeoutMs: 10,
        intervalMs: 1,
      }),
    ).rejects.toThrow('http://shared/index.json');

    expect(receivedSignal?.aborted).toBe(true);
  });
});
