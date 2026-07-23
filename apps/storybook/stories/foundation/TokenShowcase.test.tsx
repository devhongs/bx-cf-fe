import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { TokenShowcase, tokenNames } from './TokenShowcase';

describe('TokenShowcase', () => {
  it('renders every semantic token used by the POC', () => {
    const markup = renderToStaticMarkup(<TokenShowcase />);

    for (const token of tokenNames) {
      expect(markup).toContain(token);
    }
  });
});
