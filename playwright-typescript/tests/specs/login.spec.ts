import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ExcelReader } from '../../utils/ExcelReader';
import * as path from 'path';

// Helper function to normalize Excel row keys to lowercase for easy access
function normalizeRowKeys(row: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    normalized[key.trim().toLowerCase()] = row[key];
  }
  return normalized;
}

// Path to the Excel file containing test data
const excelPath = path.join(__dirname, '../../test-data/TestData.xlsx');
// Name of the sheet in Excel to read data from (case-sensitive)
const sheetName = 'Sheet1';

// Array to hold all test data rows from Excel
let testDataArray: any[] = [];
try {
  // Initialize ExcelReader and get all rows from the specified sheet
  const excel = new ExcelReader(excelPath);
  // Normalize all row keys to lowercase and filter for rows with both username and password
  testDataArray = excel.getAllTestData(sheetName)
    .map(normalizeRowKeys)
    .filter(d => d.username && d.password); // Only include rows with both fields

  // Debug: Print header and first data row for verification
  if (testDataArray.length > 0) {
    console.log('Excel header:', Object.keys(testDataArray[0]));
    console.log('First data row:', testDataArray[0]);
  }
} catch (error: any) {
  // If sheet not found, print all available sheet names for debugging
  try {
    const excel = new ExcelReader(excelPath);
    console.error(`Available sheet names: ${excel.getSheetNames().join(', ')}`);
  } catch {}
  throw error;
}

// Data-driven login tests using Playwright and Excel data
// Each row in the Excel sheet becomes a separate test
// Tags like @CT01 and @login can be used to filter these tests from CLI

test.describe('Login Data-Driven Tests', () => {
  for (const data of testDataArray) {
    test(`[@CT01][@login] Login with username: ${data.username}`, async ({ page }) => {
      // Create a new LoginPage object for each test
      const loginPage = new LoginPage(page);
      // Navigate to the login page
      await loginPage.navigateToLoginPage();
      // Perform login using data from Excel
      await loginPage.login(data.username, data.password);
      // Verify successful login
      await loginPage.verifyLoginSuccess();
    });
  }
});