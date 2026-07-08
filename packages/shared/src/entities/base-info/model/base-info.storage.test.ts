// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';

import {
  BASE_INFO_SCHEMA_VERSION,
  createBaseInfoCacheKey,
  isBaseInfoCacheFresh,
  readBaseInfoCache,
  writeBaseInfoCache,
} from './base-info.storage';

describe('base info storage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('stores base info data with server version and frontend schema version', () => {
    writeBaseInfoCache('CODE', '0.1', [
      {
        groupCd: 'USE_YN',
        groupNm: '사용 여부',
        children: [{ groupCd: 'USE_YN', code: 'Y', codeNm: '사용' }],
      },
    ]);

    const cache = readBaseInfoCache('CODE');

    expect(cache).toMatchObject({
      type: 'CODE',
      serverVersion: '0.1',
      schemaVersion: BASE_INFO_SCHEMA_VERSION.CODE,
      data: [
        {
          groupCd: 'USE_YN',
          groupNm: '사용 여부',
          children: [{ groupCd: 'USE_YN', code: 'Y', codeNm: '사용' }],
        },
      ],
    });
    expect(typeof cache?.savedAt).toBe('string');
  });

  it('uses a scoped localStorage key when data can differ by user or role', () => {
    expect(createBaseInfoCacheKey('MENU', 'hongsik.yoo')).toBe('base-info:MENU:hongsik.yoo');
  });

  it('treats cache as fresh only when server version and schema version both match', () => {
    const freshCache = writeBaseInfoCache('MENU', '0.1', [{ menuId: 1 }], 'hongsik.yoo');

    expect(isBaseInfoCacheFresh(freshCache, '0.1', BASE_INFO_SCHEMA_VERSION.MENU)).toBe(true);
    expect(isBaseInfoCacheFresh(freshCache, '0.2', BASE_INFO_SCHEMA_VERSION.MENU)).toBe(false);
    expect(isBaseInfoCacheFresh(freshCache, '0.1', BASE_INFO_SCHEMA_VERSION.MENU + 1)).toBe(false);
  });
});
