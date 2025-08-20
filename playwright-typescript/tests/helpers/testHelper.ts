import { Page } from '@playwright/test';
import { ExcelReader, TestData } from '../../utils/ExcelReader';
import * as path from 'path';

export class TestHelper {
    /**
     * Load test data from Excel file
     * @param fileName Excel file name in testdata directory
     * @param sheetName Sheet name to read from
     * @returns Array of test data objects
     */
    static loadTestData(fileName: string, sheetName: string = 'Sheet1'): TestData[] {
        const excelFilePath = path.join(__dirname, '../../testdata', fileName);
        const excelReader = new ExcelReader(excelFilePath);
        
        try {
            return excelReader.getAllTestData(sheetName);
        } finally {
            excelReader.close();
        }
    }

    /**
     * Wait for page to be fully loaded
     * @param page Playwright page object
     */
    static async waitForPageLoad(page: Page): Promise<void> {
        await page.waitForLoadState('networkidle');
    }

    /**
     * Take screenshot with timestamp
     * @param page Playwright page object
     * @param name Screenshot name
     */
    static async takeScreenshot(page: Page, name: string): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await page.screenshot({ path: `test-results/${name}-${timestamp}.png` });
    }

    /**
     * Validate test data has required fields (case-insensitive)
     * @param testData Test data object
     * @param requiredFields Array of required field names
     * @returns true if all required fields are present
     */
    static validateTestData(testData: TestData, requiredFields: string[]): boolean {
        return requiredFields.every(field => {
            // Check for both lowercase and uppercase versions of the field
            const value = testData[field] || testData[field.charAt(0).toUpperCase() + field.slice(1)];
            return value && value.trim() !== '';
        });
    }

    /**
     * Get test data with validation
     * @param fileName Excel file name
     * @param sheetName Sheet name
     * @param requiredFields Required fields to validate
     * @returns Validated test data array
     */
    static getValidatedTestData(fileName: string, sheetName: string = 'Sheet1', requiredFields: string[] = ['username', 'password']): TestData[] {
        const allData = this.loadTestData(fileName, sheetName);
        
        return allData.filter(data => {
            const isValid = this.validateTestData(data, requiredFields);
            if (!isValid) {
                console.warn('Skipping invalid test data:', data);
            }
            return isValid;
        });
    }
} 