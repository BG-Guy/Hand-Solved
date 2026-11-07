// playwright.config.ts: end-to-end tests for the built site. It points at the preview server that is already running on 4321 (real CSP, real 404) and never starts one.
// Start that server yourself first: `npm run build && npm run preview`. Stop it with `npx astro preview stop`.
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4321';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  // Every test builds its own browser context, so tests share nothing and can run side by side.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 60_000,
  expect: { timeout: 8_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    // The site is static and local: a slow answer is a real problem, not a reason to wait longer.
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    // Pixel 5 is 393 x 727 with touch and a 2.75 pixel ratio.
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    // WebKit with iPhone 14 metrics (390 x 664). It is the desktop WebKit engine in a phone-shaped window, not iOS.
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } },
  ],
});
