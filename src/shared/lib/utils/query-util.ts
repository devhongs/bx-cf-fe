import type {
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
  UseQueryOptions,
} from '@tanstack/react-query'
import { skipToken } from '@tanstack/react-query'
import endsWith from 'lodash-es/endsWith'
import isEmpty from 'lodash-es/isEmpty'
import startsWith from 'lodash-es/startsWith'

export function decodeQueryString(
  qs: string = window.location.search.substr(1),
) {
  // expects qs to not have a ?
  // return if empty qs
  if (qs === '') return {}
  return qs.split('&').reduce((acc: any, pair: any) => {
    // skip no param at all a=1&b=2&
    if (pair.length === 0) return acc
    const parts = pair.split('=')
    // fix params without value
    if (parts.length === 1) parts[1] = ''
    // for value handle multiple unencoded = signs
    const key = decodeURIComponent(parts[0])
    const value = decodeURIComponent(parts.slice(1).join('='))
    acc[key] = value
    return acc
  }, {})
}

/**
 * Rest get 메소드 사용시 url의 queryString value 값을 특수문자 인코딩 처리
 * 처리전 : gv/api/assets?locationId=catalog_asset_01&name=\&
 * 처리후 : gv/api/assets?locationId=catalog_asset_01&name=%5C&
 * @param url url
 * @returns 인코딩 처리 된 url
 */
export function encodeQueryString(url: string): string {
  const { api, search } = parseUrl(url)
  let queryString: string | undefined
  if (search) {
    queryString = `&${search}`
      // eslint-disable-next-line no-useless-escape
      .split(/(\&[\w.]+\=)/g)
      .map((str: any) => {
        if ((startsWith(str, '&') && endsWith(str, '=')) || isEmpty(str)) {
          return str
        }
        return encodeURIComponent(str)
      })
      .join('')
      // eslint-disable-next-line no-useless-escape
      .split(/^\&/)[1]
  }

  return queryString ? `${api}?${queryString}` : api
}

/**
 * url 에서 host, search 내용을 object 형식으로 변환
 * ex) gv/api/assets?locationId=catalog_asset_01&name=\&
 * @param url url
 * @returns {api: 'gv/api/assets', search: 'locationId=catalog_asset_01&name=\&'}
 */
export function parseUrl(url: string): any {
  const list: Array<string> = url.split('?')
  const api = list[0]
  const search = list.length > 1 ? list[1] : ''
  return { api, search }
}

export function getQuerySkipToken<T>() {
  return {
    queryKey: [] as const,
    queryFn: skipToken,
  } as
    | UseQueryOptions<T, unknown, T>
    | DefinedInitialDataOptions<T, unknown, T>
    | UndefinedInitialDataOptions<T, unknown, T>
}

export function objectToQueryString(originUrl: string, conditions: any = {}) {
  let url = originUrl
  const paramList = [] as Array<string>
  if (conditions && !isEmpty(conditions)) {
    Object.keys(conditions).map((key: string) => {
      const value = conditions[key]
      if (!isNullOrUndefined(value)) {
        paramList.push(`${key}=${value}`)
      }
    })
  }
  url += !isEmpty(paramList) ? `?${paramList.join('&')}` : ''
  return url
}

export function isNullOrUndefined<T>(obj: T | null | undefined): boolean {
  return typeof obj === 'undefined' || obj === null
}

export function toQueryParams(obj: any) {
  const params = new URLSearchParams()
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      // 배열 처리
      if (Array.isArray(value)) {
        value.forEach((val) => params.append(key, val))
      } else if (value !== undefined && value !== null) {
        params.append(key, value)
      }
    }
  }
  return params.toString() // query string 반환
}
