import { describe, expect, it } from 'vitest';

import { buildServiceOutputs } from './gen-api.mjs';

const authDoc = {
  openapi: '3.0.1',
  info: { title: 'Auth Service API', version: '1.0.0' },
  servers: [{ url: '/channel/backend/api/v1/auth' }],
  paths: {
    '/login': {
      post: {
        operationId: 'login',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': { schema: { $ref: '#/components/schemas/ApiResponseAuthResponse' } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      AuthResponse: {
        type: 'object',
        properties: {
          usrId: { type: 'string' },
        },
      },
    },
  },
};

const productDoc = {
  openapi: '3.0.1',
  info: { title: 'Product Service API', version: '1.0.0' },
  servers: [{ url: '/channel/backend/api/v1/product' }],
  paths: {
    '/list': {
      get: {
        operationId: 'getProductList',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    payload: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ProductDto' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ProductDto: {
        type: 'object',
        properties: {
          productNm: { type: 'string' },
        },
      },
    },
  },
};

describe('gen-api multi-service output', () => {
  it('generates a namespace-wrapped schema file for each service and an api barrel', async () => {
    const outputs = await buildServiceOutputs([
      { name: 'auth', doc: authDoc },
      { name: 'product', doc: productDoc },
    ]);

    expect(outputs.files.map((file) => file.path)).toEqual([
      'auth.schema.d.ts',
      'product.schema.d.ts',
      'routes.json',
      'index.ts',
    ]);

    const auth = outputs.files.find((file) => file.path === 'auth.schema.d.ts')?.content ?? '';
    expect(auth).toContain('export namespace auth');
    expect(auth).toContain('ApiResponseAuthResponse');
    expect(auth).toContain('payload?: components["schemas"]["AuthResponse"]');

    const product =
      outputs.files.find((file) => file.path === 'product.schema.d.ts')?.content ?? '';
    expect(product).toContain('export namespace product');
    expect(product).toContain('ProductDto');
    expect(product).toContain('payload?: components["schemas"]["ProductDto"][]');

    const index = outputs.files.find((file) => file.path === 'index.ts')?.content ?? '';
    expect(index).toContain("export type { auth } from './auth.schema';");
    expect(index).toContain("export type { product } from './product.schema';");

    const routes = JSON.parse(
      outputs.files.find((file) => file.path === 'routes.json')?.content ?? '{}',
    );
    expect(routes.services).toEqual([
      { name: 'auth', serverUrl: '/channel/backend/api/v1/auth' },
      { name: 'product', serverUrl: '/channel/backend/api/v1/product' },
    ]);
  });
});
