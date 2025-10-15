import type { ApiListResponse, ApiResponse } from '@/shared/api/types'

import { toQueryParams } from '../utils'

// sample url: http://localhost:3001/alarms
export default class HttpJsonService {
  /**
   * 여러 데이터를 페이지네이션 형태로 조회합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} [queryParam] - 쿼리 파라미터 (선택)
   * @returns {Promise<ApiListResponse <T>>} 페이지네이션 API 응답 Promise
   */
  static async fetchAll<T>(
    url: string,
    queryParam?: any,
  ): Promise<ApiListResponse<T>> {
    const query = toQueryParams(queryParam)
    const fullUrl = query ? `${url}/?${query}` : url
    const res = await fetch(fullUrl)
    const data = await res.json()
    return convertApiListResponse<T>(data)
  }

  /**
   * 단일 데이터를 조회합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} [queryParam] - 쿼리 파라미터 (선택)
   * @returns {Promise<ApiResponse<T>>} API 응답 Promise
   */
  static async fetch<T>(url: string): Promise<ApiResponse<T>> {
    const res = await fetch(url)
    const data = await res.json()
    return convertApiResponse<T>(data)
  }

  /**
   * 데이터를 생성(POST)합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} payload - 전송할 데이터
   * @returns {Promise<T>} 생성된 데이터 Promise
   */
  static async post<T>(url: string, payload: any): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return data
  }

  /**
   * 데이터를 수정(PATCH)합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @param {any} payload - 수정할 데이터
   * @returns {Promise<T>} 수정된 데이터 Promise
   */
  static async patch<T>(url: string, payload: any): Promise<T> {
    const res = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return data
  }

  /**
   * 데이터를 삭제(DELETE)합니다.
   * @template T
   * @param {string} url - 요청할 URL
   * @returns {Promise<T>} 삭제 결과 Promise
   */
  static async delete<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: 'DELETE' })
    const data = await res.json()
    return data
  }
}

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
  }
}

/**
 * 배열 데이터 응답을 ApiListResponse  형태로 변환합니다.
 * @template T
 * @param {T[]} mockData - 변환할 데이터 배열
 * @returns {ApiListResponse <T>} ApiListResponse  형태의 데이터
 */
export function convertApiListResponse<T>(mockData: Array<T>): ApiListResponse<T> {
  return {
    content: mockData,
    totalElements: Array.isArray(mockData) ? mockData.length : 1,
  }
}
