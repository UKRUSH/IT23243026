import { chromium } from '@playwright/test';

/**
 * DEBUG SCRIPT #2 - Find Output Element
 * 
 * This script types text into the input and identifies where the output appears
 */

(async () => {
  console.log('🔍 Finding output element...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const page = await browser.newPage();
  
  console.log('📍 Navigating to https://www.swifttranslator.com/');
  await page.goto('https://www.swifttranslator.com/');
  await page.waitForLoadState('networkidle');
  
  // Find the input textarea
  const inputTextarea = page.locator('textarea[placeholder*="Singlish"]');
  console.log('✅ Found input textarea');
  
  // Type test text
  console.log('📝 Typing test text: "mama gedhara yanavaa"');
  await inputTextarea.fill('mama gedhara yanavaa');
  
  // Wait for conversion
  console.log('⏳ Waiting 3 seconds for conversion...');
  await page.waitForTimeout(3000);
  
  // Search for elements that might contain Sinhala output
  console.log('\n🔎 Searching for possible output elements...\n');
  
  // Check all divs with Sinhala text
  const allDivs = await page.locator('div').all();
  console.log(`Total divs found: ${allDivs.length}`);
  
  for (let i = 0; i < Math.min(allDivs.length, 50); i++) {
    const text = await allDivs[i].textContent();
    if (text && text.includes('මම')) {
      const id = await allDivs[i].getAttribute('id');
      const className = await allDivs[i].getAttribute('class');
      console.log(`\n✅ FOUND OUTPUT DIV #${i}:`);
      console.log(`Text: ${text}`);
      console.log(`ID: ${id || 'No ID'}`);
      console.log(`Class: ${className || 'No class'}`);
    }
  }
  
  // Check for pre, code, or span elements
  const preElements = await page.locator('pre').count();
  console.log(`\n📋 Found ${preElements} <pre> elements`);
  
  const codeElements = await page.locator('code').count();
  console.log(`📋 Found ${codeElements} <code> elements`);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-output-location.png', fullPage: true });
  console.log('\n📸 Screenshot saved: debug-output-location.png');
  
  console.log('\n\n⏸️  Browser will stay open for 60 seconds');
  console.log('Please manually inspect the page to find the output element');
  console.log('Press Ctrl+C to close\n');
  
  await page.waitForTimeout(60000);
  
  await browser.close();
})();
