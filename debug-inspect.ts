import { chromium } from '@playwright/test';

/**
 * DEBUG SCRIPT - Inspect SwiftTranslator Website Elements
 * 
 * Purpose: This script opens the SwiftTranslator website in headed mode
 * and helps identify the correct CSS selectors for input/output fields.
 * 
 * How to run: npx ts-node debug-inspect.ts
 * 
 * Instructions:
 * 1. This will open the browser
 * 2. Manually inspect the page elements
 * 3. Find the correct selectors for:
 *    - Singlish input textarea
 *    - Sinhala output textarea
 * 4. Update translator.page.ts with correct selectors
 */

(async () => {
  console.log('🔍 Starting SwiftTranslator element inspection...\n');
  
  // Step 1: Launch browser in headed mode
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  // Step 2: Create new page
  const page = await browser.newPage();
  
  // Step 3: Navigate to SwiftTranslator
  console.log('📍 Navigating to https://www.swifttranslator.com/');
  await page.goto('https://www.swifttranslator.com/');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Page loaded successfully!\n');
  
  // Step 4: Try to find textarea elements
  console.log('🔎 Searching for textarea elements...\n');
  
  const textareas = await page.locator('textarea').count();
  console.log(`Found ${textareas} textarea(s) on the page`);
  
  // Step 5: Get details of each textarea
  for (let i = 0; i < textareas; i++) {
    const textarea = page.locator('textarea').nth(i);
    const id = await textarea.getAttribute('id').catch(() => 'No ID');
    const className = await textarea.getAttribute('class').catch(() => 'No class');
    const placeholder = await textarea.getAttribute('placeholder').catch(() => 'No placeholder');
    const name = await textarea.getAttribute('name').catch(() => 'No name');
    
    console.log(`\n--- Textarea #${i + 1} ---`);
    console.log(`ID: ${id}`);
    console.log(`Class: ${className}`);
    console.log(`Placeholder: ${placeholder}`);
    console.log(`Name: ${name}`);
  }
  
  // Step 6: Try to find input elements
  console.log('\n\n🔎 Searching for input elements...\n');
  
  const inputs = await page.locator('input[type="text"]').count();
  console.log(`Found ${inputs} text input(s) on the page`);
  
  for (let i = 0; i < inputs; i++) {
    const input = page.locator('input[type="text"]').nth(i);
    const id = await input.getAttribute('id').catch(() => 'No ID');
    const className = await input.getAttribute('class').catch(() => 'No class');
    const placeholder = await input.getAttribute('placeholder').catch(() => 'No placeholder');
    
    console.log(`\n--- Input #${i + 1} ---`);
    console.log(`ID: ${id}`);
    console.log(`Class: ${className}`);
    console.log(`Placeholder: ${placeholder}`);
  }
  
  // Step 7: Check for contenteditable divs
  console.log('\n\n🔎 Searching for contenteditable elements...\n');
  
  const editables = await page.locator('[contenteditable="true"]').count();
  console.log(`Found ${editables} contenteditable element(s)`);
  
  for (let i = 0; i < editables; i++) {
    const editable = page.locator('[contenteditable="true"]').nth(i);
    const id = await editable.getAttribute('id').catch(() => 'No ID');
    const className = await editable.getAttribute('class').catch(() => 'No class');
    const role = await editable.getAttribute('role').catch(() => 'No role');
    
    console.log(`\n--- Contenteditable #${i + 1} ---`);
    console.log(`ID: ${id}`);
    console.log(`Class: ${className}`);
    console.log(`Role: ${role}`);
  }
  
  console.log('\n\n========================================');
  console.log('✅ Inspection Complete!');
  console.log('========================================');
  console.log('\n📝 Next Steps:');
  console.log('1. Review the element details above');
  console.log('2. Update translator.page.ts with correct selectors');
  console.log('3. Browser will remain open for 30 seconds for manual inspection');
  console.log('4. Press Ctrl+C to close immediately\n');
  
  // Step 8: Wait 30 seconds for manual inspection
  await page.waitForTimeout(30000);
  
  await browser.close();
  console.log('🔒 Browser closed.');
})();
