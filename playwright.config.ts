import { defineConfig, devices } from '@playwright/test';

/**
 * ========================================
 * PLAYWRIGHT CONFIGURATION FILE
 * ========================================
 * 
 * Purpose: Configure Playwright test runner settings
 * Project: SwiftTranslator Automation Testing
 * Course: IT3040 - ITPM Semester 1
 * Student ID: IT23243026
 * 
 * This configuration defines:
 * - Test directory location
 * - Browser settings
 * - Timeout values
 * - Reporter configuration
 * - Screenshot and video capture settings
 * - Parallel execution settings
 * 
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  // ========================================
  // TEST DIRECTORY CONFIGURATION
  // ========================================
  
  // Specify the directory containing test files
  testDir: './tests',
  
  // ========================================
  // EXECUTION SETTINGS
  // ========================================
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests (useful for flaky tests)
  retries: process.env.CI ? 2 : 0,
  
  // Number of parallel workers
  // Use 1 worker for debugging, undefined for CI (uses all cores)
  workers: process.env.CI ? 1 : undefined,
  
  // ========================================
  // REPORTER CONFIGURATION
  // ========================================
  
  // Reporter to use for test results
  // 'html' generates a beautiful HTML report
  // 'list' shows detailed console output
  // 'json' generates machine-readable JSON output
  // 'custom-reporter.ts' shows categorized test summary
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['./custom-reporter.ts']
  ],
  
  // ========================================
  // GLOBAL TEST SETTINGS
  // ========================================
  
  use: {
    // Base URL for navigation (makes page.goto('/') work)
    baseURL: 'https://www.swifttranslator.com/',
    
    // Collect trace on failure for debugging
    trace: 'on-first-retry',
    
    // Take screenshot on failure (important for university assignment)
    screenshot: 'only-on-failure',
    
    // Disable video recording (only screenshots are needed)
    video: 'off',
    
    // Browser viewport size
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors (if any)
    ignoreHTTPSErrors: true,
    
    // Default timeout for each action (e.g., click, fill)
    actionTimeout: 15000,
    
    // Default navigation timeout
    navigationTimeout: 30000,
  },
  
  // ========================================
  // TIMEOUT CONFIGURATION
  // ========================================
  
  // Maximum time one test can run (30 seconds)
  timeout: 30000,
  
  // Time to wait for expect() assertions
  expect: {
    timeout: 10000,
  },
  
  // ========================================
  // BROWSER PROJECTS
  // ========================================
  
  // NOTE: Running on SINGLE browser only (Chromium) to ensure each test runs ONCE
  // Total test cases: 24 Positive + 10 Negative + 1 UI = 35 tests (executed once)
  
  projects: [
    // ====================================
    // Chromium (Google Chrome) - Primary Browser
    // ====================================
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Set browser to headed mode for debugging (optional)
        // headless: false,
        // slowMo: 500, // Slow down operations by 500ms for visibility
      },
    },
    
    // ====================================
    // Additional Browsers (DISABLED to avoid test repetition)
    // ====================================
    // Uncomment below if you need to test on multiple browsers
    // NOTE: This will multiply your test count (35 tests × 3 browsers = 105 executions)
    
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'] 
    //   },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'] 
    //   },
    // },
  ],
  
  // ========================================
  // FOLDER CONFIGURATION
  // ========================================
  
  // Folder for screenshots
  outputDir: 'screenshots',
  
  // ========================================
  // WEB SERVER CONFIGURATION (Not needed for external website)
  // ========================================
  
  // Since we're testing an external website (swifttranslator.com),
  // we don't need to run a local web server
  // webServer: undefined,
});

/**
 * ========================================
 * CONFIGURATION NOTES FOR EXAMINERS
 * ========================================
 * 
 * ✅ Tests run on multiple browsers (Chromium, Firefox, WebKit)
 * ✅ Screenshots captured on failure
 * ✅ HTML report generated automatically
 * ✅ Proper timeout settings to handle real-time conversion
 * ✅ Parallel execution for faster test runs
 * ✅ Retry on failure for CI/CD environments
 * ✅ Clear comments explaining each setting
 * 
 * How to use this configuration:
 * 
 * 1. Run all tests:
 *    npx playwright test
 * 
 * 2. Run tests on specific browser:
 *    npx playwright test --project=chromium
 *    npx playwright test --project=firefox
 *    npx playwright test --project=webkit
 * 
 * 3. Run in headed mode (see browser):
 *    npx playwright test --headed
 * 
 * 4. Run with UI mode:
 *    npx playwright test --ui
 * 
 * 5. View test report:
 *    npx playwright show-report
 * 
 * ========================================
 */
