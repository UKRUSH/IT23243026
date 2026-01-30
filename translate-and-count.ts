import { chromium, Browser, Page } from '@playwright/test';
import { TranslatorPage } from './pages/translator.page';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Translation Script
 * Purpose: Translate all data from sample_data.json and count results
 * 
 * This script will:
 * 1. Load all test data from sample_data.json
 * 2. Translate each input using the SwiftTranslator
 * 3. Compare with expected output
 * 4. Count how many translations are positive, negative, and UI-related
 * 5. Display statistics about translation accuracy
 */

interface TestCase {
  tcId: string;
  input: string;
  expectedOutput: string;
}

interface TranslationResult {
  tcId: string;
  type: 'positive' | 'negative' | 'ui';
  input: string;
  expectedOutput: string;
  actualOutput: string;
  isMatch: boolean;
}

async function main() {
  console.log('========================================');
  console.log('TRANSLATION SCRIPT STARTED');
  console.log('========================================\n');

  // Step 1: Load test data from sample_data.json
  const testDataPath = path.join(__dirname, 'test-data/sample_data.json');
  const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

  const positiveTests: TestCase[] = testData.positive;
  const negativeTests: TestCase[] = testData.negative;
  const uiTests: TestCase[] = testData.ui;

  console.log(`✅ Loaded test data:`);
  console.log(`   - Positive: ${positiveTests.length} test cases`);
  console.log(`   - Negative: ${negativeTests.length} test cases`);
  console.log(`   - UI: ${uiTests.length} test cases`);
  console.log(`   - Total: ${positiveTests.length + negativeTests.length + uiTests.length} test cases\n`);

  // Step 2: Launch browser
  console.log('🌐 Launching browser...\n');
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();
  const translatorPage = new TranslatorPage(page);

  // Step 3: Navigate to translator
  await translatorPage.navigate();
  console.log('✅ Navigated to SwiftTranslator\n');

  // Step 4: Array to store all translation results
  const results: TranslationResult[] = [];

  // Step 5: Translate positive test cases
  console.log('========================================');
  console.log('TRANSLATING POSITIVE TEST CASES');
  console.log('========================================\n');
  
  for (let i = 0; i < positiveTests.length; i++) {
    const testCase = positiveTests[i];
    console.log(`[${i + 1}/${positiveTests.length}] ${testCase.tcId}`);
    console.log(`   Input: ${testCase.input.substring(0, 50)}${testCase.input.length > 50 ? '...' : ''}`);
    
    await translatorPage.clearInput();
    await translatorPage.typeInput(testCase.input);
    await page.waitForTimeout(2000);
    
    const actualOutput = await translatorPage.getSinhalaOutput();
    const isMatch = actualOutput === testCase.expectedOutput;
    
    results.push({
      tcId: testCase.tcId,
      type: 'positive',
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: actualOutput,
      isMatch: isMatch
    });
    
    console.log(`   Result: ${isMatch ? '✅ MATCH' : '❌ MISMATCH'}\n`);
  }

  // Step 6: Translate negative test cases
  console.log('========================================');
  console.log('TRANSLATING NEGATIVE TEST CASES');
  console.log('========================================\n');
  
  for (let i = 0; i < negativeTests.length; i++) {
    const testCase = negativeTests[i];
    console.log(`[${i + 1}/${negativeTests.length}] ${testCase.tcId}`);
    console.log(`   Input: ${testCase.input.substring(0, 50)}${testCase.input.length > 50 ? '...' : ''}`);
    
    await translatorPage.clearInput();
    await translatorPage.typeInput(testCase.input);
    await page.waitForTimeout(2000);
    
    const actualOutput = await translatorPage.getSinhalaOutput();
    const isMatch = actualOutput === testCase.expectedOutput;
    
    results.push({
      tcId: testCase.tcId,
      type: 'negative',
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: actualOutput,
      isMatch: isMatch
    });
    
    console.log(`   Result: ${isMatch ? '✅ MATCH' : '❌ MISMATCH'}\n`);
  }

  // Step 7: Translate UI test cases
  console.log('========================================');
  console.log('TRANSLATING UI TEST CASES');
  console.log('========================================\n');
  
  for (let i = 0; i < uiTests.length; i++) {
    const testCase = uiTests[i];
    console.log(`[${i + 1}/${uiTests.length}] ${testCase.tcId}`);
    console.log(`   Input: ${testCase.input.substring(0, 50)}${testCase.input.length > 50 ? '...' : ''}`);
    
    await translatorPage.clearInput();
    await translatorPage.typeInput(testCase.input);
    await page.waitForTimeout(2000);
    
    const actualOutput = await translatorPage.getSinhalaOutput();
    const isMatch = actualOutput === testCase.expectedOutput;
    
    results.push({
      tcId: testCase.tcId,
      type: 'ui',
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: actualOutput,
      isMatch: isMatch
    });
    
    console.log(`   Result: ${isMatch ? '✅ MATCH' : '❌ MISMATCH'}\n`);
  }

  // Step 8: Calculate statistics
  console.log('========================================');
  console.log('TRANSLATION STATISTICS');
  console.log('========================================\n');

  const positiveResults = results.filter(r => r.type === 'positive');
  const negativeResults = results.filter(r => r.type === 'negative');
  const uiResults = results.filter(r => r.type === 'ui');

  const positiveMatches = positiveResults.filter(r => r.isMatch).length;
  const negativeMatches = negativeResults.filter(r => r.isMatch).length;
  const uiMatches = uiResults.filter(r => r.isMatch).length;

  const positiveAccuracy = positiveResults.length > 0 
    ? ((positiveMatches / positiveResults.length) * 100).toFixed(2) 
    : '0.00';
  const negativeAccuracy = negativeResults.length > 0 
    ? ((negativeMatches / negativeResults.length) * 100).toFixed(2) 
    : '0.00';
  const uiAccuracy = uiResults.length > 0 
    ? ((uiMatches / uiResults.length) * 100).toFixed(2) 
    : '0.00';
  
  const totalMatches = positiveMatches + negativeMatches + uiMatches;
  const totalTests = results.length;
  const overallAccuracy = totalTests > 0 
    ? ((totalMatches / totalTests) * 100).toFixed(2) 
    : '0.00';

  console.log('📊 POSITIVE FUNCTIONAL TESTS:');
  console.log(`   Total: ${positiveResults.length}`);
  console.log(`   Matches: ${positiveMatches}`);
  console.log(`   Mismatches: ${positiveResults.length - positiveMatches}`);
  console.log(`   Accuracy: ${positiveAccuracy}%\n`);

  console.log('📊 NEGATIVE FUNCTIONAL TESTS:');
  console.log(`   Total: ${negativeResults.length}`);
  console.log(`   Matches: ${negativeMatches}`);
  console.log(`   Mismatches: ${negativeResults.length - negativeMatches}`);
  console.log(`   Accuracy: ${negativeAccuracy}%\n`);

  console.log('📊 UI TESTS:');
  console.log(`   Total: ${uiResults.length}`);
  console.log(`   Matches: ${uiMatches}`);
  console.log(`   Mismatches: ${uiResults.length - uiMatches}`);
  console.log(`   Accuracy: ${uiAccuracy}%\n`);

  console.log('========================================');
  console.log('📊 OVERALL SUMMARY');
  console.log('========================================');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Total Matches: ${totalMatches}`);
  console.log(`   Total Mismatches: ${totalTests - totalMatches}`);
  console.log(`   Overall Accuracy: ${overallAccuracy}%\n`);

  // Step 9: Save results to JSON file
  const resultsPath = path.join(__dirname, 'test-results/translation-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      positive: {
        total: positiveResults.length,
        matches: positiveMatches,
        mismatches: positiveResults.length - positiveMatches,
        accuracy: positiveAccuracy + '%'
      },
      negative: {
        total: negativeResults.length,
        matches: negativeMatches,
        mismatches: negativeResults.length - negativeMatches,
        accuracy: negativeAccuracy + '%'
      },
      ui: {
        total: uiResults.length,
        matches: uiMatches,
        mismatches: uiResults.length - uiMatches,
        accuracy: uiAccuracy + '%'
      },
      overall: {
        total: totalTests,
        matches: totalMatches,
        mismatches: totalTests - totalMatches,
        accuracy: overallAccuracy + '%'
      }
    },
    detailedResults: results
  }, null, 2));

  console.log(`✅ Detailed results saved to: ${resultsPath}\n`);

  // Step 10: Close browser
  await browser.close();
  console.log('========================================');
  console.log('TRANSLATION SCRIPT COMPLETED');
  console.log('========================================');
}

// Run the script
main().catch(error => {
  console.error('❌ Error occurred:', error);
  process.exit(1);
});
