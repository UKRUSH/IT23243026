import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

/**
 * ========================================
 * CUSTOM TEST REPORTER
 * ========================================
 * Purpose: Display test execution summary by category
 * Categories: Positive, Negative, UI
 * Shows: Pass/Fail counts for each category
 * ========================================
 */
class CustomCategoryReporter implements Reporter {
  private positiveTests: { passed: number; failed: number } = { passed: 0, failed: 0 };
  private negativeTests: { passed: number; failed: number } = { passed: 0, failed: 0 };
  private uiTests: { passed: number; failed: number } = { passed: 0, failed: 0 };
  private totalTests: { passed: number; failed: number } = { passed: 0, failed: 0 };

  /**
   * Called when a test ends
   * Categorizes the test and tracks pass/fail status
   */
  onTestEnd(test: TestCase, result: TestResult) {
    const isPass = result.status === 'passed';
    const testTitle = test.title;
    const testFile = test.location?.file || '';

    // Categorize test based on file name
    if (testFile.includes('positive-functional.spec.ts')) {
      if (isPass) {
        this.positiveTests.passed++;
      } else {
        this.positiveTests.failed++;
      }
    } else if (testFile.includes('negative-functional.spec.ts')) {
      if (isPass) {
        this.negativeTests.passed++;
      } else {
        this.negativeTests.failed++;
      }
    } else if (testFile.includes('ui.spec.ts')) {
      if (isPass) {
        this.uiTests.passed++;
      } else {
        this.uiTests.failed++;
      }
    }

    // Update total
    if (isPass) {
      this.totalTests.passed++;
    } else {
      this.totalTests.failed++;
    }
  }

  /**
   * Called when all tests finish
   * Displays the summary report
   */
  onEnd(result: FullResult) {
    console.log('\n\n');
    console.log('════════════════════════════════════════════════════════════════════════');
    console.log('                    TEST EXECUTION SUMMARY REPORT                       ');
    console.log('           SwiftTranslator.com - Singlish to Sinhala Testing            ');
    console.log('════════════════════════════════════════════════════════════════════════');
    console.log('');
    
    // Positive Tests
    const positiveTotal = this.positiveTests.passed + this.positiveTests.failed;
    console.log('✅ POSITIVE TESTS - Correct Conversions (24 scenarios)');
    console.log('   Purpose: Validate accurate Singlish to Sinhala translation');
    console.log('   ├─ Total Test Cases:     ' + positiveTotal);
    console.log('   ├─ ✅ Passed (Correct):   ' + this.positiveTests.passed + '  (System translated correctly)');
    console.log('   └─ ❌ Failed (Errors):    ' + this.positiveTests.failed + '  (System failed to translate correctly)');
    console.log('');

    // Negative Tests
    const negativeTotal = this.negativeTests.passed + this.negativeTests.failed;
    console.log('⚠️  NEGATIVE TESTS - Incorrect/Failed Behavior (10 scenarios)');
    console.log('   Purpose: Document actual system behavior with problematic inputs');
    console.log('   ├─ Total Test Cases:     ' + negativeTotal);
    console.log('   ├─ ✅ Documented:         ' + this.negativeTests.passed + '  (Actual incorrect behavior captured)');
    console.log('   └─ ❌ Test Errors:        ' + this.negativeTests.failed + '  (Test execution failed)');
    console.log('   📝 Note: These tests intentionally use BAD inputs that produce');
    console.log('           INCORRECT translations. "Passed" means we successfully');
    console.log('           documented what the system actually does (even if wrong).');
    console.log('');

    // UI Tests
    const uiTotal = this.uiTests.passed + this.uiTests.failed;
    console.log('🖥️  UI TESTS - User Interface Behavior (1 scenario)');
    console.log('   Purpose: Validate real-time conversion and interface behavior');
    console.log('   ├─ Total Test Cases:     ' + uiTotal);
    console.log('   ├─ ✅ Passed (Working):   ' + this.uiTests.passed + '  (UI functions correctly)');
    console.log('   └─ ❌ Failed (Broken):    ' + this.uiTests.failed + '  (UI has issues)');
    console.log('');

    console.log('────────────────────────────────────────────────────────────────────────');
    
    // Overall Summary
    const allTotal = this.totalTests.passed + this.totalTests.failed;
    console.log('🎯 OVERALL TEST EXECUTION SUMMARY');
    console.log('   ├─ Total Test Cases Executed:    ' + allTotal);
    console.log('   ├─ ✅ Tests Passed/Documented:    ' + this.totalTests.passed);
    console.log('   └─ ❌ Tests Failed:                ' + this.totalTests.failed);
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════════════');
    
    // Test Requirements Check
    console.log('');
    console.log('📋 ASSIGNMENT REQUIREMENTS VALIDATION:');
    console.log('   ┌─────────────────────────────────────────────────────────────┐');
    console.log('   │  Test Category        │ Required │ Actual │ Status          │');
    console.log('   ├─────────────────────────────────────────────────────────────┤');
    console.log('   │  ✅ Positive Tests     │    24    │   ' + String(positiveTotal).padEnd(2) + '   │ ' + (positiveTotal === 24 ? '✅ PASS    ' : '❌ FAIL    ') + ' │');
    console.log('   │  ⚠️  Negative Tests     │    10    │   ' + String(negativeTotal).padEnd(2) + '   │ ' + (negativeTotal === 10 ? '✅ PASS    ' : '❌ FAIL    ') + ' │');
    console.log('   │  🖥️  UI Tests           │     1    │   ' + String(uiTotal).padEnd(2) + '   │ ' + (uiTotal === 1 ? '✅ PASS    ' : '❌ FAIL    ') + ' │');
    console.log('   ├─────────────────────────────────────────────────────────────┤');
    console.log('   │  📊 TOTAL             │    35    │   ' + String(allTotal).padEnd(2) + '   │ ' + (allTotal === 35 ? '✅ COMPLETE' : '❌ MISSING ') + ' │');
    console.log('   └─────────────────────────────────────────────────────────────┘');
    console.log('');
    console.log('════════════════════════════════════════════════════════════════════════');
    
    // Interpretation Guide
    console.log('');
    console.log('📖 INTERPRETATION GUIDE:');
    console.log('');
    console.log('   ✅ POSITIVE TESTS (24):');
    console.log('      • These validate CORRECT system behavior');
    console.log('      • Input: Valid Singlish → Expected: Accurate Sinhala');
    console.log('      • PASS = System translated correctly');
    console.log('');
    console.log('   ⚠️  NEGATIVE TESTS (10):');
    console.log('      • These document system behavior with BAD inputs');
    console.log('      • Input: Invalid/Messy Singlish → Expected: Whatever system does');
    console.log('      • PASS = Successfully documented actual (often incorrect) behavior');
    console.log('      • These tests DO NOT validate correctness, they validate robustness');
    console.log('');
    console.log('   🖥️  UI TESTS (1):');
    console.log('      • These validate user interface functionality');
    console.log('      • Tests real-time conversion, responsiveness, no crashes');
    console.log('      • PASS = UI works as expected');
    console.log('');
    console.log('════════════════════════════════════════════════════════════════════════');
    console.log('');
  }
}

export default CustomCategoryReporter;
