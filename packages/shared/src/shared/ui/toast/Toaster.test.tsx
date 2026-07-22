// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { afterEach, describe, expect, it } from 'vitest';

import { Toaster } from './Toaster';
import styles from './Toaster.module.css';

afterEach(cleanup);

describe('Toaster', () => {
  it('renders the Sonner toaster region', () => {
    render(<Toaster />);

    expect(screen.getByLabelText('Notifications alt+T')).not.toBeNull();
  });

  it('uses bottom-center as the default position', async () => {
    render(<Toaster />);
    toast('Position check');

    const toaster = (await screen.findByText('Position check')).closest('[data-sonner-toaster]');

    expect(toaster?.getAttribute('data-y-position')).toBe('bottom');
    expect(toaster?.getAttribute('data-x-position')).toBe('center');
  });

  it('keeps rich status backgrounds off so status colour stays on the icon', async () => {
    render(<Toaster />);
    toast.success('Theme check');

    const toastItem = (await screen.findByText('Theme check')).closest('[data-sonner-toast]');

    expect(toastItem?.getAttribute('data-rich-colors')).not.toBe('true');
  });

  it('applies the theme-token CSS Module to the toast surface', async () => {
    render(<Toaster />);
    toast('Token check');

    const toaster = (await screen.findByText('Token check')).closest('[data-sonner-toaster]');

    expect(toaster?.className).toContain(styles.toaster);
  });

  it('does not pin a theme, so the host app decides light or dark', async () => {
    render(<Toaster />);
    toast('Theme freedom check');

    const toaster = (await screen.findByText('Theme freedom check')).closest(
      '[data-sonner-toaster]',
    );

    expect(toaster?.getAttribute('data-sonner-theme')).not.toBe('dark');
  });

  it('applies compact styles to action and close buttons', async () => {
    render(<Toaster />);
    toast('Action check', {
      action: { label: 'Undo', onClick: () => undefined },
    });

    const actionButton = await screen.findByRole('button', { name: 'Undo' });
    const closeButton = screen.getByRole('button', { name: 'Close toast' });

    expect(actionButton.className).toContain('actionButton');
    expect(closeButton.className).toContain('closeButton');
  });
});
