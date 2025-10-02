import type { ApiListResponse, ApiResponse } from '@/shared/api/types'

export function mockToApiResponse<T>(mockData: T): ApiResponse<T> {
  return {
    content: mockData,
    totalElements: Array.isArray(mockData) ? mockData.length : 1,
  }
}

export function mockToApiListResponse<T>(mockData: T[]): ApiListResponse<T> {
  return {
    content: mockData,
    totalElements: Array.isArray(mockData) ? mockData.length : 1,
  }
}
