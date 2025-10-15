import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios'

import { encodeQueryString } from '../utils'

const API_REQUEST_TIMEOUT = 9000

// sample url: https://jsonplaceholder.typicode.com/users
interface RequestArgs {
  method: HttpMethod
  url: string
  queryParam?: any
  payload?: any
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

// frontend ajax call interceptor
// (function () {
//   const origOpen = XMLHttpRequest.prototype.open;
//   XMLHttpRequest.prototype.open = function () {
//     console.log('request started:', arguments);
//     this.addEventListener('load', function () {
//       console.log('request completed!');
//       console.log(this.readyState); //will always be 4 (ajax is completed successfully)
//       console.log(this.responseText); //whatever the response was
//     });
//     origOpen.apply(this, arguments);
//   };
// })();

export class HttpService {
  private httpClient!: AxiosInstance
  private cancelTokenSource!: CancelTokenSource
  private options!: AxiosRequestConfig | undefined | null
  private interceptors: any
  private completed!: boolean

  init(config?: { interceptors: any }): void {
    this.interceptors = config?.interceptors
  }

  async get<T>(
    url: string,
    queryParam?: any,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    this.setOptions(options)
    return this.executeRequest<T>({
      method: HttpMethod.GET,
      url: encodeQueryString(url),
      queryParam,
    })
  }

  async post<T>(
    url: string,
    payload: any,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    this.setOptions(options)
    return this.executeRequest<T>({
      method: HttpMethod.POST,
      url,
      payload,
    })
  }

  async put<T>(
    url: string,
    payload: any,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    this.setOptions(options)
    return this.executeRequest<T>({
      method: HttpMethod.PUT,
      url,
      payload,
    })
  }

  async patch<T>(
    url: string,
    payload: any,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    this.setOptions(options)
    return this.executeRequest<T>({
      method: HttpMethod.PATCH,
      url,
      payload,
    })
  }

  async delete<T>(
    url: string,
    payload?: any,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    this.setOptions(options)
    return this.executeRequest<T>({
      method: HttpMethod.DELETE,
      url,
      payload,
    })
  }

  async execute<T>(
    args: RequestArgs,
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    this.setOptions(options)
    const { url } = args

    return this.httpRequest<T>(args)
      .then((response: AxiosResponse) => {
        console.log('axios.response', response)
        return response
      })
      .catch((error: AxiosError | Error) => {
        if (axios.isAxiosError(error)) {
          // status 4** backend 예외 코드
          const status = error.response?.status
          if (status && status >= 400 && status < 500) {
            throw error.response?.data
          }
          console.log('axios.error', error)
        } else {
          // this.showNotification('Unknown Error', error.message);
          console.log('> unknown error-2:', url, error)
        }
        throw error
      })
      .finally(() => {
        console.log('axios.httpRequest finally')
      })
  }

  private setOptions(
    options: AxiosRequestConfig = { timeout: API_REQUEST_TIMEOUT },
  ): void {
    if (this.options) {
      this.options = { ...this.options, ...options }
    } else {
      this.options = options
    }

    this.cancelTokenSource = axios.CancelToken.source()
    this.httpClient = axios.create({
      ...options,
      cancelToken: this.cancelTokenSource.token,
    })
    this.httpClient.interceptors.request.use(
      this.interceptors?.request.onFulfilled,
    )
    this.httpClient.interceptors.response.use(
      this.interceptors?.response.onFulfilled,
      this.interceptors?.response.onRejected,
    )
    this.completed = false
  }

  private httpRequest<T>(args: RequestArgs): AxiosPromise<T> {
    const { method, url, queryParam, payload } = args
    switch (method) {
      case HttpMethod.GET:
        if (payload) {
          return this.httpClient.get<T>(url, {
            params: queryParam,
            data: payload,
          })
        } else {
          return this.httpClient.get<T>(url, { params: queryParam })
        }
      case HttpMethod.POST:
        return this.httpClient.post<T>(url, payload)
      case HttpMethod.PUT:
        return this.httpClient.put<T>(url, payload)
      case HttpMethod.PATCH:
        return this.httpClient.patch<T>(url, payload)
      case HttpMethod.DELETE:
        if (payload) {
          return this.httpClient.delete<T>(url, { data: payload })
        } else {
          return this.httpClient.delete<T>(url)
        }
    }
  }

  private executeRequest<T>(args: RequestArgs): Promise<T> {
    return this.httpRequest<T>(args)
      .then((response: AxiosResponse) => {
        if (response.status >= 200 && response.status < 300) {
          return response.data.data
        } else {
          throw response.data
        }
      })
      .catch((error: AxiosError | Error) => {
        // TODO: 에러 케이스별 처리 및 공통 처리
        throw error
      })
      .finally(() => {
        this.completed = true
      })
  }
}

export const httpService = new HttpService()
