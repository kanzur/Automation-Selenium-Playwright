import { Page, Locator, expect } from '@playwright/test';

/**
 * TopNav Page Object Model
 * Handles navigation between different OrangeHRM modules/tabs
 * and validates header/breadcrumb text after navigation
 */
export class TopNav {
  private page: Page;
  private header: Locator;      // Main page header element (h6.oxd-text)
  private breadcrumb: Locator;  // Breadcrumb navigation element (.oxd-topbar-header-breadcrumb)

  constructor(page: Page) {
    this.page = page;
    // Initialize locators for header and breadcrumb elements
    this.header = page.locator('h6.oxd-text');
    this.breadcrumb = page.locator('.oxd-topbar-header-breadcrumb');
  }

  /**
   * Opens a specific tab/module in OrangeHRM
   * Uses multiple selector strategies to find and click the tab
   * @param name - Name of the tab to open (e.g., 'Admin', 'PIM', 'Leave')
   */
  async openTab(name: string): Promise<void> {
    console.log(`>> Attempting to open tab: ${name}`);
    
    // Multiple selector strategies to handle different UI layouts
    const selectors = [
      `//span[normalize-space()='${name}']`,                    // Direct span text match
      `//a[contains(@href,'${name.toLowerCase()}')]`,          // Link with href containing tab name
      `//aside//span[normalize-space()='${name}']`,            // Sidebar span text match
      `a.oxd-main-menu-item[href*='${name.toLowerCase()}']`   // Main menu item with href
    ];
    
    // Try each selector until we find a match
    for (let i = 0; i < selectors.length; i++) {
      const sel = selectors[i];
      console.log(`  >> Trying selector ${i + 1}: ${sel}`);
      
      const locator = this.page.locator(sel);
      const count = await locator.count();
      
      if (count > 0) {
        console.log(`  >> Found ${count} element(s) with selector ${i + 1}`);
        
        try {
          // Scroll element into view for better interaction
          await locator.first().scrollIntoViewIfNeeded();
          console.log(`  >> Scrolled to element`);
          
          // Try normal click first
          await locator.first().click();
          console.log(`  >> Successfully clicked tab: ${name}`);
          return;
        } catch (clickError) {
          console.log(`  >> Normal click failed, trying JavaScript click`);
          
          // Fallback to JavaScript click if normal click fails
          try {
            await this.page.evaluate((el: HTMLElement) => el.click(), await locator.first().elementHandle());
            console.log(`  >> Successfully clicked tab: ${name} using JavaScript`);
            return;
          } catch (jsClickError) {
            console.log(`  >> JavaScript click also failed for selector ${i + 1}`);
            continue; // Try next selector
          }
        }
      } else {
        console.log(`  >> No elements found with selector ${i + 1}`);
      }
    }
    
    // If we get here, no selector worked
    console.error(`>> ERROR: Tab '${name}' not found with any selector`);
    throw new Error(`Tab not found: ${name}`);
  }

  /**
   * Validates that the current page header or breadcrumb contains expected text
   * Waits for elements to be visible and checks text content
   * @param expectedTokens - Expected text tokens separated by '/' (e.g., 'Admin/User Management')
   */
  async assertHeaderOrBreadcrumbContainsAll(expectedTokens: string): Promise<void> {
    console.log(`>> Validating header/breadcrumb for: ${expectedTokens}`);
    
    // Wait for either header or breadcrumb to be visible (whichever appears first)
    console.log(`  >> Waiting for header or breadcrumb elements to be visible...`);
    try {
      await Promise.race([
        this.header.waitFor({ state: 'visible', timeout: 10000 }),
        this.breadcrumb.waitFor({ state: 'visible', timeout: 10000 })
      ]);
      console.log(`  >> Elements are now visible`);
    } catch (waitError) {
      console.log(`  >> Warning: Elements may not be visible yet`);
    }
    
    // Get text content with better error handling
    let headerText = '';
    let breadcrumbText = '';
    
    try {
      headerText = (await this.header.textContent()) || '';
      console.log(`  >> Header text: "${headerText}"`);
    } catch (headerError) {
      console.log(`  >> Warning: Could not read header text`);
    }
    
    try {
      breadcrumbText = (await this.breadcrumb.textContent()) || '';
      console.log(`  >> Breadcrumb text: "${breadcrumbText}"`);
    } catch (breadcrumbError) {
      console.log(`  >> Warning: Could not read breadcrumb text`);
    }
    
    // Combine both texts for validation
    const combined = `${headerText} ${breadcrumbText}`.trim();
    console.log(`  >> Combined text: "${combined}"`);
    
    // Wait a bit for content to fully load
    console.log(`  >> Waiting 500ms for content to stabilize...`);
    await this.page.waitForTimeout(500);
    
    // Validate each expected token
    const tokens = expectedTokens.split('/').map(t => t.trim()).filter(t => t);
    console.log(`  >> Validating ${tokens.length} token(s): [${tokens.join(', ')}]`);
    
    for (const token of tokens) {
      if (token) {
        console.log(`    >> Checking if "${combined}" contains "${token}"`);
        await expect.soft(combined).toContain(token);
        console.log(`    >> ✓ Token "${token}" found successfully`);
      }
    }
    
    console.log(`>> Header/breadcrumb validation completed for: ${expectedTokens}`);
  }
}
