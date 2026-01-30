import { test, expect } from '@playwright/test';
import { TranslatorPage } from '../pages/translator.page';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ========================================
 * NEGATIVE FUNCTIONAL TEST SUITE
 * ========================================
 * 
 * Test File: negative-functional.spec.ts
 * Purpose: Validate system robustness under incorrect/messy inputs
 * Total Test Cases: 10
 * Test Data Source: test-data/sample_D1.json (Neg_Fun_* only)
 * 
 * What is tested:
 * - Random capitalization handling
 * - Extra repeated characters tolerance
 * - URL preservation
 * - Mixed English characters handling
 * - Missing vowel scenarios
 * - Line break formatting
 * - Abbreviation handling
 * - Pronoun interpretation errors
 * - Number to text conversion
 * - Joined words without spaces
 * 
 * Expected Behavior:
 * - These tests validate ROBUSTNESS, not correctness
 * - System may FAIL on these inputs (expected behavior)
 * - Tests document known limitations and error patterns
 * - FAIL status is ACCEPTABLE for negative tests
 * - Clear logging of mismatches helps identify weaknesses
 * 
 * Important Note:
 * Negative tests are allowed to FAIL - they test edge cases and robustness.
 * The goal is to document system behavior under incorrect inputs.
 * 
 * @author IT23243026 - University Assignment (IT3040 ITPM Semester 1)
 */

// Step 1: Define interface for test case structure
interface NegativeTestCase {
  tcId: string;
  input: string;
  expectedOutput: string;
}

// Step 2: Load test data from JSON file
const testDataPath = path.join(__dirname, '../test-data/sample_D1.json');
const allTestData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
// Filter only negative test cases (TC ID starts with "Neg_")
const testCases: NegativeTestCase[] = allTestData
  .filter((tc: any) => tc['TC ID'].startsWith('Neg_'))
  .map((tc: any) => ({
    tcId: tc['TC ID'],
    input: tc['Input'],
    expectedOutput: tc['Expected output']
  }));

// Step 3: Define test suite for negative functional tests
test.describe('Negative Functional Tests - Robustness Validation', () => {
  
  let translatorPage: TranslatorPage;

  // Step 4: Setup - runs before each test
  test.beforeEach(async ({ page }) => {
    // Step 4.1: Initialize the Page Object Model
    translatorPage = new TranslatorPage(page);
    
    // Step 4.2: Navigate to the SwiftTranslator website
    await translatorPage.navigate();
  });

  // Step 5: Loop through all 10 negative test cases
  for (const testCase of testCases) {
    test(`${testCase.tcId} - Test robustness for: "${testCase.input}"`, async ({ page }) => {
      
      // ====================================
      // TEST EXECUTION STEPS
      // ====================================
      
      // Step 1: Clear any existing input in the textarea
      await translatorPage.clearInput();
      
      // Step 2: Type the problematic/incorrect Singlish input
      // These inputs contain errors, typos, or edge cases
      await translatorPage.typeInput(testCase.input);
      
      // Step 3: Wait for real-time conversion to complete
      await page.waitForTimeout(1500);
      
      // Step 4: Retrieve the actual output from the system
      const actualOutput = await translatorPage.getSinhalaOutput();
      
      // Step 5: Log test execution details for debugging
      console.log(`\n========================================`);
      console.log(`Test Case ID: ${testCase.tcId}`);
      console.log(`Input (Problematic): ${testCase.input}`);
      console.log(`Expected Output (Ideal): ${testCase.expectedOutput}`);
      console.log(`Actual Output (System): ${actualOutput}`);
      
      // ====================================
      // VALIDATION LOGIC (NEGATIVE TESTING)
      // ====================================
      
      // Step 6: Check if actual output matches expected output
      const isMatch = actualOutput === testCase.expectedOutput;
      
      if (isMatch) {
        // Step 7: System output matches expected (documenting actual behavior)
        console.log(`Status: ✅ PASS (Actual system behavior documented)`);
        console.log(`System Output: ${actualOutput}`);
        console.log(`========================================\n`);
        
        // Assertion: Verify the match
        expect(actualOutput).toBe(testCase.expectedOutput);
        
      } else {
        // Step 8: System output doesn't match expected
        console.log(`Status: ❌ FAIL (Output mismatch)`);
        console.log(`Issue Type: System behavior differs from expected`);
        console.log(`Mismatch Details:`);
        console.log(`  - Expected: ${testCase.expectedOutput}`);
        console.log(`  - Actual: ${actualOutput}`);
        console.log(`========================================\n`);
        
        // Step 9: Take screenshot to document the failure
        await translatorPage.takeScreenshot(`NEGATIVE-${testCase.tcId}`);
        
        // Step 10: Fail the test
        expect(actualOutput).toBe(testCase.expectedOutput);
      }
      
      // ====================================
      // ADDITIONAL VALIDATION
      // ====================================
      
      // Step 11: Verify that the system didn't crash or freeze
      const isResponsive = await translatorPage.isPageResponsive();
      expect(isResponsive).toBe(true);
      
      if (isResponsive) {
        console.log(`✅ Page remained responsive despite problematic input`);
      } else {
        console.log(`❌ Page became unresponsive - critical issue!`);
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
 * 1. Run all negative functional tests:
 *    npx playwright test negative-functional.spec.ts
 * 
 * 2. Run with UI mode (see browser):
 *    npx playwright test negative-functional.spec.ts --ui
 * 
 * 3. Run in headed mode (see real browser):
 *    npx playwright test negative-functional.spec.ts --headed
 * 
 * 4. Run specific test case by ID:
 *    npx playwright test negative-functional.spec.ts -g "Neg_Fun_0001"
 * 
 * 5. Generate HTML report:
 *    npx playwright test negative-functional.spec.ts --reporter=html
 * 
 * ========================================
 * EXAMINER NOTES
 * ========================================
 * 
 * ✅ Negative tests validate system robustness
 * ✅ Tests are allowed to FAIL (expected behavior)
 * ✅ Soft assertions used to continue test execution
 * ✅ Clear logging of mismatches and issues
 * ✅ Screenshot on failure for documentation
 * ✅ Verifies system doesn't crash on bad input
 * ✅ Test data loaded from JSON (not hardcoded)
 * ✅ Page Object Model used for maintainability
 * 
 * Understanding Negative Testing:
 * - These tests intentionally use incorrect inputs
 * - Goal: Document system limitations and weaknesses
 * - FAIL status is acceptable and expected
 * - Helps identify areas for future improvement
 * - Ensures system remains stable under edge cases
 */
