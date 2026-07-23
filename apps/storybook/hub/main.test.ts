import { describe, expect, it } from 'vitest';

import { compositionRefs } from './main.ts';

describe('compositionRefs', () => {
  it('maps each catalog to its local Storybook', () => {
    expect(compositionRefs).toEqual({
      shared: { title: 'Shared', url: 'http://localhost:6006' },
      pc: { title: 'PC', url: 'http://localhost:6007' },
      admin: { title: 'Admin', url: 'http://localhost:6008' },
      mobile: { title: 'Mobile', url: 'http://localhost:6009' },
    });
  });
});
