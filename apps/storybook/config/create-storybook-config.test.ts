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
});
