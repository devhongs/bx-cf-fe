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
});
