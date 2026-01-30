import { chromium, Browser, Page } from '@playwright/test';
import { TranslatorPage } from './pages/translator.page';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Update Actual Outputs Script
 * Purpose: Translate all inputs from sample_D1.json using real translator
 *          and update "Actual output" field with 100% accurate results
 */

interface TestCase {
  "TC ID": string;
  "Test case name": string;
  "Input length type": string;
  "Input": string;
  "Expected output": string;
  "Actual output": string;
  "Status": string;
  "Justification": string;
  "What is covered by the test": string;
}

async function main() {
  console.log('========================================');
  console.log('UPDATING ACTUAL OUTPUTS FROM TRANSLATOR');
  console.log('========================================\n');

  // Step 1: Load test data from sample_D1.json
  const testDataPath = path.join(__dirname, 'test-data/sample_D1.json');
  const testData: TestCase[] = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

  console.log(`✅ Loaded ${testData.length} test cases from sample_D1.json\n`);

  // Step 2: Launch browser
  console.log('🌐 Launching browser...\n');
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();
  const translatorPage = new TranslatorPage(page);

  // Step 3: Navigate to translator
  await translatorPage.navigate();
  console.log('✅ Navigated to SwiftTranslator\n');

  console.log('========================================');
  console.log('TRANSLATING ALL INPUTS');
  console.log('========================================\n');

  // Step 4: Translate each input and update actual output
  let totalProcessingTime = 0;
  
  for (let i = 0; i < testData.length; i++) {
    const testCase = testData[i];
    console.log(`[${i + 1}/${testData.length}] ${testCase["TC ID"]}`);
    console.log(`   Input: ${testCase["Input"].substring(0, 60)}${testCase["Input"].length > 60 ? '...' : ''}`);
    
    // Start timing
    const startTime = Date.now();
    
    // Clear input field completely
    await translatorPage.clearInput();
    await page.waitForTimeout(500);
    
    // Type input and wait for real-time conversion
    await translatorPage.typeInput(testCase["Input"]);
    
    // Wait for translation to complete with dynamic wait time based on input length
    const inputLength = testCase["Input"].length;
    let waitTime = 2000; // Base wait time
    if (inputLength > 100) {
      waitTime = 4000; // Long inputs need more time
    } else if (inputLength > 50) {
      waitTime = 3000; // Medium inputs
    }
    
    await page.waitForTimeout(waitTime);
    
    // Verify output is stable (wait for any final updates)
    let previousOutput = '';
    let stableOutput = '';
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      stableOutput = await translatorPage.getSinhalaOutput();
      
      if (stableOutput === previousOutput && stableOutput.length > 0) {
        // Output is stable
        break;
      }
      
      previousOutput = stableOutput;
      await page.waitForTimeout(500);
      attempts++;
    }
    
    const actualOutput = stableOutput;
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    totalProcessingTime += processingTime;
    
    // Update the actual output field
    testData[i]["Actual output"] = actualOutput;
    
    // Full verification
    const isMatch = actualOutput === testCase["Expected output"];
    const outputLength = actualOutput.length;
    const expectedLength = testCase["Expected output"].length;
    const lengthDiff = Math.abs(outputLength - expectedLength);
    
    console.log(`   Expected: ${testCase["Expected output"].substring(0, 50)}${testCase["Expected output"].length > 50 ? '...' : ''}`);
    console.log(`   Actual:   ${actualOutput.substring(0, 50)}${actualOutput.length > 50 ? '...' : ''}`);
    console.log(`   Match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    console.log(`   Processing Time: ${processingTime}ms`);
    console.log(`   Output Length: ${outputLength} chars (Expected: ${expectedLength} chars, Diff: ${lengthDiff})`);
    
    if (!isMatch && actualOutput.length === 0) {
      console.log(`   ⚠️  WARNING: Empty output received!`);
    }
    
    console.log('');
  }
  
  console.log(`\n⏱️  Total Processing Time: ${totalProcessingTime}ms`);
  console.log(`⏱️  Average Time per Test: ${(totalProcessingTime / testData.length).toFixed(2)}ms\n`);

  // Step 5: Save updated data back to file
  console.log('========================================');
  console.log('SAVING UPDATED DATA');
  console.log('========================================\n');

  const updatedDataPath = path.join(__dirname, 'test-data/sample_D1.json');
  fs.writeFileSync(updatedDataPath, JSON.stringify(testData, null, 2), 'utf-8');
  
  console.log(`✅ Updated data saved to: ${updatedDataPath}\n`);

  // Step 6: Generate statistics
  console.log('========================================');
  console.log('STATISTICS');
  console.log('========================================\n');

  const positiveTests = testData.filter(tc => tc["TC ID"].startsWith('Pos_'));
  const negativeTests = testData.filter(tc => tc["TC ID"].startsWith('Neg_'));
  const uiTests = testData.filter(tc => tc["TC ID"].startsWith('Pos_UI_'));

  const positiveMatches = positiveTests.filter(tc => tc["Actual output"] === tc["Expected output"]).length;
  const negativeMatches = negativeTests.filter(tc => tc["Actual output"] === tc["Expected output"]).length;
  const uiMatches = uiTests.filter(tc => tc["Actual output"] === tc["Expected output"]).length;

  console.log('📊 POSITIVE TESTS:');
  console.log(`   Total: ${positiveTests.length}`);
  console.log(`   Matches: ${positiveMatches}`);
  console.log(`   Mismatches: ${positiveTests.length - positiveMatches}`);
  console.log(`   Accuracy: ${((positiveMatches / positiveTests.length) * 100).toFixed(2)}%\n`);

  console.log('📊 NEGATIVE TESTS:');
  console.log(`   Total: ${negativeTests.length}`);
  console.log(`   Matches: ${negativeMatches}`);
  console.log(`   Mismatches: ${negativeTests.length - negativeMatches}`);
  console.log(`   Accuracy: ${((negativeMatches / negativeTests.length) * 100).toFixed(2)}%\n`);

  console.log('📊 UI TESTS:');
  console.log(`   Total: ${uiTests.length}`);
  console.log(`   Matches: ${uiMatches}`);
  console.log(`   Mismatches: ${uiTests.length - uiMatches}`);
  console.log(`   Accuracy: ${((uiMatches / uiTests.length) * 100).toFixed(2)}%\n`);

  const totalMatches = positiveMatches + negativeMatches + uiMatches;
  const totalTests = testData.length;

  console.log('========================================');
  console.log('📊 OVERALL SUMMARY');
  console.log('========================================');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Total Matches: ${totalMatches}`);
  console.log(`   Total Mismatches: ${totalTests - totalMatches}`);
  console.log(`   Overall Accuracy: ${((totalMatches / totalTests) * 100).toFixed(2)}%\n`);

  // Step 7: Close browser
  await browser.close();
  console.log('========================================');
  console.log('✅ ACTUAL OUTPUTS UPDATED SUCCESSFULLY');
  console.log('========================================');
}

// Run the script
main().catch(error => {
  console.error('❌ Error occurred:', error);
  process.exit(1);
});
