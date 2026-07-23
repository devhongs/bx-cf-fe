import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';

import {
  fetchBaseInfoCommonCodes,
  fetchBaseInfoMenus,
  fetchBaseInfoVersions,
} from './base-info.api';

describe('base info api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches base info versions from the system endpoint', async () => {
    const versions = [
      { refType: 'CODE', versionNo: '0.1' },
      { refType: 'menu', versionNo: '0.1' },
    ];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(versions);

    const result = await fetchBaseInfoVersions();

    expect(postSpy).toHaveBeenCalledWith('/system/reference-data/versions/latest', {
      data: { refType: 'ALL' },
    });
    expect(result).toEqual([
      { type: 'CODE', version: '0.1' },
      { type: 'menu', version: '0.1' },
    ]);
  });

  it('fetches base info menus from the system endpoint', async () => {
    const menus = [{ menuId: 1, menuNm: '대시보드' }];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(menus);

    const result = await fetchBaseInfoMenus();

    expect(postSpy).toHaveBeenCalledWith('/system/menus/list');
    expect(result).toEqual(menus);
  });

  it('fetches base info common codes from the generated integrated list endpoint', async () => {
    const groups = [
      {
        groupCd: 'USE_YN',
        groupNm: '사용 여부',
        codes: [{ code: 'Y', codeNm: '사용' }],
      },
      {
        groupCd: 'RISK_GRADE',
        groupNm: '위험 등급',
        codes: [{ groupCd: 'RISK_GRADE', code: 'LOW', codeNm: '낮음' }],
      },
    ];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValueOnce(groups);

    const result = await fetchBaseInfoCommonCodes();

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/list');
    expect(result).toEqual([
      {
        groupCd: 'USE_YN',
        groupNm: '사용 여부',
        children: [{ groupCd: 'USE_YN', code: 'Y', codeNm: '사용' }],
      },
      {
        groupCd: 'RISK_GRADE',
        groupNm: '위험 등급',
        children: [{ groupCd: 'RISK_GRADE', code: 'LOW', codeNm: '낮음' }],
      },
    ]);
  });
});
