import { expect, test } from '@playwright/test';

test.describe('admin-portal basic checks', () => {
  test('loads the admin login entrypoint', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/.+/);
    await expect(page.getByRole('heading', { name: '관리자 로그인' })).toBeVisible();
  });
});
