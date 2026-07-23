import { resolve } from 'node:path';

import { createStorybookConfig } from '../config/create-storybook-config';

export default createStorybookConfig({
  stories: [
    '../stories/foundation/**/*.stories.@(ts|tsx)',
    '../../pc-web/src/**/*.stories.@(ts|tsx)',
  ],
  aliasRoot: resolve(import.meta.dirname, '../../pc-web/src'),
});
