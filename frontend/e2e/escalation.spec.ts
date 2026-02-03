import { test, expect } from '@playwright/test';

test('escalation blocks approval', async ({ page }) => {
  // Assume escalation case
  await page.goto('/cases/escalation-case');
  await expect(page.locator('text=Escalation Required')).toBeVisible();
  await expect(page.locator('button:has-text("Approve Outreach")')).toBeDisabled();
});