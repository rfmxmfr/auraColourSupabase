
import { test, expect } from '@playwright/test';

test('should navigate to the home page', async ({ page }) => {
  // Start from the index page (the baseURL is set in the config)
  await page.goto('/');
  // The new page should have an h1 with "Discover Your Perfect Colors"
  await expect(page.locator('h1')).toContainText('Discover Your Perfect Colors');
});

test('full user and admin flow', async ({ page }) => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const password = 'password123';

  // --- User Journey ---

  // 1. Sign up
  await page.goto('/signup');
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/login');
  
  // 2. Log in
  await page.goto('/login'); // Go to login page after signup
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/questionnaire'); // New users are now directed to the questionnaire
  
  // 3. Navigate to questionnaire and fill it out
  // Step 1: Style
  await page.click('label:has-text("Chic")');
  await page.click('button:has-text("Next")');
  
  // Step 2: Colors
  await page.click('label:has-text("Reds/Pinks")');
  await page.click('label:has-text("Neutrals (Black, White, Gray)")');
  await page.click('button:has-text("Next")');

  // Step 3: Photo Upload
  const imagePath = 'public/tania-hernando-crespo.jpeg'; 
  await page.setInputFiles('input[type="file"]', imagePath);
  await expect(page.locator('img[alt="Photo preview"]')).toBeVisible();
  await page.click('button:has-text("Next")');

  // Step 4: Review and Submit (Bypass payment)
  await expect(page.locator('h3:has-text("Your Style:") + p')).toContainText('Chic');
  
  // This is where we would normally go to Stripe.
  // The submission will be in 'pending_payment'. We'll log in as admin and handle it.

  // --- Admin Journey ---

  // 5. Log out as user and log in as admin
  await page.goto('/login');
  await page.fill('input[name="email"]', 'rmonteiro@gmx.co.uk'); // Use pre-defined admin email
  await page.fill('input[name="password"]', '123456');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/admin/kanban');

  // 6. Find the new submission in the "Paid & Pending" column
  // For the test, we'll manually update its status to 'paid' to simulate a successful webhook.
  const submissionCard = page.locator('[data-testid^="submission-card-"]', { hasText: 'Style: Chic' });
  await expect(submissionCard).toBeVisible({ timeout: 15000 });

  // Manually move to 'Paid' to simulate webhook
  await submissionCard.locator('button[aria-label="More options"]').click();
  await page.click('div[role="menuitem"]:has-text("Move to Paid & Pending")');

  // Now find it again in the paid column
  const paidColumn = page.locator('.bg-yellow-500:has-text("Paid & Pending")');
  const paidCard = paidColumn.locator('[data-testid^="submission-card-"]', { hasText: 'Style: Chic' });
  await expect(paidCard).toBeVisible({ timeout: 10000 });
  
  // 7. Generate the report
  await paidCard.locator('button:has-text("Generate Report")').click();
  
  // 8. Verify it moves to "In Progress" then "Completed"
  await expect(paidCard.locator('button:has-text("Generating...")')).toBeVisible({ timeout: 10000 });
  
  // The report generation can take a while.
  const completedColumn = page.locator('.bg-green-500:has-text("Completed")');
  const completedCard = completedColumn.locator('[data-testid^="submission-card-"]');
  
  // Wait up to 60s for generation and check if it's in the completed column
  await expect(completedCard).toBeVisible({ timeout: 60000 }); 
  
  // 9. Check the send email link
  const sendButton = completedCard.locator('button:has-text("Send")');
  await expect(sendButton).toBeEnabled();

  // 10. Check the view report link
  const viewButton = completedCard.locator('a:has-text("View")');
  await expect(viewButton).toHaveAttribute('href', /^\/report\//);
});
