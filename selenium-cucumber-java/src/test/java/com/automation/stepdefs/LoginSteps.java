package com.automation.stepdefs;

import java.io.IOException;
import java.util.Map;

import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;
import com.automation.utils.ExcelReader;
import com.automation.pages.LoginPage;

public class LoginSteps {
    WebDriver driver;
    LoginPage loginPage;
    Map<String, String> testData;

    @Before
    public void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        loginPage = new LoginPage(driver);
    }

    @Given("user is on the OrangeHRM login page")
    public void user_is_on_login_page() {
        driver.get("https://opensource-demo.orangehrmlive.com/");
    }

    @When("user enters valid credentials")
    public void user_enters_valid_credentials() throws IOException {
        // Read all test data from Excel file and run tests for each data row
        String excelFilePath = "src/test/resources/testdata/TestData.xlsx";
        ExcelReader excelReader = new ExcelReader(excelFilePath);
        
        try {
            // Get all data rows from Excel (skip header row)
            java.util.List<Map<String, String>> allTestData = getAllTestDataFromExcel(excelReader);
            
            if (allTestData.isEmpty()) {
                throw new RuntimeException("No test data found in Excel file");
            }
            
            // Run test for each data row
            for (int i = 0; i < allTestData.size(); i++) {
                testData = allTestData.get(i);
                System.out.println("Testing with data row " + (i + 1) + ": " + testData);
                
                // Extract username and password from Excel data (case-insensitive)
                String username = testData.get("username") != null ? testData.get("username") : testData.get("Username");
                String password = testData.get("password") != null ? testData.get("password") : testData.get("Password");
                
                // Validate that we have the required data
                if (username == null || username.isEmpty()) {
                    throw new RuntimeException("Username not found in data row " + (i + 1) + ". Available keys: " + testData.keySet());
                }
                if (password == null || password.isEmpty()) {
                    throw new RuntimeException("Password not found in data row " + (i + 1) + ". Available keys: " + testData.keySet());
                }
                
                loginPage.login(username, password);
                
                // Verify login was successful
                Assert.assertTrue("Dashboard URL not found", driver.getCurrentUrl().contains("/dashboard"));
                Assert.assertTrue("Dashboard element not displayed", loginPage.isDashboardDisplayed());
                
                // If we have more data rows, navigate back to login page for next iteration
                if (i < allTestData.size() - 1) {
                    driver.get("https://opensource-demo.orangehrmlive.com/");
                }
            }
        } finally {
            excelReader.close();
        }
    }



    /**
     * Helper method to read all test data from Excel file (skips header row)
     * @param excelReader The ExcelReader instance
     * @return List of Maps containing all test data
     */
    private java.util.List<Map<String, String>> getAllTestDataFromExcel(ExcelReader excelReader) throws IOException {
        java.util.List<Map<String, String>> allTestData = new java.util.ArrayList<>();
        
        try {
            // Get the sheet
            org.apache.poi.ss.usermodel.Sheet sheet = excelReader.getWorkbook().getSheet("Sheet1");
            
            if (sheet == null) {
                throw new RuntimeException("Sheet 'Sheet1' not found in Excel file");
            }
            
            // Start from row 1 (skip header row 0) and read all data rows
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                org.apache.poi.ss.usermodel.Row row = sheet.getRow(rowIndex);
                if (row != null) {
                    Map<String, String> rowData = excelReader.getRowData("Sheet1", rowIndex);
                    // Only add rows that have actual data (not empty)
                    if (!rowData.isEmpty() && hasValidData(rowData)) {
                        allTestData.add(rowData);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error reading Excel data: " + e.getMessage(), e);
        }
        
        return allTestData;
    }
    
    /**
     * Helper method to check if a row has valid data
     * @param rowData The row data to validate
     * @return true if the row has valid data
     */
    private boolean hasValidData(Map<String, String> rowData) {
        String username = rowData.get("username") != null ? rowData.get("username") : rowData.get("Username");
        String password = rowData.get("password") != null ? rowData.get("password") : rowData.get("Password");
        return username != null && !username.isEmpty() && password != null && !password.isEmpty();
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
} 