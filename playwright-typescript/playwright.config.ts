// Playwright config at project root
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/specs',
  // Run cleanup only after ALL tests complete
  globalTeardown: './tests/global-teardown.ts',
  // Add hooks for per-test cleanup
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/',
    trace: 'on-first-retry',
    screenshot: 'on', // Always capture screenshots
    video: 'on',      // Always record video
    headless: false,  // Show browser by default
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'always' }], // HTML report opens automatically
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://opensource-demo.orangehrmlive.com/',
        trace: 'on-first-retry',
        screenshot: 'on',
        video: 'on',
        headless: false,
      },
    },
    // Only Chromium is enabled by default
  ],
});
