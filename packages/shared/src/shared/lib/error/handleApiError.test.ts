import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '../../ajax/api-error';
import { API_ERROR_CODE } from '../../constants/error-codes';
import { useAlertStore } from '../../model/alert/alert.store';

import { handleApiError } from './handleApiError';

/** 알럿이 뜰 때까지 기다렸다가 사용자가 닫는 것을 흉내낸다. */
const closeAlert = async () => {
  await vi.waitFor(() => expect(useAlertStore.getState().queue.length).toBeGreaterThan(0));
  useAlertStore.getState().close();
};

const queuedMessages = () => useAlertStore.getState().queue.map((entry) => entry.message);

describe('handleApiError', () => {
  beforeEach(() => {
    useAlertStore.setState({ queue: [] });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the server message and runs onClose after the alert is dismissed', async () => {
    const onClose = vi.fn();
    const error = new ApiError('잔액이 부족합니다.', { code: '-3001' });

    const handled = handleApiError(error, { onClose });

    await closeAlert();
    await handled;

    expect(onClose).toHaveBeenCalledWith(error);
  });

  it('does not run onClose while the alert is still open', async () => {
    const onClose = vi.fn();

    void handleApiError(new ApiError('실패', { code: '-3001' }), { onClose });

    await vi.waitFor(() => expect(queuedMessages()).toEqual(['실패']));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows nothing when the screen opts out with silent', async () => {
    await handleApiError(new ApiError('실패', { code: '-3001' }), { silent: true });

    expect(queuedMessages()).toEqual([]);
  });

  it('accepts a predicate for silent', async () => {
    const policy = { silent: (error: ApiError) => error.code === '-3001' };

    await handleApiError(new ApiError('무시', { code: '-3001' }), policy);
    void handleApiError(new ApiError('노출', { code: '-3002' }), policy);

    await vi.waitFor(() => expect(queuedMessages()).toEqual(['노출']));
  });

  it('skips the codes listed in ignoreCodes', async () => {
    await handleApiError(new ApiError('없는 데이터', { code: API_ERROR_CODE.DB_NO_DATA_ERROR }), {
      ignoreCodes: [API_ERROR_CODE.DB_NO_DATA_ERROR],
    });

    expect(queuedMessages()).toEqual([]);
  });

  it('skips auth errors because the interceptor already handled them', async () => {
    await handleApiError(new ApiError('토큰 만료', { code: API_ERROR_CODE.EXPIRED_TOKEN }));

    expect(queuedMessages()).toEqual([]);
  });

  it('skips canceled requests', async () => {
    await handleApiError(new ApiError('취소', { kind: 'canceled' }));

    expect(queuedMessages()).toEqual([]);
  });

  it('ignores router redirects thrown through the query cache', async () => {
    await handleApiError({ isRedirect: true, to: '/login' });

    expect(queuedMessages()).toEqual([]);
  });

  it('overrides the message when the policy provides one', async () => {
    void handleApiError(new ApiError('DB 오류', { code: '-4001' }), {
      message: '목록을 불러오지 못했습니다.',
    });

    await vi.waitFor(() => expect(queuedMessages()).toEqual(['목록을 불러오지 못했습니다.']));
  });

  it('collapses identical messages so parallel failures do not stack alerts', async () => {
    void handleApiError(new ApiError('서버 오류', { code: '-9999' }));
    void handleApiError(new ApiError('서버 오류', { code: '-9999' }));
    void handleApiError(new ApiError('다른 오류', { code: '-4001' }));

    await vi.waitFor(() => expect(queuedMessages()).toEqual(['서버 오류', '다른 오류']));
  });

  it('normalizes non-ApiError throwables before showing them', async () => {
    void handleApiError({ success: false, code: '-4001', msg: '데이터 없음' });

    await vi.waitFor(() => expect(queuedMessages()).toEqual(['데이터 없음']));
  });
});
