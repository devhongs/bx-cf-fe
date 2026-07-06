import { describe, expect, it } from 'vitest';

import { encodeQueryString, objectToQueryString, parseUrl, toQueryParams } from './query-util';

describe('query util', () => {
  it('encodes existing query string values with URLSearchParams semantics', () => {
    expect(encodeQueryString('/assets?name=a b&path=\\')).toBe('/assets?name=a+b&path=%5C');
  });

  it('converts objects to encoded query strings while skipping nullish values', () => {
    expect(
      objectToQueryString('/assets', {
        name: '홍 길동',
        keyword: 'a&b=c',
        empty: '',
        nullable: null,
        optional: undefined,
      }),
    ).toBe('/assets?name=%ED%99%8D+%EA%B8%B8%EB%8F%99&keyword=a%26b%3Dc&empty=');
  });

  it('appends encoded query strings to urls with existing params', () => {
    expect(objectToQueryString('/assets?page=1', { keyword: 'a b' })).toBe(
      '/assets?page=1&keyword=a+b',
    );
  });

  it('encodes array values as repeated query params', () => {
    expect(toQueryParams({ id: ['A&B', 'C D'], page: 1, empty: '', skip: null })).toBe(
      'id=A%26B&id=C+D&page=1&empty=',
    );
  });

  it('parses a url at the first question mark only', () => {
    expect(parseUrl('/assets?keyword=what?ever')).toEqual({
      api: '/assets',
      search: 'keyword=what?ever',
    });
  });
});
