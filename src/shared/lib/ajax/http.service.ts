import axios from 'axios';
import type {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

import { encodeQueryString } from '../utils';

const API_REQUEST_TIMEOUT = 9000;

interface RequestArgs {
  method: HttpMethod;
  url: string;
  queryParam?: Record<string, any>;
  payload?: unknown;
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
  private options: AxiosRequestConfig;

  constructor() {
    this.options = {
      timeout: API_REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    this.httpClient = axios.create(this.options);
  }

  init(config?: {
    interceptors?: {
      request?: {
        onFulfilled?: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
        onRejected?: (error: any) => any;
      };
      response?: {
        onFulfilled?: (value: any) => any;
        onRejected?: (error: any) => any;
      };
    };
  }): void {
    const interceptors = config?.interceptors;
    if (interceptors?.request) {
      this.httpClient.interceptors.request.use(interceptors.request.onFulfilled, interceptors.request.onRejected);
    }
    if (interceptors?.response) {
      this.httpClient.interceptors.response.use(
        interceptors.response.onFulfilled,
        interceptors.response.onRejected,
      );
    }
  }

  async get<T>(url: string, queryParam?: Record<string, any>, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>(
      {
        method: HttpMethod.GET,
        url: encodeQueryString(url),
        queryParam,
      },
      options,
    );
  }

  async post<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>(
      {
        method: HttpMethod.POST,
        url,
        payload,
      },
      options,
    );
  }

  async put<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>(
      {
        method: HttpMethod.PUT,
        url,
        payload,
      },
      options,
    );
  }

  async patch<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>(
      {
        method: HttpMethod.PATCH,
        url,
        payload,
      },
      options,
    );
  }

  async delete<T>(url: string, payload?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.execute<T>(
      {
        method: HttpMethod.DELETE,
        url,
        payload,
      },
      options,
    );
  }

  private httpRequest<T>(args: RequestArgs, config?: AxiosRequestConfig): AxiosPromise<T> {
    const { method, url, queryParam, payload } = args;

    return this.httpClient.request<T>({
      method,
      url,
      params: queryParam,
      data: payload,
      ...this.options,
      ...config,
    });
  }

  private async execute<T>(args: RequestArgs, options?: AxiosRequestConfig): Promise<T> {
    try {
      const { data, status } = await this.httpRequest<any>(args, options);
      if (status >= 200 && status < 300) {
        return data.data !== undefined ? data.data : data;
      }
      throw data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          throw error.response.data;
        }
      }
      throw error;
    }
  }
}

export const httpService = new HttpService();
