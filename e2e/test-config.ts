import { defineConfig, devices } from '@playwright/test';

// Use the existing server
const baseURL = 'http://localhost:9876';

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  forbidOnly: false,
  retries: 2,  // Add retries to handle flakiness
  workers: 1,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on',  // Always capture traces for debugging
    headless: false,
    // Add longer timeouts
    navigationTimeout: 30000,
    actionTimeout: 15000,
    // Take screenshots on failure
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Don't start a new server
  webServer: undefined,
});