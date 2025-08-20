# Automation-Selenium-Playwright

This repository contains **two automation frameworks** for testing the [OrangeHRM demo site](https://opensource-demo.orangehrmlive.com/) — one built with **Selenium + Cucumber + Java** and the other with **Playwright + TypeScript**. Both frameworks are data-driven, maintainable, and designed for modern QA practices.

---

## Table of Contents

- [Frameworks](#frameworks)
  - [Selenium-Cucumber-Java](#selenium-cucumber-java)
  - [Playwright-TypeScript](#playwright-typescript)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Data](#test-data)
- [Extending the Frameworks](#extending-the-frameworks)
- [Contributing](#contributing)
- [License](#license)

---

## Frameworks

### Selenium-Cucumber-Java

- **Language:** Java 11+
- **Test Runner:** Cucumber BDD + JUnit
- **Browser Automation:** Selenium WebDriver
- **Data Driven:** Excel using Apache POI
- **Key Features:**
  - Page Object Model (POM) for maintainable page interactions
  - Modular design for adding new features
  - Automatic closing of Excel & browser processes
  - Tags for selective test execution
  - HTML and Cucumber reports

**Project Structure:**

```
selenium-cucumber-java/
├── src/
│   ├── test/
│   │   ├── java/com/automation/
│   │   │   ├── pages/
│   │   │   ├── runner/
│   │   │   ├── stepdefs/
│   │   │   └── utils/
│   │   └── resources/
│   │       ├── features/
│   │       └── testdata/
├── pom.xml
└── README.md
```

---

### Playwright-TypeScript

- **Language:** TypeScript
- **Test Runner:** Playwright Test Runner
- **Browser Automation:** Chromium, Firefox, WebKit
- **Data Driven:** Excel
- **Key Features:**
  - Modern, fast browser automation
  - Page Object Model for maintainability
  - Parallel execution for faster test runs
  - Screenshots, videos, and trace collection
  - UI, debug, and headed modes
  - Test tagging system for selective execution

**Project Structure:**

```
playwright-typescript/
├── tests/
│   ├── specs/
│   ├── helpers/
├── pages/
├── utils/
├── test-data/
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Installation

### Selenium-Cucumber-Java

```bash
git clone https://github.com/kanzur/Automation-Selenium-Playwright.git
cd selenium-cucumber-java
mvn clean test
```

### Playwright-TypeScript

```bash
git clone https://github.com/kanzur/Automation-Selenium-Playwright.git
cd playwright-typescript
npm install
npx playwright install
```

---

## Running Tests

### Selenium

- Run all tests: `mvn clean test`
- Run tests by tag: Eg: `mvn test -Dcucumber.filter.tags="@login"`
- Run with specific browser: `mvn test -Dbrowser=chrome`

### Playwright

- Run all tests: `npx playwright test`
- Run headed mode: `npx playwright test --headed`
- Run UI mode: `npx playwright test --ui`
- Run debug mode: `npx playwright test --debug`
- Run by tag: Eg: `npx playwright test --grep @login` or `npx playwright test --grep @CT02`
- Run on specific browser: `npx playwright test --project=firefox`
- View HTML report: `npx playwright show-report`

---

## Test Data

Both frameworks use Excel files located in `testdata/` or `test-data/`.

- Sheet headers are case-insensitive.
- Example structure:

| Username | Password  |
|----------|-----------|
| Admin    | admin123  |
| User1    | user123   |

- Add new columns as needed (e.g., Name, Role).
- Tests will automatically normalize column headers for easy access.

---

## Troubleshooting

### Selenium

- **ChromeDriver mismatch** → use WebDriverManager
- **Element not found** → check locators & waits
- **Test data issues** → check Excel headers, path, and format

### Playwright

- **TypeScript errors** → ensure dependencies installed
- **Excel file not found** → verify path
- **Browser not launching** → run `npx playwright install`
- **Header mismatch** → framework normalizes headers automatically

---

## License

This project is licensed under the MIT License.
