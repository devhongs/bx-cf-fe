import type { Preview } from '@storybook/react-vite';

import '../../mobile-web/src/shared/styles/styles.css';

import { basePreview } from '../config/preview.tsx';

export default {
  ...basePreview,
  parameters: {
    ...basePreview.parameters,
    viewport: {
      options: {
        bxMobile: {
          name: 'BX Mobile',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
  },
  initialGlobals: {
    ...basePreview.initialGlobals,
    viewport: { value: 'bxMobile', isRotated: false },
  },
} satisfies Preview;
