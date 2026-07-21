import axios from 'axios';

import { API_ERROR_CODE, isExpiredTokenCode, isFatalAuthCode } from '../constants/error-codes';

/**
 * 통신 실패의 성격. 중앙 에러 핸들러(handleApiError)의 분기 기준이다.
 *
 * - business: 서버가 정상 응답한 업무 에러 (envelope success:false)
 * - auth    : 인증 실패 — http.service 인터셉터가 재발급/로그아웃으로 이미 처리한다
 * - network : 서버에 닿지 못함
 * - timeout : 응답 시간 초과
 * - server  : 5xx 또는 서버 내부 오류 코드
 * - canceled: 요청 취소 (AbortController, 컴포넌트 언마운트 등)
 */
export type ApiErrorKind = 'business' | 'auth' | 'network' | 'timeout' | 'server' | 'canceled';

/** 서버 공통 응답(envelope) 중 에러 판별에 필요한 부분만 */
interface ErrorEnvelope {
  code?: string;
  msg?: string;
  payload?: unknown;
}

/** 코드를 알 수 없는 실패(네트워크 등)의 기본 코드 */
export const UNKNOWN_ERROR_CODE = '-1';

const DEFAULT_MESSAGE = '요청 처리 중 오류가 발생했습니다.';
const NETWORK_MESSAGE = '네트워크에 연결할 수 없습니다. 연결 상태를 확인해 주세요.';
const TIMEOUT_MESSAGE = '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.';
const CANCELED_MESSAGE = '요청이 취소되었습니다.';

const isErrorEnvelope = (value: unknown): value is ErrorEnvelope =>
  typeof value === 'object' && value !== null && ('code' in value || 'msg' in value);

/** code·status로 에러 성격을 판정한다. ACCESS_DENIED(-1005)는 로그아웃 대상이 아니므로 business로 둔다. */
const resolveKind = (code?: string, status?: number): ApiErrorKind => {
  if (isExpiredTokenCode(code) || isFatalAuthCode(code) || status === 401) return 'auth';
  if (code === API_ERROR_CODE.SERVER_ERROR || (status !== undefined && status >= 500)) {
    return 'server';
  }
  return 'business';
};

export interface ApiErrorInit {
  code?: string;
  status?: number;
  /** 생략하면 code·status로 자동 판정 */
  kind?: ApiErrorKind;
  payload?: unknown;
  url?: string;
  cause?: unknown;
}

/**
 * 모든 통신 실패의 단일 표현.
 *
 * 기존에는 envelope plain object / 서버 body / 직접 만든 객체 / AxiosError 4가지 모양이
 * 던져져서 호출부가 분기할 수 없었다. 이 클래스로 모양을 하나로 고정한다.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly kind: ApiErrorKind;
  readonly payload: unknown;
  readonly url?: string;

  constructor(message: string, init: ApiErrorInit = {}) {
    super(message, { cause: init.cause });
    this.name = 'ApiError';
    this.code = init.code ?? UNKNOWN_ERROR_CODE;
    this.status = init.status;
    this.kind = init.kind ?? resolveKind(init.code, init.status);
    this.payload = init.payload ?? null;
    this.url = init.url;
  }

  /** 하위호환 — 기존 코드가 envelope의 `msg`를 읽던 자리 */
  get msg(): string {
    return this.message;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

/** 서버 envelope(success:false)를 ApiError로 변환한다. */
export const apiErrorFromEnvelope = (
  envelope: ErrorEnvelope,
  context?: { status?: number; url?: string; cause?: unknown },
): ApiError =>
  new ApiError(envelope.msg?.trim() || DEFAULT_MESSAGE, {
    code: envelope.code,
    status: context?.status,
    payload: envelope.payload,
    url: context?.url,
    cause: context?.cause,
  });

/**
 * 무엇이 던져졌든 ApiError로 정규화한다. 이미 ApiError면 그대로 통과시킨다.
 * http.service.execute()와 raw axios를 쓰는 refreshTokenApi 양쪽에서 사용한다.
 */
export const toApiError = (error: unknown, context?: { url?: string }): ApiError => {
  if (isApiError(error)) return error;

  if (axios.isCancel(error)) {
    return new ApiError(CANCELED_MESSAGE, { kind: 'canceled', url: context?.url, cause: error });
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const url = context?.url ?? error.config?.url;
    const body = error.response?.data;

    if (isErrorEnvelope(body)) {
      return apiErrorFromEnvelope(body, { status, url, cause: error });
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError(TIMEOUT_MESSAGE, { kind: 'timeout', url, cause: error });
    }

    if (!error.response) {
      return new ApiError(NETWORK_MESSAGE, { kind: 'network', url, cause: error });
    }

    return new ApiError(error.message || DEFAULT_MESSAGE, {
      status,
      url,
      payload: body,
      cause: error,
    });
  }

  // 레거시 경로: envelope plain object가 그대로 throw 된 경우
  if (isErrorEnvelope(error)) {
    return apiErrorFromEnvelope(error, { url: context?.url });
  }

  if (error instanceof Error) {
    return new ApiError(error.message || DEFAULT_MESSAGE, { url: context?.url, cause: error });
  }

  return new ApiError(DEFAULT_MESSAGE, { url: context?.url, cause: error });
};
