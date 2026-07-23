import { resolve } from 'node:path';

import { createStorybookConfig } from '../config/create-storybook-config.ts';

export default {
  ...createStorybookConfig({
    stories: [
      '../stories/foundation/**/*.stories.@(ts|tsx)',
      '../../mobile-web/src/**/*.stories.@(ts|tsx)',
    ],
    aliasRoot: resolve(import.meta.dirname, '../../mobile-web/src'),
  }),
};
