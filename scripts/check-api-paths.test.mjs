import { describe, expect, it } from 'vitest';

import {
  checkApiReferences,
  deriveServicePrefixes,
  extractHttpServiceReferences,
  parseSchemaPaths,
} from './check-api-paths.mjs';

const productSchema = `
export namespace product {
  export interface paths {
    '/list': {
      get?: never;
      post: operations['getProductList'];
    };
    '/detail/{productId}': {
      get?: never;
      post: operations['getProduct'];
    };
  }
}
`;

describe('check-api-paths', () => {
  it('extracts httpService method calls with static and template URL arguments', () => {
    const refs = extractHttpServiceReferences(
      `
      httpService.post<Array<Product>>('/product/list', params);
      httpService.post<Product>(\`/product/detail/\${id}\`);
      httpService.delete<void>(\`/products/\${id}\`);
      `,
      'packages/shared/src/entities/product/api/product.api.ts',
    );

    expect(refs).toEqual([
      expect.objectContaining({ method: 'post', rawPath: '/product/list' }),
      expect.objectContaining({ method: 'post', rawPath: '/product/detail/${id}' }),
      expect.objectContaining({ method: 'delete', rawPath: '/products/${id}' }),
    ]);
  });

  it('parses callable OpenAPI paths and methods from generated schema text', () => {
    expect(parseSchemaPaths(productSchema)).toEqual([
      { path: '/list', methods: new Set(['post']) },
      { path: '/detail/{productId}', methods: new Set(['post']) },
    ]);
  });

  it('derives source prefixes from OpenAPI server URLs', () => {
    expect(
      deriveServicePrefixes([
        { name: 'auth', serverUrl: '/channel/backend/api/v1/auth' },
        { name: 'product', serverUrl: '/channel/backend/api/v1/product' },
        { name: 'system', serverUrl: '/channel/backend/api/v1/system' },
      ]),
    ).toEqual([
      { name: 'auth', serverUrl: '/channel/backend/api/v1/auth', sourcePrefix: '/auth' },
      { name: 'product', serverUrl: '/channel/backend/api/v1/product', sourcePrefix: '/product' },
      { name: 'system', serverUrl: '/channel/backend/api/v1/system', sourcePrefix: '/system' },
    ]);
  });

  it('reports missing paths while accepting source paths built from OpenAPI server URLs', () => {
    const result = checkApiReferences({
      services: [
        {
          name: 'product',
          sourcePrefix: '/product',
          schemaPaths: parseSchemaPaths(productSchema),
        },
      ],
      references: [
        { method: 'post', rawPath: '/product/list', file: 'product.api.ts', line: 1 },
        { method: 'post', rawPath: '/product/detail/${id}', file: 'product.api.ts', line: 2 },
        { method: 'post', rawPath: '/list', file: 'product.api.ts', line: 3 },
        { method: 'post', rawPath: '/product/missing', file: 'product.api.ts', line: 3 },
      ],
      allowlist: [],
    });

    expect(result.matched).toHaveLength(2);
    expect(result.missing).toEqual([
      expect.objectContaining({ rawPath: '/list' }),
      expect.objectContaining({ rawPath: '/product/missing', normalizedPath: '/missing' }),
    ]);
  });

  it('allows endpoints that are intentionally used before backend OpenAPI is ready', () => {
    const result = checkApiReferences({
      services: [
        {
          name: 'system',
          sourcePrefix: '/system',
          schemaPaths: [],
        },
      ],
      references: [
        {
          method: 'delete',
          rawPath: '/system/common-codes/groups/${encodeURIComponent(groupCd)}',
          file: 'common-code.api.ts',
          line: 1,
        },
        {
          method: 'delete',
          rawPath:
            '/system/common-codes/groups/${encodeURIComponent(groupCd)}/codes/${encodeURIComponent(code)}',
          file: 'common-code.api.ts',
          line: 2,
        },
        {
          method: 'delete',
          rawPath: '/system/menus/${encodeURIComponent(menuId)}',
          file: 'menu.api.ts',
          line: 3,
        },
        { method: 'post', rawPath: '/users/list', file: 'user.api.ts', line: 4 },
        {
          method: 'post',
          rawPath: '/users/detail/${encodeURIComponent(usrId)}',
          file: 'user.api.ts',
          line: 5,
        },
        { method: 'post', rawPath: '/users/create', file: 'user.api.ts', line: 6 },
        {
          method: 'post',
          rawPath: '/users/${encodeURIComponent(usrId)}/update',
          file: 'user.api.ts',
          line: 7,
        },
        {
          method: 'delete',
          rawPath: '/users/${encodeURIComponent(usrId)}',
          file: 'user.api.ts',
          line: 8,
        },
      ],
    });

    expect(result.allowed).toHaveLength(8);
    expect(result.missing).toHaveLength(0);
  });
});
