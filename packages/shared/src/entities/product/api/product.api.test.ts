import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';

import { fetchProduct, fetchProductList } from './product.api';

describe('product api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the Spring product list endpoint and returns generated product fields', async () => {
    const products = [
      {
        productId: 1,
        productNm: 'Fund',
        price: 1000,
      },
    ];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(products);

    const result = await fetchProductList();

    expect(postSpy).toHaveBeenCalledWith('/product/list', undefined);
    expect(result).toEqual(products);
  });

  it('wraps product list params in the OpenAPI ApiRequest envelope', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue([]);

    await fetchProductList({
      page: 1,
      size: 20,
      keyword: 'fund',
      searchType: 'productNm',
      useYn: 'Y',
      sort: 'createdAt,desc',
      productNm: 'KB',
    });

    expect(postSpy).toHaveBeenCalledWith('/product/list', {
      pagination: { page: 1, size: 20 },
      filter: { keyword: 'fund', searchType: 'productNm', useYn: 'Y' },
      sort: { sort: 'createdAt,desc' },
      data: { productNm: 'KB' },
    });
  });

  it('fetches the Spring product detail endpoint and returns generated product fields', async () => {
    const product = {
      productId: 1,
      productNm: 'Fund',
      productDesc: 'Fund product',
      useYn: 'Y',
    };
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(product);

    const result = await fetchProduct(1);

    expect(postSpy).toHaveBeenCalledWith('/product/detail/1');
    expect(result).toEqual(product);
  });
});
