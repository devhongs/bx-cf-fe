import type { Preview } from '@storybook/react-vite';

import { applyStorybookTheme } from './theme';

export const basePreview = {
  globalTypes: {
    theme: {
      description: 'Canvas color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      applyStorybookTheme(document.documentElement, context.globals.theme);
      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    htmlLang: 'ko',
  },
} satisfies Preview;
