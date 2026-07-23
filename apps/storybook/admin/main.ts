import { resolve } from 'node:path';

import { createStorybookConfig } from '../config/create-storybook-config';

export default createStorybookConfig({
  stories: [
    '../stories/foundation/**/*.stories.@(ts|tsx)',
    '../../admin-portal/src/**/*.stories.@(ts|tsx)',
  ],
  aliasRoot: resolve(import.meta.dirname, '../../admin-portal/src'),
});
