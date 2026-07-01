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
        productDesc: 'Fund product',
        useYn: 'Y',
      },
    ];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(products);

    const result = await fetchProductList();

    expect(postSpy).toHaveBeenCalledWith('/product/list', undefined);
    expect(result).toEqual(products);
  });

  it('fetches the Spring product detail endpoint and returns generated product fields', async () => {
    const product = {
      productId: 1,
      productNm: 'Fund',
      productDesc: 'Fund product',
      useYn: 'Y',
    };
    const getSpy = vi.spyOn(httpService, 'get').mockResolvedValue(product);

    const result = await fetchProduct(1);

    expect(getSpy).toHaveBeenCalledWith('/product/1');
    expect(result).toEqual(product);
  });
});
