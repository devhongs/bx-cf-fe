import axios from 'axios';
import type {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

import { isExpiredTokenCode, isFatalAuthCode } from '../constants/error-codes';
import { encodeQueryString } from '../lib/utils';

interface RequestArgs {
  method: HttpMethod;
  url: string;
  queryParam?: Record<string, any>;
  payload?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: string;
  msg: string;
  payload: T;
}

/**
 * JWT 인증 설정.
 * 토큰 부착 / 401 재발급 / 인증 실패 처리를 외부(entities/auth)에서 주입한다.
 * → http.service가 인증 모듈에 직접 의존하지 않도록 분리(순환참조 방지).
 */
export interface HttpAuthConfig {
  /** 요청에 부착할 액세스 토큰을 반환 (없으면 null) */
  getAccessToken: () => string | null;
  /** 401 발생 시 토큰 재발급. 성공하면 새 액세스 토큰, 실패하면 null */
  refreshToken: () => Promise<string | null>;
  /** 재발급까지 실패한 경우 처리 (로그아웃·리다이렉트 등) */
  onAuthFail: () => void;
}

/** 재발급 재시도 여부를 추적하기 위한 내부 플래그 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class HttpService {
  private httpClient: AxiosInstance;
  private authConfig?: HttpAuthConfig;
  /** 동시 다발 401에서 refresh를 1회만 수행하기 위한 single-flight promise */
  private refreshPromise: Promise<string | null> | null = null;
  private authRequestInterceptorId: number | null = null;
  private authResponseInterceptorId: number | null = null;

  constructor() {
    this.httpClient = axios.create({
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
  }

  /**
   * 앱 시작 시 한 번 호출해서 baseURL·timeout·인터셉터를 설정합니다.
   * (apps/[app]/src/main.tsx에서 호출)
   */
  init(config?: {
    baseURL?: string;
    timeout?: number;
    interceptors?: {
      request?: {
        onFulfilled?: (
          value: InternalAxiosRequestConfig,
        ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
        onRejected?: (error: any) => any;
      };
      response?: {
        onFulfilled?: (value: any) => any;
        onRejected?: (error: any) => any;
      };
    };
    /** JWT 인증 사용 시 주입 (Spring 백엔드 등) */
    auth?: HttpAuthConfig;
  }): void {
    if (config?.baseURL) this.httpClient.defaults.baseURL = config.baseURL;
    if (config?.timeout) this.httpClient.defaults.timeout = config.timeout;

    const interceptors = config?.interceptors;
    if (interceptors?.request) {
      this.httpClient.interceptors.request.use(
        interceptors.request.onFulfilled,
        interceptors.request.onRejected,
      );
    }
    if (interceptors?.response) {
      this.httpClient.interceptors.response.use(
        interceptors.response.onFulfilled,
        interceptors.response.onRejected,
      );
    }

    if (config?.auth) {
      this.authConfig = config.auth;
      this.setupAuthInterceptors();
    }
  }

  /** 로그인·재발급 등 인증 엔드포인트 여부 (재발급 재시도 제외 → 무한루프 방지) */
  private isAuthEndpoint(url?: string): boolean {
    return (url ?? '').includes('/auth/');
  }

  /**
   * refreshToken으로 토큰을 재발급한 뒤 원요청을 1회 재시도한다. (single-flight)
   * @returns 재시도한 응답 Promise. 재발급 불가/실패 시 null.
   */
  private async refreshAndRetry(original?: RetryableRequestConfig) {
    if (!original || original._retry || !this.authConfig) return null;
    original._retry = true;

    if (!this.refreshPromise) {
      this.refreshPromise = this.authConfig.refreshToken().finally(() => {
        this.refreshPromise = null;
      });
    }

    const newToken = await this.refreshPromise;
    if (!newToken) return null;

    original.headers.Authorization = `Bearer ${newToken}`;
    return this.httpClient(original);
  }

  /**
   * JWT 인증 인터셉터 등록. 비즈니스 에러코드(envelope.code) 기준으로 분기한다.
   * - 요청: Authorization 헤더에 Bearer 토큰 부착
   * - EXPIRED_TOKEN(-1004): refreshToken으로 재발급 후 원요청 재시도
   * - INVALID_TOKEN(-1002)/UNAUTHORIZED_CLIENT(-1003): 즉시 로그아웃
   * - ACCESS_DENIED(-1005): 권한 에러 — 로그아웃하지 않고 그대로 에러 전달
   *
   * 만료 토큰은 서버 구현에 따라 HTTP 401(onRejected) 또는
   * HTTP 200 + success:false(onFulfilled)로 올 수 있어 양쪽 모두 처리한다.
   */
  private setupAuthInterceptors(): void {
    if (this.authRequestInterceptorId !== null) {
      this.httpClient.interceptors.request.eject(this.authRequestInterceptorId);
    }
    if (this.authResponseInterceptorId !== null) {
      this.httpClient.interceptors.response.eject(this.authResponseInterceptorId);
    }

    this.authRequestInterceptorId = this.httpClient.interceptors.request.use((request) => {
      const token = this.authConfig?.getAccessToken();
      if (token && !this.isAuthEndpoint(request.url)) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    });

    this.authResponseInterceptorId = this.httpClient.interceptors.response.use(
      // HTTP 200이지만 envelope.success가 false인 경우(만료 토큰 등) 처리
      async (response) => {
        const data = response.data as ApiResponse | undefined;
        if (
          !this.authConfig ||
          this.isAuthEndpoint(response.config?.url) ||
          !data ||
          data.success !== false
        ) {
          return response;
        }

        if (isExpiredTokenCode(data.code)) {
          const retried = await this.refreshAndRetry(response.config as RetryableRequestConfig);
          if (retried) return retried;
          this.authConfig.onAuthFail();
        } else if (isFatalAuthCode(data.code)) {
          this.authConfig.onAuthFail();
        }
        return response;
      },
      // HTTP 4xx/5xx 처리
      async (error) => {
        const original = error.config as RetryableRequestConfig | undefined;
        const status = error.response?.status;
        const code = (error.response?.data as ApiResponse | undefined)?.code;

        if (!this.authConfig || this.isAuthEndpoint(original?.url)) {
          return Promise.reject(error);
        }

        // 만료 토큰: 코드(-1004) 또는 코드 없는 순수 401
        if (isExpiredTokenCode(code) || (status === 401 && !code)) {
          const retried = await this.refreshAndRetry(original);
          if (retried) return retried;
          this.authConfig.onAuthFail();
        } else if (isFatalAuthCode(code) || status === 401) {
          // 재발급 불가한 인증 실패 → 로그아웃 (ACCESS_DENIED/-1005는 제외)
          this.authConfig.onAuthFail();
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(
    url: string,
    queryParam?: Record<string, any>,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    return this.execute<T>(
      { method: HttpMethod.GET, url: encodeQueryString(url), queryParam },
      options,
    );
  }

  async post<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>({ method: HttpMethod.POST, url, payload: payload ?? {} }, options);
  }

  async put<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>({ method: HttpMethod.PUT, url, payload }, options);
  }

  async patch<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>({ method: HttpMethod.PATCH, url, payload }, options);
  }

  async delete<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>({ method: HttpMethod.DELETE, url, payload }, options);
  }

  private httpRequest<T>(args: RequestArgs, config?: AxiosRequestConfig): AxiosPromise<T> {
    const { method, url, queryParam, payload } = args;
    return this.httpClient.request<T>({
      method,
      url,
      params: queryParam,
      data: payload,
      ...config,
    });
  }

  private async execute<T>(args: RequestArgs, options?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.httpRequest<ApiResponse<T>>(args, options);

      if (data.success) {
        return data.payload;
      }

      throw data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data) throw error.response.data;
        throw {
          success: false,
          code: '-1',
          msg: error.message,
          payload: null,
        } satisfies ApiResponse<null>;
      }
      throw error;
    }
  }
}

export const httpService = new HttpService();
