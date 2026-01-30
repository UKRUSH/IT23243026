import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for SwiftTranslator Web Application
 * This class encapsulates all interactions with https://www.swifttranslator.com/
 * 
 * Purpose: Provides reusable methods for testing Singlish to Sinhala transliteration
 * Features: Real-time conversion testing, input/output validation, element interaction
 * 
 * @author IT23243026 - University Assignment (IT3040 ITPM Semester 1)
 */
export class TranslatorPage {
  // Page instance for browser interaction
  readonly page: Page;
  
  // Locators for web elements on the translator page
  readonly singlishInputTextarea: Locator;
  readonly sinhalaOutputTextarea: Locator;
  readonly clearButton: Locator;

  /**
   * Constructor - Initializes the page object with locators
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    
    // Step 1: Define locator for Singlish input textarea
    // This is where users type Singlish text
    // Selector: textarea with placeholder containing "Singlish"
    this.singlishInputTextarea = page.locator('textarea[placeholder*="Singlish"]');
    
    // Step 2: Define locator for Sinhala output div
    // This displays the real-time converted Sinhala text
    // Note: Output is displayed in a div, NOT a textarea
    // Selector: div with specific classes for output display
    this.sinhalaOutputTextarea = page.locator('div.whitespace-pre-wrap.overflow-y-auto.flex-grow.bg-slate-50');
    
    // Step 3: Define locator for clear button
    this.clearButton = page.locator('button:has-text("Clear")');
  }

  /**
   * Navigate to the SwiftTranslator website
   * Step 1: Open the target URL
   * Step 2: Wait for page to be fully loaded
   */
  async navigate() {
    // Step 1: Navigate to the translator website
    await this.page.goto('https://www.swifttranslator.com/');
    
    // Step 2: Wait for network to be idle (page fully loaded)
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear the Singlish input field
   * Step 1: Click on the input field to focus
   * Step 2: Select all text using keyboard shortcut
   * Step 3: Delete the selected text
   */
  async clearInput() {
    // Step 1: Focus on the input textarea
    await this.singlishInputTextarea.click();
    
    // Step 2: Select all text (Ctrl+A)
    await this.page.keyboard.press('Control+A');
    
    // Step 3: Delete selected text
    await this.page.keyboard.press('Backspace');
    
    // Step 4: Wait a moment for the output to clear
    await this.page.waitForTimeout(500);
  }

  /**
   * Type Singlish text into the input field
   * The system performs REAL-TIME conversion as you type
   * 
   * @param text - Singlish text to be typed
   * Step 1: Clear any existing input
   * Step 2: Type the Singlish text character by character
   * Step 3: Wait for real-time conversion to complete
   */
  async typeInput(text: string) {
    // Step 1: Clear existing input first
    await this.clearInput();
    
    // Step 2: Type the Singlish text with slight delay for real-time conversion
    await this.singlishInputTextarea.fill(text);
    
    // Step 3: Wait for real-time conversion to process
    // The system converts text automatically without clicking any button
    // Increased wait time for webkit browser compatibility (especially for complex inputs)
    await this.page.waitForTimeout(3000);
  }

  /**
   * Get the current Sinhala output from the output textarea
   * This reads the real-time converted text
   * 
   * @returns Sinhala output text as string
   * Step 1: Wait for output to be visible
   * Step 2: Retrieve the text content
   * Step 3: Return trimmed output
   */
  async getSinhalaOutput(): Promise<string> {
    // Step 1: Wait for output div to be visible
    await this.sinhalaOutputTextarea.waitFor({ state: 'visible' });
    
    // Step 2: Get the text content from output div (NOT inputValue, it's a div!)
    const outputText = await this.sinhalaOutputTextarea.textContent();
    
    // Step 3: Return trimmed output (remove extra whitespace)
    return (outputText || '').trim();
  }

  /**
   * Check if the page is responsive and not frozen
   * This is useful for UI testing to ensure no crashes
   * 
   * @returns true if page is responsive, false otherwise
   */
  async isPageResponsive(): Promise<boolean> {
    try {
      // Step 1: Check if input field is still interactable
      await this.singlishInputTextarea.waitFor({ state: 'visible', timeout: 5000 });
      
      // Step 2: Verify output field is also visible
      await this.sinhalaOutputTextarea.waitFor({ state: 'visible', timeout: 5000 });
      
      // Step 3: Return true if both elements are responsive
      return true;
    } catch (error) {
      // Step 4: Return false if any element is not responsive
      return false;
    }
  }

  /**
   * Take a screenshot of the current page state
   * Useful for debugging and marking failed test cases
   * 
   * @param filename - Name of the screenshot file
   * Step 1: Capture full page screenshot
   * Step 2: Save to screenshots folder with timestamp subfolder
   */
  async takeScreenshot(filename: string) {
    // Get current date for folder organization
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const folderName = `test_run_${timestamp}`;
    
    // Step 1: Take screenshot and save to timestamped subfolder
    await this.page.screenshot({ 
      path: `screenshots/${folderName}/${filename}.png`, 
      fullPage: true 
    });
  }

  /**
   * Verify real-time output update behavior
   * This method types text character by character and checks if output updates in real-time
   * 
   * @param input - Singlish text to type
   * @returns true if output updates in real-time, false otherwise
   */
  async verifyRealTimeConversion(input: string): Promise<boolean> {
    try {
      // Step 1: Clear input field
      await this.clearInput();
      
      // Step 2: Type input text slowly to observe real-time behavior
      await this.singlishInputTextarea.type(input, { delay: 100 });
      
      // Step 3: Check if output is not empty (indicates real-time conversion)
      const output = await this.getSinhalaOutput();
      
      // Step 4: Return true if output was generated without clicking any button
      return output.length > 0;
    } catch (error) {
      return false;
    }
  }
}
