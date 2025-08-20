import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs', // Updated to point to specs folder
  fullyParallel: false, // Disable parallel execution to avoid conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Use only 1 worker to avoid conflicts
  timeout: 60000, // Increase timeout to 60 seconds
  expect: {
    timeout: 10000, // Increase expect timeout
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML report
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/',
    trace: 'on-first-retry', // Collect trace on first retry
    screenshot: 'only-on-failure', // Capture screenshots on failure
    video: 'retain-on-failure', // Record video on failure
    headless: false, // Show browser by default
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: false, // Ensure browser is visible
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: false,
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: false,
      },
    },
  ],
});
