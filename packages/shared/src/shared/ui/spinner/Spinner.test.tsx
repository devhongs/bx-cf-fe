// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('exposes an accessible loading status', () => {
    render(<Spinner />);

    const spinner = screen.getByRole('status', { name: '로딩 중' });

    expect(spinner.getAttribute('data-slot')).toBe('spinner');
  });
});
