// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { CONFIG } from '../../../shared/constants';
import { local, session } from '../../../shared/lib/utils';
import {
  fetchBaseInfoCommonCodes,
  fetchBaseInfoMenus,
  fetchBaseInfoVersions,
} from '../api/base-info.api';

import { bootstrapBaseInfo, bootstrapBaseInfoSafe } from './base-info.bootstrap';
import { createBaseInfoCacheKey, writeBaseInfoCache } from './base-info.storage';

vi.mock('../api/base-info.api', () => ({
  fetchBaseInfoVersions: vi.fn(),
  fetchBaseInfoMenus: vi.fn(),
  fetchBaseInfoCommonCodes: vi.fn(),
}));

const mockedFetchVersions = vi.mocked(fetchBaseInfoVersions);
const mockedFetchMenus = vi.mocked(fetchBaseInfoMenus);
const mockedFetchCommonCodes = vi.mocked(fetchBaseInfoCommonCodes);

describe('base info bootstrap', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('reuses localStorage cache when versions match and hydrates runtime session data', async () => {
    mockedFetchVersions.mockResolvedValue([
      { type: 'CODE', version: '0.1' },
      { type: 'menu', version: '0.1' },
    ]);
    writeBaseInfoCache('CODE', '0.1', [
      {
        groupCd: 'USE_YN',
        groupNm: '사용 여부',
        children: [
          { groupCd: 'USE_YN', code: 'Y', codeNm: '사용', sortSeq: 2 },
          { groupCd: 'USE_YN', code: 'N', codeNm: '미사용', sortSeq: 1 },
        ],
      },
    ]);
    writeBaseInfoCache('MENU', '0.1', [{ menuId: 1, menuNm: '대시보드' }], 'hongsik.yoo');

    const result = await bootstrapBaseInfo({ menuCacheScope: 'hongsik.yoo' });

    expect(mockedFetchCommonCodes).not.toHaveBeenCalled();
    expect(mockedFetchMenus).not.toHaveBeenCalled();
    expect(result.reused).toEqual(['CODE', 'MENU']);
    expect(session.get(CONFIG.SESSION.CODE)).toEqual({
      USE_YN: [
        { codeField: 'N', label: '미사용', labelField: '미사용' },
        { codeField: 'Y', label: '사용', labelField: '사용' },
      ],
    });
    expect(session.get(CONFIG.SESSION.MENU_LIST)).toEqual([{ menuId: 1, menuNm: '대시보드' }]);
  });

  it('fetches only stale base info types and stores them by version', async () => {
    mockedFetchVersions.mockResolvedValue([
      { type: 'CODE', version: '0.2' },
      { type: 'MENU', version: '0.1' },
    ]);
    writeBaseInfoCache('CODE', '0.1', [
      {
        groupCd: 'USE_YN',
        groupNm: '사용 여부',
        children: [{ groupCd: 'USE_YN', code: 'N', codeNm: '미사용' }],
      },
    ]);
    writeBaseInfoCache('MENU', '0.1', [{ menuId: 1, menuNm: '대시보드' }], 'hongsik.yoo');
    mockedFetchCommonCodes.mockResolvedValue([
      {
        groupCd: 'USE_YN',
        groupNm: '사용 여부',
        children: [{ groupCd: 'USE_YN', code: 'Y', codeNm: '사용' }],
      },
    ]);

    const result = await bootstrapBaseInfo({ menuCacheScope: 'hongsik.yoo' });

    expect(mockedFetchCommonCodes).toHaveBeenCalledTimes(1);
    expect(mockedFetchMenus).not.toHaveBeenCalled();
    expect(result.refreshed).toEqual(['CODE']);
    expect(result.reused).toEqual(['MENU']);
    expect(local.get(createBaseInfoCacheKey('CODE'))).toMatchObject({
      serverVersion: '0.2',
      data: [
        {
          groupCd: 'USE_YN',
          children: [{ groupCd: 'USE_YN', code: 'Y', codeNm: '사용' }],
        },
      ],
    });
  });

  it('resolves safely when version lookup fails so the app can continue loading', async () => {
    mockedFetchVersions.mockRejectedValue(new Error('network down'));

    await expect(bootstrapBaseInfoSafe()).resolves.toMatchObject({
      failed: [{ stage: 'versions' }],
    });
  });
});
