import axios from 'axios';
import type {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

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

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class HttpService {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      headers: { 'Content-Type': 'application/json' },
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
  }

  async get<T>(url: string, queryParam?: Record<string, any>, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>({ method: HttpMethod.GET, url: encodeQueryString(url), queryParam }, options);
  }

  async post<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>({ method: HttpMethod.POST, url, payload }, options);
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

/**
 * json-server 등 { success, code, msg, payload } 포맷을 따르지 않는
 * mock 백엔드의 응답을 표준 ApiResponse 포맷으로 감싸주는 인터셉터.
 * httpService.init({ interceptors: { response: mockApiResponseInterceptor } }) 형태로 사용
 */
export const mockApiResponseInterceptor = {
  onFulfilled: (response: any) => {
    if (response?.data && typeof response.data === 'object' && 'success' in response.data) {
      return response;
    }
    response.data = {
      success: true,
      code: '0',
      msg: 'success',
      payload: response.data,
    } satisfies ApiResponse;
    return response;
  },
};
