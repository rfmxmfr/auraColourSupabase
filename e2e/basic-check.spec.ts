import { test, expect } from '@playwright/test';

test('basic navigation test', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Verify the page loaded
  await expect(page).toHaveTitle(/Aura/);
  
  // Navigate to the questionnaire page
  await page.goto('/questionnaire');
  
  // Verify the page loads without requiring login
  await expect(page).not.toHaveURL('/login');
  
  // Basic check that we're on the questionnaire page
  await expect(page.locator('body')).toContainText('Style');
});