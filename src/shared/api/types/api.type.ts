export interface ApiRequest {
  sort?: ApiSort; // 정렬 옵션
}

export interface ApiResponse<T> {
  content: T; // 응답 데이터
  totalElements: number; // 전체 요소 수
  sort?: ApiSort; // 정렬 정보
}

export interface ApiListResponse<T> extends Omit<ApiResponse<T>, 'content'> {
  content: Array<T>; // 응답 데이터
  totalElements: number; // 전체 요소 수
  sort?: ApiSort; // 정렬 정보
  pagination?: ApiPagination; // 페이징 정보
}

export interface ApiSort {
  sorted: boolean; // 정렬됨 여부
  unsorted: boolean; // 정렬 안됨 여부
  empty: boolean; // 비어있는지 여부
}

export interface ApiPagination {
  size: number; // 페이지 크기
  totalPages: number; // 전체 페이지 수
  offset: number; // 오프셋
  pageSize: number; // 페이지당 아이템 수
  paged: boolean; // 페이징 여부
  pageNumber: number; // 현재 페이지 번호
  unpaged: boolean; // 페이징 안함 여부
  first: boolean; // 첫 페이지 여부
  last: boolean; // 마지막 페이지 여부
  empty: boolean; // 비어있는지 여부
}
