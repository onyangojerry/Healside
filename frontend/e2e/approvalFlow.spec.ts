import { test, expect } from '@playwright/test';

test('clinician approval flow', async ({ page }) => {
  // Assume seeded data or mock
  await page.goto('/login');
  await page.fill('input[name="username"]', 'clinician');
  await page.fill('input[name="password"]', 'test');
  await page.click('button[type="submit"]');
  await page.goto('/cases/case-1');
  await page.click('button:has-text("Approve")');
  await page.click('button:has-text("Confirm")');
  await expect(page.locator('text=Approved')).toBeVisible();
});