import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';

import { menuListQuery, menuQueryKeys } from './menu.queries';

describe('menu query keys', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the entity query key object pattern', () => {
    expect(menuQueryKeys.all).toEqual(['menu']);
    expect(menuQueryKeys.lists()).toEqual(['menu', 'list']);
    expect(menuQueryKeys.list({ useYn: 'Y' })).toEqual(['menu', 'list', { useYn: 'Y' }]);
    expect(menuQueryKeys.detail(1)).toEqual(['menu', 'detail', 1]);
  });

  it('creates list query options from the key object pattern', () => {
    expect(menuListQuery({ keyword: '대시보드' })).toMatchObject({
      queryKey: ['menu', 'list', { keyword: '대시보드' }],
    });
  });

  it('passes loading options from query options to the HTTP request', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue([]);
    const options = menuListQuery({ keyword: '대시보드' }, { showSpinner: false });

    await options.queryFn?.({} as never);

    expect(postSpy).toHaveBeenCalledWith('/system/menus/list', undefined, {
      showSpinner: false,
    });
  });
});
