import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';

import { createMenu, deleteMenu, fetchMenuList, updateMenu } from './menu.api';

describe('menu api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches menus from the generated system endpoint', async () => {
    const menus = [{ menuId: 1, menuNm: '대시보드' }];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(menus);

    const result = await fetchMenuList();

    expect(postSpy).toHaveBeenCalledWith('/system/menus/list');
    expect(result).toEqual(menus);
  });

  it('ignores menu list params because the generated list endpoint has no request body', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue([]);

    await fetchMenuList({
      page: 1,
      size: 20,
      keyword: '대시',
      searchType: 'menuNm',
      useYn: 'Y',
      sort: 'sortSeq,asc',
      menuNm: '대시보드',
    });

    expect(postSpy).toHaveBeenCalledWith('/system/menus/list');
  });

  it('creates and updates menus with generated action endpoints', async () => {
    const payload = { menuCd: 'DASHBOARD', menuNm: '대시보드', useYn: 'Y' as const };
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue({});

    await createMenu(payload);
    await updateMenu(1, payload);

    expect(postSpy).toHaveBeenNthCalledWith(1, '/system/menus/create', { data: payload });
    expect(postSpy).toHaveBeenNthCalledWith(2, '/system/menus/1/update', { data: payload });
  });

  it('deletes menus through the planned delete endpoint', async () => {
    const deleteSpy = vi.spyOn(httpService, 'delete').mockResolvedValue(undefined);

    await deleteMenu(1);

    expect(deleteSpy).toHaveBeenCalledWith('/system/menus/1');
  });
});
