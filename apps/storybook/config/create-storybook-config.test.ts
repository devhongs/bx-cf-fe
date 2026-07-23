import { describe, expect, it } from 'vitest';

import { createStorybookConfig } from './create-storybook-config';

describe('createStorybookConfig', () => {
  it('uses the React Vite framework, docs, stories, and shared public directory', () => {
    const stories = ['../stories/**/*.stories.tsx'];
    const config = createStorybookConfig({ stories, aliasRoot: '/workspace/app/src' });

    expect(config.framework).toBe('@storybook/react-vite');
    expect(config.addons).toEqual(['@storybook/addon-docs']);
    expect(config.stories).toEqual(stories);
    expect(config.staticDirs).toEqual([expect.stringMatching(/\/public$/)]);
  });

  it('merges the app alias and shared Vite behavior', async () => {
    const config = createStorybookConfig({
      stories: [],
      aliasRoot: '/workspace/app/src',
    });

    const merged = await config.viteFinal?.({}, {} as never);

    expect(merged?.define).toEqual({ 'process.env': {} });
    expect(merged?.resolve?.alias).toEqual({ '@': '/workspace/app/src' });
    expect(merged?.resolve?.dedupe).toEqual(['react', 'react-dom']);
    expect(merged?.server?.fs?.allow).toEqual([expect.stringMatching(/bx-cf-fe$/)]);
    expect(merged?.plugins).toEqual([
      expect.objectContaining({
        name: 'vite-plugin-svgr',
      }),
    ]);
  });
});
