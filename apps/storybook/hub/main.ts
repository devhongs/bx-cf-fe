import { createStorybookConfig } from '../config/create-storybook-config.ts';

export const compositionRefs = {
  shared: { title: 'Shared', url: 'http://localhost:6006' },
  pc: { title: 'PC', url: 'http://localhost:6007' },
  admin: { title: 'Admin', url: 'http://localhost:6008' },
  mobile: { title: 'Mobile', url: 'http://localhost:6009' },
};

export default {
  ...createStorybookConfig({
    stories: ['./Introduction.mdx'],
  }),
  refs: compositionRefs,
};
