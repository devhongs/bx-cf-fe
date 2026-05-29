import type { ApiListResponse, ApiResponse } from '@/shared/api/types';

import { toQueryParams } from '../utils';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const checkStatus = async (res: Response, method: string, url: string) => {
  if (!res.ok) {
    let errorDetail = '';
    try {
      errorDetail = await res.text();
    } catch {
      errorDetail = res.statusText;
    }
    throw new Error(`HTTP Error: ${method} ${url} failed with status ${res.status}. Detail: ${errorDetail}`);
  }
};

// sample url: http://localhost:3001/alarms
export const HttpJsonService = {
  /**
   * 여러 데이터를 페이지네이션 형태로 조회합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} [queryParam] - 쿼리 파라미터 (선택)
   * @returns {Promise<ApiListResponse<T>>} 페이지네이션 API 응답 Promise
   */
  async fetchAll<T>(url: string, queryParam?: any): Promise<ApiListResponse<T>> {
    const query = toQueryParams(queryParam);
    const fullUrl = query ? `${url}/?${query}` : url;
    const res = await fetch(fullUrl);
    await checkStatus(res, 'GET', fullUrl);
    const data = await res.json();
    return convertApiListResponse<T>(data);
  },

  /**
   * 단일 데이터를 조회합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @returns {Promise<ApiResponse<T>>} API 응답 Promise
   */
  async fetch<T>(url: string): Promise<ApiResponse<T>> {
    const res = await fetch(url);
    await checkStatus(res, 'GET', url);
    const data = await res.json();
    return convertApiResponse<T>(data);
  },

  /**
   * 최근 사용한 데이터를 페이지네이션 형태로 조회합니다. (fetchAll 재사용하여 중복 제거)
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} [queryParam] - 쿼리 파라미터 (선택)
   * @returns {Promise<ApiListResponse<T>>} 페이지네이션 API 응답 Promise
   */
  async fetchRecent<T>(url: string, queryParam?: any): Promise<ApiListResponse<T>> {
    return this.fetchAll<T>(url, queryParam);
  },

  /**
   * 데이터를 생성(POST)합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} payload - 전송할 데이터
   * @returns {Promise<T>} 생성된 데이터 Promise
   */
  async post<T>(url: string, payload: any): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(payload),
    });
    await checkStatus(res, 'POST', url);
    const data = await res.json();
    return data;
  },

  /**
   * 데이터를 교체(PUT)합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} payload - 전송할 데이터
   * @returns {Promise<T>} 교체된 데이터 Promise
   */
  async put<T>(url: string, payload: any): Promise<T> {
    const res = await fetch(url, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(payload),
    });
    await checkStatus(res, 'PUT', url);
    const data = await res.json();
    return data as Promise<T>;
  },

  /**
   * 데이터를 수정(PATCH)합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} payload - 수정할 데이터
   * @returns {Promise<T>} 수정된 데이터 Promise
   */
  async patch<T>(url: string, payload: any): Promise<T> {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(payload),
    });
    await checkStatus(res, 'PATCH', url);
    const data = await res.json();
    return data;
  },

  /**
   * 데이터를 삭제(DELETE)합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @returns {Promise<T>} 삭제 결과 Promise
   */
  async delete<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: 'DELETE' });
    await checkStatus(res, 'DELETE', url);
    const data = await res.json();
    return data;
  },
};

/**
 * 단일 데이터 응답을 ApiResponse 형태로 변환합니다.
 * @template T
 * @param {T} mockData - 변환할 데이터
 * @returns {ApiResponse<T>} ApiResponse 형태의 데이터
 */
export function convertApiResponse<T>(mockData: T): ApiResponse<T> {
  return {
    content: Array.isArray(mockData) ? mockData[0] : mockData,
    totalElements: 1,
  };
}

/**
 * 배열 데이터 응답을 ApiListResponse 형태로 변환합니다.
 * @template T
 * @param {T[]} mockData - 변환할 데이터 배열
 * @returns {ApiListResponse<T>} ApiListResponse 형태의 데이터
 */
export function convertApiListResponse<T>(mockData: Array<T>): ApiListResponse<T> {
  return {
    content: mockData,
    totalElements: Array.isArray(mockData) ? mockData.length : 1,
  };
}
