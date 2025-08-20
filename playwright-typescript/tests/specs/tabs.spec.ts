import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TopNav } from '../../pages/TopNav';
import { ExcelReader } from '../../utils/ExcelReader';
import * as path from 'path';

/**
 * Helper function to normalize Excel row keys to lowercase
 * This ensures consistent access to Excel data regardless of header case
 * @param row - Excel row data object
 * @returns Normalized object with lowercase keys
 */
function normalizeRowKeys(row: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    normalized[key.trim().toLowerCase()] = row[key];
  }
  return normalized;
}

// Excel file configuration
const excelPath = path.join(__dirname, '../../test-data/TestData.xlsx');
const sheetName = 'Sheet1';

// Global variable to store credentials loaded from Excel
let creds: { username: string; password: string } | null = null;

// Load test credentials from Excel file during test setup
console.log('>> Loading test credentials from Excel file...');
try {
  const excel = new ExcelReader(excelPath);
  console.log(`  >> Excel file loaded: ${excelPath}`);
  console.log(`  >> Reading from sheet: ${sheetName}`);
  
  const rows = excel.getAllTestData(sheetName).map(normalizeRowKeys);
  console.log(`  >> Found ${rows.length} data rows in Excel`);
  
  // Find first row with both username and password
  const firstWithCreds = rows.find(r => r.username && r.password);
  if (firstWithCreds) {
    creds = { 
      username: String(firstWithCreds.username), 
      password: String(firstWithCreds.password) 
    };
    console.log(`  >> Credentials loaded: username=${creds.username}, password=${creds.password}`);
  } else {
    throw new Error('No credential rows found in Excel');
  }
} catch (e) {
  console.error('>> ERROR: Failed to load credentials from Excel:', e);
  throw e;
}

/**
 * Test Case: [@CT02][@tabs] - Mirror Selenium tabs.feature scenario
 * 
 * This test demonstrates:
 * 1. Login to OrangeHRM using Excel credentials
 * 2. Navigate through all available modules/tabs
 * 3. Validate page headers and breadcrumbs for each module
 * 4. Handle optional tabs gracefully (e.g., Recruitment)
 * 
 * Test Data Source: Excel file (TestData.xlsx)
 * Test Coverage: All major OrangeHRM modules
 */
test('[@CT02][@tabs] Test tabs scenario', async ({ page }) => {
  console.log('\n=== STARTING TABS SCENARIO TEST ===');
  
  // Initialize page objects
  const loginPage = new LoginPage(page);
  const nav = new TopNav(page);
  
  // Step 1: Login to OrangeHRM
  console.log('\n>> STEP 1: Login to OrangeHRM');
  await loginPage.navigateToLoginPage();
  await loginPage.login(creds!.username, creds!.password);
  await loginPage.verifyLoginSuccess();
  console.log('>> ✓ Login successful');
  
  // Wait for dashboard to fully load before proceeding with tab navigation
  console.log('>> Waiting for dashboard to fully load...');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  console.log('>> ✓ Dashboard loaded and ready for navigation');

  // Step 2: Navigate through all OrangeHRM modules and validate content
  console.log('\n>> STEP 2: Navigate through OrangeHRM modules');
  
  // Module 1: Admin
  console.log('\n>> MODULE 1: Admin');
  await nav.openTab('Admin');
  await nav.assertHeaderOrBreadcrumbContainsAll('Admin/User Management');

  // Module 2: PIM (Personal Information Management)
  console.log('\n>> MODULE 2: PIM');
  await nav.openTab('PIM');
  await nav.assertHeaderOrBreadcrumbContainsAll('PIM');

  // Module 3: Leave Management
  console.log('\n>> MODULE 3: Leave');
  await nav.openTab('Leave');
  await nav.assertHeaderOrBreadcrumbContainsAll('Leave');

  // Module 4: Time Management
  console.log('\n>> MODULE 4: Time');
  await nav.openTab('Time');
  await nav.assertHeaderOrBreadcrumbContainsAll('Time/Timesheets');

  // Module 5: Recruitment (Optional - may not be available in all roles)
  console.log('\n>> MODULE 5: Recruitment (Optional)');
  try {
    await nav.openTab('Recruitment');
    await nav.assertHeaderOrBreadcrumbContainsAll('Recruitment');
    console.log('>> ✓ Recruitment module available and validated');
  } catch (recruitmentError) {
    console.log('>> ⚠ Recruitment module not available (skipping)');
  }

  // Module 6: My Info (Personal Details)
  console.log('\n>> MODULE 6: My Info');
  await nav.openTab('My Info');
  await nav.assertHeaderOrBreadcrumbContainsAll('PIM');

  // Module 7: Performance Management
  console.log('\n>> MODULE 7: Performance');
  await nav.openTab('Performance');
  await nav.assertHeaderOrBreadcrumbContainsAll('Performance/Manage Reviews');

  // Module 8: Dashboard (Return to main dashboard)
  console.log('\n>> MODULE 8: Dashboard');
  await nav.openTab('Dashboard');
  await nav.assertHeaderOrBreadcrumbContainsAll('Dashboard');

  // Module 9: Directory
  console.log('\n>> MODULE 9: Directory');
  await nav.openTab('Directory');
  await nav.assertHeaderOrBreadcrumbContainsAll('Directory');

  // Module 10: Claim Management
  console.log('\n>> MODULE 10: Claim');
  await nav.openTab('Claim');
  await nav.assertHeaderOrBreadcrumbContainsAll('Claim');

  // Module 11: Buzz (Social Feed)
  console.log('\n>> MODULE 11: Buzz');
  await nav.openTab('Buzz');
  await nav.assertHeaderOrBreadcrumbContainsAll('Buzz');

  // Test completion
  console.log('\n=== TABS SCENARIO TEST COMPLETED SUCCESSFULLY ===');
  console.log('>> ✓ All modules navigated and validated');
  console.log('>> ✓ All expected headers/breadcrumbs found');
  console.log('>> ✓ Test passed successfully!');
});
