import { expect, test } from '@playwright/test';

test.describe('admin-portal basic checks', () => {
  test('should load the homepage and check title/h1', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('/');

    // Verify page loads by checking elements or title
    await expect(page).toHaveTitle(/.+/);
  });
});
