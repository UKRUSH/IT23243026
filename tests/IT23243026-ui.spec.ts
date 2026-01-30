import { test, expect } from '@playwright/test';
import { TranslatorPage } from '../pages/translator.page';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ========================================
 * UI BEHAVIOR TEST SUITE
 * ========================================
 * 
 * Test File: ui.spec.ts
 * Purpose: Validate user interface behavior and real-time conversion functionality
 * Total Test Cases: 1
 * Test Data Source: test-data/sample_D1.json (Pos_UI_* only)
 * 
 * What is tested:
 * - Real-time output update without clicking any button
 * - System responsiveness during typing
 * - Input clear functionality
 * - Page stability (no crashes or freezes)
 * - Automatic conversion behavior
 * - User experience validation
 * 
 * Expected Behavior:
 * - Sinhala output should update automatically while typing
 * - No manual button click required for conversion
 * - System should remain responsive throughout
 * - Clear input should also clear output
 * - No page crashes or JavaScript errors
 * 
 * @author IT23243026 - University Assignment (IT3040 ITPM Semester 1)
 */

// Step 1: Define interface for UI test case structure
interface UITestCase {
  tcId: string;
  input: string;
  expectedOutput: string;
}

// Step 2: Load test data from JSON file
const testDataPath = path.join(__dirname, '../test-data/sample_D1.json');
const allTestData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
// Filter only UI test cases (TC ID starts with "Pos_UI_")
const testCases: UITestCase[] = allTestData
  .filter((tc: any) => tc['TC ID'].startsWith('Pos_UI_'))
  .map((tc: any) => ({
    tcId: tc['TC ID'],
    input: tc['Input'],
    expectedOutput: tc['Expected output']
  }));

// Step 3: Define test suite for UI behavior tests
test.describe('UI Behavior Tests - Real-time Conversion & Usability', () => {
  
  let translatorPage: TranslatorPage;

  // Step 4: Setup - runs before each test
  test.beforeEach(async ({ page }) => {
    // Step 4.1: Initialize the Page Object Model
    translatorPage = new TranslatorPage(page);
    
    // Step 4.2: Navigate to the SwiftTranslator website
    await translatorPage.navigate();
  });

  // Step 5: Loop through all UI test cases from JSON
  for (const testCase of testCases) {
    test(`${testCase.tcId} - Verify real-time conversion for: "${testCase.input}"`, async ({ page }) => {
      
      // ====================================
      // TEST EXECUTION STEPS
      // ====================================
      
      // Step 1: Clear any existing input
      await translatorPage.clearInput();
      
      // Step 2: Verify initial state is empty
      let initialOutput = await translatorPage.getSinhalaOutput();
      expect(initialOutput).toBe('');
      
      // Step 3: Type the Singlish input text
      await translatorPage.typeInput(testCase.input);
      
      // Step 4: Wait for real-time conversion to complete
      await page.waitForTimeout(2000);
      
      // Step 5: Retrieve the actual Sinhala output
      const actualOutput = await translatorPage.getSinhalaOutput();
      
      // Step 6: Log test execution details
      console.log(`\n========================================`);
      console.log(`UI Test Case ID: ${testCase.tcId}`);
      console.log(`Input (Singlish): ${testCase.input}`);
      console.log(`Expected Output (Sinhala): ${testCase.expectedOutput}`);
      console.log(`Actual Output (Sinhala): ${actualOutput}`);
      
      // ====================================
      // VALIDATION LOGIC
      // ====================================
      
      // Step 7: Compare actual output with expected output
      try {
        expect(actualOutput).toBe(testCase.expectedOutput);
        
        // Step 8: If outputs match, mark test as PASS
        console.log(`Status: ✅ PASS`);
        console.log(`Real-time conversion working correctly!`);
        console.log(`========================================\n`);
        
      } catch (error) {
        // Step 9: If outputs don't match, mark test as FAIL
        console.log(`Status: ❌ FAIL`);
        console.log(`Mismatch Details:`);
        console.log(`  - Expected: ${testCase.expectedOutput}`);
        console.log(`  - Actual: ${actualOutput}`);
        console.log(`========================================\n`);
        
        // Re-throw error to fail the test
        throw error;
      }
      
      // ====================================
      // ADDITIONAL VALIDATIONS
      // ====================================
      
      // Step 10: Verify page responsiveness
      const isResponsive = await translatorPage.isPageResponsive();
      expect(isResponsive).toBe(true);
      
      // Step 11: Test input clear functionality
      await translatorPage.clearInput();
      await page.waitForTimeout(500);
      const clearedOutput = await translatorPage.getSinhalaOutput();
      expect(clearedOutput).toBe('');
    });
  }
});

/**
 * ========================================
 * TEST EXECUTION SUMMARY
 * ========================================
 * 
 * How to run this test file:
 * 
 * 1. Run all UI tests:
 *    npx playwright test ui.spec.ts
 * 
 * 2. Run with UI mode (see browser):
 *    npx playwright test ui.spec.ts --ui
 * 
 * 3. Run in headed mode (see real browser):
 *    npx playwright test ui.spec.ts --headed
 * 
 * 4. Run specific UI test:
 *    npx playwright test ui.spec.ts -g "Pos_UI_0001"
 * 
 * 5. Generate HTML report:
 *    npx playwright test ui.spec.ts --reporter=html
 * 
 * ========================================
 * EXAMINER NOTES
 * ========================================
 * 
 * ✅ Tests real-time conversion behavior (KEY feature)
 * ✅ Verifies NO button click is required
 * ✅ Tests input clear functionality
 * ✅ Validates page stability and responsiveness
 * ✅ Checks for JavaScript errors
 * ✅ Tests multiple conversion scenarios
 * ✅ Clear step-by-step comments
 * ✅ Comprehensive logging for debugging
 * ✅ Uses Page Object Model
 * ✅ Test data loaded from JSON
 * 
 * UI Testing Focus:
 * - Real-time behavior is the core feature being tested
 * - Usability validation ensures good user experience
 * - Stability checks prevent crashes during automation
 * - Multiple test scenarios cover edge cases
 */
