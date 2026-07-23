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
