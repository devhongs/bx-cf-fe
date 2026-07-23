import { createStorybookConfig } from '../config/create-storybook-config.ts';

export default {
  ...createStorybookConfig({
    stories: [
      '../stories/foundation/**/*.stories.@(ts|tsx)',
      '../../../packages/shared/src/**/*.stories.@(ts|tsx)',
    ],
  }),
};
