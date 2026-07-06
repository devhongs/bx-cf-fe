import type {
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { skipToken } from '@tanstack/react-query';

type QueryValue = string | number | boolean | null | undefined;
type QueryParamValue = QueryValue | Array<QueryValue>;
type QueryParams = Record<string, QueryParamValue>;

const getCurrentQueryString = () => {
  if (typeof window === 'undefined') return '';
  return window.location.search.slice(1);
};

export function decodeQueryString(qs: string = getCurrentQueryString()): Record<string, string> {
  const queryString = qs.startsWith('?') ? qs.slice(1) : qs;
  if (queryString === '') return {};

  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Rest get 메소드 사용시 url의 queryString value 값을 특수문자 인코딩 처리
 * 처리전 : gv/api/assets?locationId=catalog_asset_01&name=\&
 * 처리후 : gv/api/assets?locationId=catalog_asset_01&name=%5C&
 * @param url url
 * @returns 인코딩 처리 된 url
 */
export function encodeQueryString(url: string): string {
  const { api, search } = parseUrl(url);
  if (!search) return api;

  const queryString = new URLSearchParams(search).toString();
  return queryString ? `${api}?${queryString}` : api;
}

/**
 * url 에서 host, search 내용을 object 형식으로 변환
 * ex) gv/api/assets?locationId=catalog_asset_01&name=\&
 * @param url url
 * @returns {api: 'gv/api/assets', search: 'locationId=catalog_asset_01&name=\&'}
 */
export function parseUrl(url: string): { api: string; search: string } {
  const queryIndex = url.indexOf('?');
  if (queryIndex < 0) {
    return { api: url, search: '' };
  }

  return {
    api: url.slice(0, queryIndex),
    search: url.slice(queryIndex + 1),
  };
}

export function getQuerySkipToken<T>() {
  return {
    queryKey: [] as const,
    queryFn: skipToken,
  } as
    | UseQueryOptions<T, unknown, T>
    | DefinedInitialDataOptions<T, unknown, T>
    | UndefinedInitialDataOptions<T, unknown, T>;
}

export function objectToQueryString(originUrl: string, conditions: QueryParams = {}) {
  const queryString = toQueryParams(conditions);
  if (!queryString) return originUrl;

  const separator = originUrl.includes('?')
    ? originUrl.endsWith('?') || originUrl.endsWith('&')
      ? ''
      : '&'
    : '?';
  return `${originUrl}${separator}${queryString}`;
}

export function isNullOrUndefined<T>(obj: T | null | undefined): boolean {
  return typeof obj === 'undefined' || obj === null;
}

export function toQueryParams(obj: QueryParams) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (!isNullOrUndefined(item)) {
          params.append(key, String(item));
        }
      }
      continue;
    }

    if (!isNullOrUndefined(value)) {
      params.append(key, String(value));
    }
  }

  return params.toString();
}
