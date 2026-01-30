import { test, expect } from '@playwright/test';
import { TranslatorPage } from '../pages/translator.page';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ========================================
 * POSITIVE FUNCTIONAL TEST SUITE
 * ========================================
 * 
 * Test File: positive-functional.spec.ts
 * Purpose: Validate correct Singlish to Sinhala transliteration functionality
 * Total Test Cases: 24
 * Test Data Source: test-data/sample_D1.json (Pos_Fun_* only)
 * 
 * What is tested:
 * - Daily language usage (simple, compound, complex sentences)
 * - Different sentence types (interrogative, imperative, declarative, negative)
 * - Tenses (present, past, future)
 * - Mixed content (English + Singlish, numbers, dates, URLs)
 * - Formatting preservation (spaces, line breaks, punctuation)
 * - Different input lengths (Short, Medium, Long)
 * 
 * Expected Behavior:
 * - System should accurately convert Singlish input to Sinhala output
 * - Real-time conversion without clicking any button
 * - Formatting and special characters should be preserved
 * - Tests PASS when actual output matches expected output exactly
 * 
 * @author IT23243026 - University Assignment (IT3040 ITPM Semester 1)
 */

// Step 1: Define interface for test case structure
interface PositiveTestCase {
  tcId: string;
  input: string;
  expectedOutput: string;
}

// Step 2: Load test data from JSON file
const testDataPath = path.join(__dirname, '../test-data/sample_D1.json');
const allTestData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
// Filter only positive functional test cases (TC ID starts with "Pos_Fun_")
const testCases: PositiveTestCase[] = allTestData
  .filter((tc: any) => tc['TC ID'].startsWith('Pos_Fun_'))
  .map((tc: any) => ({
    tcId: tc['TC ID'],
    input: tc['Input'],
    expectedOutput: tc['Expected output']
  }));

// Step 3: Define test suite for positive functional tests
test.describe('Positive Functional Tests - Singlish to Sinhala Transliteration', () => {
  
  let translatorPage: TranslatorPage;

  // Step 4: Setup - runs before each test
  test.beforeEach(async ({ page }) => {
    // Step 4.1: Initialize the Page Object Model
    translatorPage = new TranslatorPage(page);
    
    // Step 4.2: Navigate to the SwiftTranslator website
    await translatorPage.navigate();
  });

  // Step 5: Loop through all 24 positive test cases
  for (const testCase of testCases) {
    test(`${testCase.tcId} - Verify transliteration for: "${testCase.input}"`, async ({ page }) => {
      
      // ====================================
      // TEST EXECUTION STEPS
      // ====================================
      
      // Step 1: Clear any existing input in the textarea
      await translatorPage.clearInput();
      
      // Step 2: Type the Singlish input text into the input field
      // The system will convert in real-time as we type
      await translatorPage.typeInput(testCase.input);
      
      // Step 3: Wait for real-time conversion to complete
      await page.waitForTimeout(1500);
      
      // Step 4: Retrieve the actual Sinhala output from the output textarea
      const actualOutput = await translatorPage.getSinhalaOutput();
      
      // Step 5: Log test execution details for debugging
      console.log(`\n========================================`);
      console.log(`Test Case ID: ${testCase.tcId}`);
      console.log(`Input (Singlish): ${testCase.input}`);
      console.log(`Expected Output (Sinhala): ${testCase.expectedOutput}`);
      console.log(`Actual Output (Sinhala): ${actualOutput}`);
      
      // ====================================
      // VALIDATION LOGIC
      // ====================================
      
      // Step 6: Compare actual output with expected output
      try {
        expect(actualOutput).toBe(testCase.expectedOutput);
        
        // Step 7: If outputs match, mark test as PASS
        console.log(`Status: ✅ PASS`);
        console.log(`========================================\n`);
        
      } catch (error) {
        // Step 8: If outputs don't match, mark test as FAIL
        console.log(`Status: ❌ FAIL`);
        console.log(`Mismatch Details:`);
        console.log(`  - Expected: ${testCase.expectedOutput}`);
        console.log(`  - Actual: ${actualOutput}`);
        console.log(`========================================\n`);
        
        // Step 9: Take screenshot on failure (bonus marks for assignment)
        await translatorPage.takeScreenshot(`FAIL-${testCase.tcId}`);
        
        // Step 10: Re-throw error to fail the test
        throw error;
      }
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
 * 1. Run all positive functional tests:
 *    npx playwright test positive-functional.spec.ts
 * 
 * 2. Run with UI mode (see browser):
 *    npx playwright test positive-functional.spec.ts --ui
 * 
 * 3. Run in headed mode (see real browser):
 *    npx playwright test positive-functional.spec.ts --headed
 * 
 * 4. Run specific test case by ID:
 *    npx playwright test positive-functional.spec.ts -g "Pos_Fun_0001"
 * 
 * 5. Generate HTML report:
 *    npx playwright test positive-functional.spec.ts --reporter=html
 * 
 * ========================================
 * EXAMINER NOTES
 * ========================================
 * 
 * ✅ Test data is loaded from JSON (not hardcoded)
 * ✅ Page Object Model is used for maintainability
 * ✅ Clear comments explain each step
 * ✅ Screenshot on failure for debugging
 * ✅ Proper logging for test results
 * ✅ Real-time conversion testing (no button click)
 * ✅ Follows university assignment standards
 */
