# Selenium Cucumber Java Automation Framework

This is a Selenium WebDriver automation framework using Cucumber BDD and Java. The framework is designed to test web applications with a focus on maintainability, reusability, and data-driven testing.

## Project Structure

```
selenium-cucumber-java/
├── src/
│   ├── test/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── automation/
│   │   │           ├── pages/          # Page Object Model classes
│   │   │           ├── runner/         # Test runner classes
│   │   │           ├── stepdefs/       # Cucumber step definitions
│   │   │           └── utils/          # Utility classes (ExcelReader, etc.)
│   │   └── resources/
│   │       ├── features/               # Cucumber feature files
│   │       └── testdata/               # Test data files (Excel, etc.)
├── pom.xml                             # Maven configuration
└── README.md
```

## Features

- **Selenium WebDriver 4.21.0**: Latest version with improved performance
- **Cucumber BDD**: Behavior Driven Development approach
- **Page Object Model**: Maintainable and reusable page objects
- **WebDriverManager**: Automatic driver management
- **JUnit 4**: Test execution framework
- **Apache POI**: Excel file reading capabilities for data-driven testing
- **Chrome WebDriver**: Cross-platform browser automation
- **Modular Test Design**: Easily add new feature files and data fields

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- Chrome browser installed

## Dependencies

- **Selenium WebDriver**: 4.21.0
- **Cucumber**: 7.15.0
- **JUnit**: 4.13.2
- **WebDriverManager**: 5.6.2
- **Apache POI**: 5.2.3

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd selenium-cucumber-java
```

### 2. Run Tests
```bash
# Run all tests
mvn clean test

# Run specific tags
mvn test -Dcucumber.filter.tags="@login"

# Run with specific browser
mvn test -Dbrowser=chrome
```

### 3. View Reports
After test execution, HTML reports are generated in:
```
target/cucumber-reports.html
```

## Test Structure

### Feature Files
Located in `src/test/resources/features/`
- Written in Gherkin syntax
- Describe test scenarios in business language
- Support for tags and scenario outlines

### Step Definitions
Located in `src/test/java/com/automation/stepdefs/`
- Implement the steps defined in feature files
- Handle test logic and assertions
- Use Page Object Model for element interactions

### Page Objects
Located in `src/test/java/com/automation/pages/`
- Encapsulate page elements and actions
- Provide reusable methods for page interactions
- Follow Page Object Model pattern

### Test Runner
Located in `src/test/java/com/automation/runner/`
- Configure Cucumber execution
- Define feature and step definition locations
- Set up reporting and tags

## Configuration

### Browser Configuration
The framework supports multiple browsers through WebDriverManager:
- Chrome (default)
- Firefox
- Edge

### Test Data
Test data can be managed through:
- Excel files (using Apache POI)
- Properties files
- JSON files
- Database connections

#### Excel Data-Driven Testing
- Place your Excel files in `src/test/resources/testdata/`.
- Use the provided `ExcelReader` utility to read data for your tests.
- **Headers can be any case** (e.g., `Username`, `username`).
- You can add new columns (e.g., `Name`, `Role`) at any time.
- Each step definition or page object can access only the columns it needs.

#### Example: Reading Excel Data in Step Definitions
```java
ExcelReader reader = new ExcelReader("src/test/resources/testdata/TestData.xlsx");
List<Map<String, String>> data = reader.getData("Sheet1");
String username = data.get(0).get("Username"); // Case-insensitive access
```

## Extending the Framework

### Adding New Data Fields
- Add new columns to your Excel file (e.g., `Name`, `Role`, etc.).
- The `ExcelReader` utility allows you to access any column by name.
- Update your step definitions or page objects to use new fields as needed.

### Creating New Feature Files
- Add new `.feature` files in `src/test/resources/features/` for new scenarios.
- Implement corresponding step definitions in `stepdefs/`.
- Use tags to organize and filter tests.

## Best Practices

1. **Page Object Model**: Use page objects to encapsulate page elements
2. **Explicit Waits**: Use WebDriverWait for reliable element interactions
3. **Test Data Management**: Separate test data from test logic
4. **Error Handling**: Implement proper exception handling
5. **Reporting**: Generate comprehensive test reports
6. **Tags**: Use Cucumber tags for test organization
7. **Modular Design**: Add new data fields and feature files without breaking existing tests

## Troubleshooting

### Common Issues

1. **ChromeDriver Version Mismatch**
   - Solution: WebDriverManager automatically handles driver versions
   - Update Chrome browser if needed

2. **Element Not Found**
   - Check if element selectors are correct
   - Verify page has loaded completely
   - Use explicit waits for dynamic elements

3. **Test Data Issues**
   - Verify Excel file format and data
   - Check file paths and permissions
   - Ensure proper data types
   - **Check for header case and extra spaces**

4. **Adding New Data Fields**
   - Add new columns to Excel and update your code to use them as needed

## Contributing

1. Follow the existing code structure
2. Add proper comments and documentation
3. Write unit tests for new utilities
4. Update README for new features

## License

This project is licensed under the MIT License. 