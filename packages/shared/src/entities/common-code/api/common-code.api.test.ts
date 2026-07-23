import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';

import {
  createCommonCode,
  createCommonCodeGroup,
  deleteCommonCode,
  deleteCommonCodeGroup,
  fetchCommonCodeGroup,
  fetchCommonCodeGroups,
  replaceCommonCodes,
  updateCommonCode,
  updateCommonCodeGroup,
} from './common-code.api';

describe('common code api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches common code groups from the generated system endpoint', async () => {
    const groups = [{ groupCd: 'USE_YN', groupNm: '사용 여부' }];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(groups);

    const result = await fetchCommonCodeGroups();

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/groups/list');
    expect(result).toEqual(groups);
  });

  it('ignores group list params because the generated list endpoint has no request body', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue([]);

    await fetchCommonCodeGroups({
      page: 1,
      size: 20,
      keyword: '사용',
      searchType: 'groupNm',
      useYn: 'Y',
      sort: 'sortSeq,asc',
      groupCd: 'USE_YN',
    });

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/groups/list');
  });

  it('fetches a common code group detail through the generated detail endpoint', async () => {
    const group = [
      {
        groupCd: 'USE_YN',
        groupNm: '사용 여부',
        codes: [
          { groupCd: 'USE_YN', code: 'Y', codeNm: '사용' },
          { groupCd: 'USE_YN', code: 'N', codeNm: '미사용' },
        ],
      },
    ];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(group);

    const result = await fetchCommonCodeGroup('USE_YN');

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/USE_YN/detail');
    expect(result).toEqual(group);
  });

  it('creates common code groups with the generated integrated create endpoint', async () => {
    const payload = { groupCd: 'USE_YN', groupNm: '사용 여부', useYn: 'Y' as const };
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue({});

    await createCommonCodeGroup(payload);

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/create', {
      data: { ...payload, codes: [] },
    });
  });

  it('updates common code groups through the generated replace endpoint', async () => {
    const postSpy = vi
      .spyOn(httpService, 'post')
      .mockResolvedValueOnce([{ groupCd: 'USE_YN', groupNm: '사용 여부', codes: [] }])
      .mockResolvedValueOnce(undefined);

    await updateCommonCodeGroup('USE_YN', { groupNm: '사용 여부 변경', useYn: 'Y' });

    expect(postSpy).toHaveBeenNthCalledWith(1, '/system/common-codes/USE_YN/detail');
    expect(postSpy).toHaveBeenNthCalledWith(2, '/system/common-codes/USE_YN/replace', {
      data: {
        groupNm: '사용 여부 변경',
        groupDesc: undefined,
        systemYn: undefined,
        useYn: 'Y',
        sortSeq: undefined,
        codes: [],
      },
    });
  });

  it('deletes common code groups through the generated delete endpoint', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(undefined);

    await deleteCommonCodeGroup('USE_YN');

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/USE_YN/delete');
  });

  it('replaces common code groups and codes through the generated replace endpoint', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(undefined);
    const payload = {
      groupNm: '사용 여부',
      useYn: 'Y' as const,
      codes: [{ code: 'Y', codeNm: '사용', sortSeq: 1, useYn: 'Y' as const }],
    };

    await replaceCommonCodes('USE_YN', payload);

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/USE_YN/replace', {
      data: payload,
    });
  });

  it('mutates common codes through group detail and replace endpoints', async () => {
    const payload = { groupCd: 'USE_YN', code: 'Y', codeNm: '사용', useYn: 'Y' as const };
    const postSpy = vi
      .spyOn(httpService, 'post')
      .mockResolvedValueOnce([{ groupCd: 'USE_YN', groupNm: '사용 여부', codes: [] }])
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce([
        { groupCd: 'USE_YN', groupNm: '사용 여부', codes: [{ code: 'Y', codeNm: '사용' }] },
      ])
      .mockResolvedValueOnce(undefined);

    await createCommonCode('USE_YN', payload);
    await updateCommonCode('USE_YN', 'Y', payload);

    expect(postSpy).toHaveBeenNthCalledWith(1, '/system/common-codes/USE_YN/detail');
    expect(postSpy).toHaveBeenNthCalledWith(2, '/system/common-codes/USE_YN/replace', {
      data: {
        groupNm: '사용 여부',
        groupDesc: undefined,
        systemYn: undefined,
        useYn: undefined,
        sortSeq: undefined,
        codes: [payload],
      },
    });
    expect(postSpy).toHaveBeenNthCalledWith(3, '/system/common-codes/USE_YN/detail');
    expect(postSpy).toHaveBeenNthCalledWith(4, '/system/common-codes/USE_YN/replace', {
      data: {
        groupNm: '사용 여부',
        groupDesc: undefined,
        systemYn: undefined,
        useYn: undefined,
        sortSeq: undefined,
        codes: [payload],
      },
    });
  });

  it('deletes common codes through the generated replace endpoint', async () => {
    const postSpy = vi
      .spyOn(httpService, 'post')
      .mockResolvedValueOnce([
        { groupCd: 'USE_YN', groupNm: '사용 여부', codes: [{ code: 'Y', codeNm: '사용' }] },
      ])
      .mockResolvedValueOnce(undefined);

    await deleteCommonCode('USE_YN', 'Y');

    expect(postSpy).toHaveBeenNthCalledWith(1, '/system/common-codes/USE_YN/detail');
    expect(postSpy).toHaveBeenNthCalledWith(2, '/system/common-codes/USE_YN/replace', {
      data: {
        groupNm: '사용 여부',
        groupDesc: undefined,
        systemYn: undefined,
        useYn: undefined,
        sortSeq: undefined,
        codes: [],
      },
    });
  });
});
