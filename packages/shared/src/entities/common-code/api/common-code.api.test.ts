import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';

import {
  createCommonCode,
  createCommonCodeGroup,
  deleteCommonCode,
  deleteCommonCodeGroup,
  fetchCommonCodeGroup,
  fetchCommonCodeGroups,
  fetchCommonCodes,
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

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/groups/detail', {
      data: { groupCd: 'USE_YN' },
    });
    expect(result).toEqual(group);
  });

  it('creates and updates common code groups with generated action endpoints', async () => {
    const payload = { groupCd: 'USE_YN', groupNm: '사용 여부', useYn: 'Y' as const };
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue({});

    await createCommonCodeGroup(payload);
    await updateCommonCodeGroup('USE_YN', payload);

    expect(postSpy).toHaveBeenNthCalledWith(1, '/system/common-codes/groups/create', {
      data: payload,
    });
    expect(postSpy).toHaveBeenNthCalledWith(2, '/system/common-codes/groups/USE_YN/update', {
      data: payload,
    });
  });

  it('deletes common code groups through the planned delete endpoint', async () => {
    const deleteSpy = vi.spyOn(httpService, 'delete').mockResolvedValue(undefined);

    await deleteCommonCodeGroup('USE_YN');

    expect(deleteSpy).toHaveBeenCalledWith('/system/common-codes/groups/USE_YN');
  });

  it('fetches and mutates common codes under a group', async () => {
    const payload = { groupCd: 'USE_YN', code: 'Y', codeNm: '사용', useYn: 'Y' as const };
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue([]);

    await fetchCommonCodes('USE_YN');
    await createCommonCode('USE_YN', payload);
    await updateCommonCode('USE_YN', 'Y', payload);

    expect(postSpy).toHaveBeenNthCalledWith(1, '/system/common-codes/groups/USE_YN/codes/list');
    expect(postSpy).toHaveBeenNthCalledWith(2, '/system/common-codes/groups/USE_YN/codes/create', {
      data: payload,
    });
    expect(postSpy).toHaveBeenNthCalledWith(
      3,
      '/system/common-codes/groups/USE_YN/codes/Y/update',
      { data: payload },
    );
  });

  it('deletes common codes through the planned delete endpoint', async () => {
    const deleteSpy = vi.spyOn(httpService, 'delete').mockResolvedValue(undefined);

    await deleteCommonCode('USE_YN', 'Y');

    expect(deleteSpy).toHaveBeenCalledWith('/system/common-codes/groups/USE_YN/codes/Y');
  });
});
