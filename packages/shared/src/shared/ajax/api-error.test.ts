import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { API_ERROR_CODE } from '../constants/error-codes';

import { ApiError, apiErrorFromEnvelope, isApiError, toApiError } from './api-error';

const axiosErrorWith = (overrides: Partial<AxiosError>): AxiosError => {
  const error = new AxiosError('Request failed');
  return Object.assign(error, overrides);
};

const responseWith = (status: number, data: unknown) =>
  ({
    status,
    statusText: '',
    data,
    headers: {},
    config: { headers: new AxiosHeaders() },
  }) as AxiosError['response'];

describe('ApiError', () => {
  it('exposes the server message through both message and the legacy msg field', () => {
    const error = new ApiError('잔액이 부족합니다.', { code: '-3001' });

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('잔액이 부족합니다.');
    expect(error.msg).toBe('잔액이 부족합니다.');
  });

  it('classifies auth codes as auth so the central handler skips them', () => {
    expect(new ApiError('x', { code: API_ERROR_CODE.EXPIRED_TOKEN }).kind).toBe('auth');
    expect(new ApiError('x', { code: API_ERROR_CODE.INVALID_TOKEN }).kind).toBe('auth');
    expect(new ApiError('x', { status: 401 }).kind).toBe('auth');
  });

  it('keeps ACCESS_DENIED as a business error because it must not log the user out', () => {
    expect(new ApiError('x', { code: API_ERROR_CODE.ACCESS_DENIED }).kind).toBe('business');
  });

  it('classifies 5xx and the server error code as server', () => {
    expect(new ApiError('x', { status: 500 }).kind).toBe('server');
    expect(new ApiError('x', { code: API_ERROR_CODE.SERVER_ERROR }).kind).toBe('server');
  });
});

describe('toApiError', () => {
  it('passes an existing ApiError through untouched', () => {
    const original = new ApiError('원본', { code: '-3001' });

    expect(toApiError(original)).toBe(original);
  });

  it('reads the envelope out of an axios error response', () => {
    const error = toApiError(
      axiosErrorWith({
        response: responseWith(400, { success: false, code: '-1001', msg: '필수값 누락' }),
      }),
    );

    expect(error.code).toBe('-1001');
    expect(error.message).toBe('필수값 누락');
    expect(error.status).toBe(400);
    expect(error.kind).toBe('business');
  });

  it('classifies a response-less axios error as network', () => {
    const error = toApiError(axiosErrorWith({ code: 'ERR_NETWORK' }));

    expect(error.kind).toBe('network');
    expect(error.code).toBe('-1');
  });

  it('classifies an aborted axios error as timeout', () => {
    const error = toApiError(axiosErrorWith({ code: 'ECONNABORTED' }));

    expect(error.kind).toBe('timeout');
  });

  it('normalizes a legacy envelope thrown as a plain object', () => {
    const error = toApiError({ success: false, code: '-4001', msg: '데이터 없음' });

    expect(isApiError(error)).toBe(true);
    expect(error.code).toBe('-4001');
    expect(error.message).toBe('데이터 없음');
  });

  it('falls back to a default message for unknown throwables', () => {
    expect(toApiError('boom').message).toBe('요청 처리 중 오류가 발생했습니다.');
    expect(toApiError(new Error('터짐')).message).toBe('터짐');
  });
});

describe('apiErrorFromEnvelope', () => {
  it('uses the default message when the server sends a blank msg', () => {
    expect(apiErrorFromEnvelope({ code: '-9999', msg: '  ' }).message).toBe(
      '요청 처리 중 오류가 발생했습니다.',
    );
  });
});
