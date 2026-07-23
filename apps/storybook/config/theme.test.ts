import { describe, expect, it, vi } from 'vitest';

import { applyStorybookTheme } from './theme';

describe('applyStorybookTheme', () => {
  it('adds the dark class only for the dark theme', () => {
    const toggle = vi.fn();
    const root = { classList: { toggle } };

    applyStorybookTheme(root, 'dark');
    expect(toggle).toHaveBeenCalledWith('dark', true);

    applyStorybookTheme(root, 'light');
    expect(toggle).toHaveBeenLastCalledWith('dark', false);
  });
});
