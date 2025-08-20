# Playwright TypeScript Automation Framework

This is a Playwright-TypeScript automation framework mirroring the Selenium-Cucumber-Java flows against the OrangeHRM demo site. It uses Playwright's native test runner and TypeScript.

Before and after each test run, the framework automatically closes Excel and Chrome processes to avoid confusion if those apps were open, and to prevent file locks on Excel test data.

## Project Structure

```
playwright-typescript/
├── tests/
│   ├── specs/              # Test spec files (feature-based, data-driven)
│   ├── helpers/            # Test helper utilities
│   └── ...
├── pages/                  # Page Object Models
│   └── LoginPage.ts
├── utils/                  # Utility classes (ExcelReader, etc.)
│   └── ExcelReader.ts
├── test-data/              # Test data files (Excel, JSON, etc.)
│   └── TestData.xlsx
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Node.js dependencies
└── README.md
```

## Features

- **Playwright**: Modern browser automation with excellent performance
- **TypeScript**: Type-safe development with better IDE support
- **Page Object Model**: Maintainable and reusable page objects
- **Excel Data Driven**: Read test data from Excel files (case-insensitive header mapping)
- **Cross-browser Support**: Run tests on multiple browsers
- **Screenshots & Videos**: Automatic capture on failures
- **Parallel Execution**: Run tests in parallel for faster execution
- **Modular Test Design**: Easily add new test files and data fields

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Test Tagging System
The framework uses a consistent tagging system for selective test execution:

- **`@CT01`** - Login test case identifier
- **`@login`** - Login feature identifier  
- **`@CT02`** - Tabs test case identifier
- **`@tabs`** - Tabs feature identifier

### Run all tests:
```bash
npx playwright test
```

### Run tests in headed mode:
```bash
npx playwright test --headed
```

### Run tests with UI mode:
```bash
npx playwright test --ui
```

### Run tests in debug mode:
```bash
npx playwright test --debug
```

### View test reports:
```bash
npx playwright show-report

### Important
- Global setup/teardown will best-effort close EXCEL/Chrome processes on your OS. On Windows this uses `taskkill`; on macOS/Linux it uses `pkill`.
```

### Run tests on specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests by tag:
```bash
# Run login tests only
npx playwright test --grep @login
npx playwright test --grep @CT01

# Run tabs tests only  
npx playwright test --grep @tabs
npx playwright test --grep @CT02

# Run multiple test types
npx playwright test --grep "@login|@tabs"
npx playwright test --grep "@CT01|@CT02"

# Run all tests
npx playwright test
```

## Test Data

The framework reads test data from Excel files located in the `test-data/` directory. The Excel file should have the following structure:

| Username | Password |
|----------|----------|
| Admin    | admin123 |
| User1    | user123  |

- **Sheet name**: Use the actual sheet name (e.g., `Sheet1`).
- **Header row**: Can be any case (e.g., `Username`, `username`, `USERNAME`). The framework normalizes headers to lowercase for easy access.
- **Add new columns**: You can add new columns (e.g., `Name`, `Role`) at any time. Each test file can use only the columns it needs.

## Extending the Framework

### Adding New Data Fields
- Add new columns to your Excel file (e.g., `Name`, `Role`, etc.).
- The normalization utility ensures you can always access them as `data.name`, `data.role`, etc., in your test files.

### Creating New Data-Driven Test Files
- Create a new test file in `tests/specs/` (e.g., `name.spec.ts`).
- Use the normalization utility to access any column in lowercase.
- Filter your test data for the fields you need (e.g., `data.name`).

### Example: Data-Driven Test File
```typescript
import { test } from '@playwright/test';
import { ExcelReader } from '../../utils/ExcelReader';
import * as path from 'path';

function normalizeRowKeys(row: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    normalized[key.trim().toLowerCase()] = row[key];
  }
  return normalized;
}

const excelPath = path.join(__dirname, '../../test-data/TestData.xlsx');
const sheetName = 'Sheet1';

let testDataArray: any[] = [];
try {
  const excel = new ExcelReader(excelPath);
  testDataArray = excel.getAllTestData(sheetName)
    .map(normalizeRowKeys)
    .filter(d => d.name); // Only rows with a name
} catch (error: any) {
  try {
    const excel = new ExcelReader(excelPath);
    console.error(`Available sheet names: ${excel.getSheetNames().join(', ')}`);
  } catch {}
  throw error;
}

test.describe('Name Data-Driven Tests', () => {
  for (const data of testDataArray) {
    test(`Test with name: ${data.name}`, async ({ page }) => {
      // Your test logic using data.name, data.username, etc.
    });
  }
});
```

## Configuration

### Playwright Configuration (`playwright.config.ts`)
- Configures test directory and parallel execution
- Adds `globalSetup` and `globalTeardown` to close Excel/Chrome processes before/after tests
- Sets up multiple browser projects (Chrome, Firefox, Safari)
- Configures screenshots, videos, and traces
- Sets up HTML, JSON, and JUnit reporting

### TypeScript Configuration (`tsconfig.json`)
- Enables strict type checking
- Configures module resolution
- Sets up proper type definitions for Playwright

## Key Components

### LoginPage.ts
Page Object Model for the OrangeHRM login page with methods for:
- Entering username and password
- Clicking login button
- Verifying successful login
- Handling error messages
- Navigating to login page

### ExcelReader.ts
Utility class for reading Excel files with methods for:
- Reading individual rows
- Reading all test data
- Validating data integrity
- Error handling
- Getting sheet information
- **Normalizes headers for case-insensitive access**

### testHelper.ts
Test helper utilities for:
- Loading and validating test data
- Taking screenshots with timestamps
- Waiting for page loads
- Common test operations

### login.spec.ts
Main test file that:
- Loads test data from Excel
- Runs login tests with multiple data sets
- Handles error scenarios
- Takes screenshots for debugging
- Validates test results
- **Uses normalization utility for robust data access**
- **Tagged with `@CT01` and `@login` for selective execution**

### tabs.spec.ts
Mirrors the Selenium `tabs.feature` scenario in Playwright:
- Uses Excel credentials like login.spec.ts
- Navigates through all OrangeHRM modules after login
- Asserts header/breadcrumb text across modules
- **Tagged with `@CT02` and `@tabs` for selective execution**
- Some tabs (e.g., Recruitment) may be hidden depending on UI/role; the test handles this gracefully

## Troubleshooting

### Common Issues

1. **TypeScript compilation errors**: Ensure all dependencies are installed
2. **Excel file not found**: Check the path in test files
3. **Browser not launching**: Run `npx playwright install`
4. **Test data not loading**: Verify Excel file structure and sheet names
5. **Header mismatch**: Use the normalization utility to avoid case issues

### Debug Mode

Run tests in debug mode:
```bash
npx playwright test --debug
```

### View Test Results

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Contributing

1. Follow TypeScript best practices
2. Use Page Object Model pattern
3. Write descriptive test names
4. Add proper error handling
5. Update documentation as needed
6. Add screenshots for debugging
7. Use TestHelper for common operations

## License

This project is licensed under the MIT License. 