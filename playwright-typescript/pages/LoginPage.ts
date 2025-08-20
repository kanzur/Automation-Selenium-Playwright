import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    private page: Page;
    private usernameField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;
    private dashboardElement: Locator;
    private errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.locator('input[name="username"]');
        this.passwordField = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.dashboardElement = page.locator('h6.oxd-text');
        this.errorMessage = page.locator('.oxd-alert-content-text');
    }

    async enterUsername(username: string): Promise<void> {
        console.log(`Entering username: ${username}`);
        await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
        await this.usernameField.clear();
        await this.usernameField.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        console.log(`Entering password: ${password}`);
        await this.passwordField.waitFor({ state: 'visible', timeout: 10000 });
        await this.passwordField.clear();
        await this.passwordField.fill(password);
    }

    async clickLoginButton(): Promise<void> {
        console.log('Clicking login button');
        await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.loginButton.click();
        
        // Wait a bit for the page to process the login
        await this.page.waitForTimeout(2000);
    }

    async isDashboardDisplayed(): Promise<boolean> {
        try {
            await this.dashboardElement.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async login(username: string, password: string): Promise<void> {
        console.log(`Attempting login with username: ${username}`);
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        
        // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToLoginPage(): Promise<void> {
        console.log('Navigating to OrangeHRM login page');
        await this.page.goto('https://opensource-demo.orangehrmlive.com/');
        // Wait for the page to load
        await this.page.waitForLoadState('networkidle');
        
        // Log current URL for debugging
        console.log(`Current URL after navigation: ${this.page.url()}`);
    }

    async verifyLoginSuccess(): Promise<void> {
        console.log('Verifying login success...');
        
        // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle');
        
        // Log current URL for debugging
        const currentUrl = this.page.url();
        console.log(`Current URL after login attempt: ${currentUrl}`);
        
        // Wait for URL to change to dashboard (with longer timeout)
        await expect(this.page).toHaveURL(/.*dashboard/, { timeout: 15000 });
        
        // Verify dashboard element is visible
        await expect(this.dashboardElement).toBeVisible({ timeout: 10000 });
        
        console.log('Login verification successful');
    }

    async verifyLoginError(): Promise<void> {
        // Try multiple possible error message selectors
        const errorSelectors = [
            '.oxd-alert-content-text',
            '.oxd-alert-content',
            '.alert-content',
            '[data-v-0bccd564]',
            '.oxd-input-field-error-message',
            '.oxd-text--toast-message'
        ];

        let errorFound = false;
        for (const selector of errorSelectors) {
            try {
                const errorElement = this.page.locator(selector);
                await errorElement.waitFor({ state: 'visible', timeout: 3000 });
                errorFound = true;
                break;
            } catch (error) {
                // Continue to next selector
            }
        }

        if (!errorFound) {
            throw new Error('No error message found with any of the expected selectors');
        }
    }

    async getErrorMessage(): Promise<string> {
        // Try multiple possible error message selectors
        const errorSelectors = [
            '.oxd-alert-content-text',
            '.oxd-alert-content',
            '.alert-content',
            '[data-v-0bccd564]',
            '.oxd-input-field-error-message',
            '.oxd-text--toast-message'
        ];

        for (const selector of errorSelectors) {
            try {
                const errorElement = this.page.locator(selector);
                await errorElement.waitFor({ state: 'visible', timeout: 3000 });
                return await errorElement.textContent() || '';
            } catch (error) {
                // Continue to next selector
            }
        }

        return 'Error message not found';
    }

    async isErrorDisplayed(): Promise<boolean> {
        try {
            await this.verifyLoginError();
            return true;
        } catch (error) {
            return false;
        }
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    async checkForValidationErrors(): Promise<boolean> {
        // Check for HTML5 validation errors
        const validationErrors = await this.page.locator('input:invalid').count();
        if (validationErrors > 0) {
            return true;
        }

        // Check for custom validation messages
        const customErrors = await this.page.locator('[class*="error"], [class*="invalid"]').count();
        if (customErrors > 0) {
            return true;
        }

        return false;
    }
} 