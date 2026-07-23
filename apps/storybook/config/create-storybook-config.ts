import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

interface StorybookProfileOptions {
  stories: StorybookConfig['stories'];
  aliasRoot?: string;
}

export function createStorybookConfig({
  stories,
  aliasRoot,
}: StorybookProfileOptions): StorybookConfig {
  return {
    framework: '@storybook/react-vite',
    addons: ['@storybook/addon-docs'],
    stories,
    staticDirs: [resolve(repositoryRoot, 'public')],
    async viteFinal(config) {
      return mergeConfig(config, {
        define: {
          'process.env': {},
        },
        plugins: [svgr()],
        resolve: {
          alias: aliasRoot ? { '@': aliasRoot } : {},
          dedupe: ['react', 'react-dom'],
        },
        server: {
          fs: {
            allow: [repositoryRoot],
          },
        },
      });
    },
  };
}
