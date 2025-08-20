package com.automation.step;

import java.io.IOException;
import java.util.Map;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import com.automation.support.Ref;
import com.automation.utils.ExcelReader;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.github.bonigarcia.wdm.WebDriverManager;

public class Steps {
    private static final Logger log = Logger.getLogger(Steps.class);

    WebDriver driver;
    Ref ref;
    Map<String, String> testData;
    ExcelReader excelReader;

    // Ref holds all page objects

    @Before
    public void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        ref = new Ref(driver);

        log.info("WebDriver initialized and page objects created");
    }

    @Given("user is on the OrangeHRM login page")
    public void user_is_on_the_orange_hrm_login_page() {
        System.out.println(">> Navigate: OrangeHRM login page");
        driver.get("https://opensource-demo.orangehrmlive.com/");
    }

    @When("user enters valid credentials")
    public void user_enters_valid_credentials() {
        System.out.println(">> Read credentials from Excel and login");
        ensureTestDataLoaded();
        String username = getValueIgnoreCase(testData, "Username", "UserName", "USER_NAME");
        String password = getValueIgnoreCase(testData, "Password", "PASS", "PWD");
        ref.login.login(username, password);
        Assert.assertTrue("Dashboard should be displayed after login", ref.login.isDashboardDisplayed());
    }

    // Click steps
    @And("user clicks Admin tab")
    public void user_clicks_admin_tab() {
        System.out.println(">> Click: Admin tab");
        ref.admin.openTab();
    }

    @And("user clicks PIM tab")
    public void user_clicks_pim_tab() {
        System.out.println(">> Click: PIM tab");
        ref.pim.openTab();
    }

    @And("user clicks Leave tab")
    public void user_clicks_leave_tab() {
        System.out.println(">> Click: Leave tab");
        ref.leave.openTab();
    }

    @And("user clicks Time tab")
    public void user_clicks_time_tab() {
        System.out.println(">> Click: Time tab");
        ref.time.openTab();
    }

    @And("user clicks Recruitment tab")
    public void user_clicks_recruitment_tab() {
        System.out.println(">> Click: Recruitment tab");
        ref.recruitment.openTab();
    }

    @And("user clicks My Info tab")
    public void user_clicks_my_info_tab() {
        System.out.println(">> Click: My Info tab");
        ref.myInfo.openTab();
    }

    @And("user clicks Performance tab")
    public void user_clicks_performance_tab() {
        System.out.println(">> Click: Performance tab");
        ref.performance.openTab();
    }

    @And("user clicks Dashboard tab")
    public void user_clicks_dashboard_tab() {
        System.out.println(">> Click: Dashboard tab");
        ref.dashboard.openTab();
    }

    @And("user clicks Directory tab")
    public void user_clicks_directory_tab() {
        System.out.println(">> Click: Directory tab");
        ref.directory.openTab();
    }

    @And("user clicks Claim tab")
    public void user_clicks_claim_tab() {
        System.out.println(">> Click: Claim tab");
        ref.claim.openTab();
    }

    @And("user clicks Buzz tab")
    public void user_clicks_buzz_tab() {
        System.out.println(">> Click: Buzz tab");
        ref.buzz.openTab();
    }

    // Assertion step (parameterized)
    @Then("^tab title must be as (.+)$")
    public void tab_title_must_be_as(String expected) {
        assertHeaderOrBreadcrumbContainsAllTokens(expected);
    }

    private void assertHeaderOrBreadcrumbContainsAllTokens(String expected) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        // Wait for either header or breadcrumb to be visible
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector("h6.oxd-text")),
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".oxd-topbar-header-breadcrumb"))
            ));
        } catch (Exception ignored) { }

        String headerText = safeGetText(By.cssSelector("h6.oxd-text"));
        String breadcrumbText = safeGetText(By.cssSelector(".oxd-topbar-header-breadcrumb"));
        String combined = (headerText == null ? "" : headerText) + " " + (breadcrumbText == null ? "" : breadcrumbText);

        for (String token : expected.split("/")) {
            String trimmed = token.trim();
            Assert.assertTrue("Expected token not found in header/breadcrumb: " + trimmed + " Actual: " + combined,
                combined.contains(trimmed));
        }
    }

    private String safeGetText(By locator) {
        try { return driver.findElement(locator).getText(); } catch (Exception e) { return null; }
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
            log.info("WebDriver closed");
        }
        if (excelReader != null) {
            try { excelReader.close(); } catch (IOException ignored) {}
        }
    }

    private void ensureTestDataLoaded() {
        if (testData != null) return;
        try {
            String sheet = System.getProperty("excel.sheet", "Sheet1");
            int rowIndex = Integer.parseInt(System.getProperty("excel.row", "1"));

            String resourcePath = "testdata/TestData.xlsx";
            java.net.URL url = Thread.currentThread().getContextClassLoader().getResource(resourcePath);
            if (url == null) {
                throw new IllegalStateException("Cannot find Excel resource: " + resourcePath);
            }
            java.nio.file.Path path = java.nio.file.Paths.get(url.toURI());
            excelReader = new ExcelReader(path.toFile().getAbsolutePath());
            // Try requested sheet; if missing, fallback to first sheet
            org.apache.poi.ss.usermodel.Sheet poiSheet = excelReader.getWorkbook().getSheet(sheet);
            if (poiSheet == null) {
                String fallback = excelReader.getWorkbook().getSheetAt(0).getSheetName();
                System.out.println(">> Sheet '" + sheet + "' not found. Falling back to first sheet: '" + fallback + "'");
                sheet = fallback;
            }
            testData = excelReader.getRowData(sheet, rowIndex);
            System.out.println(">> Loaded test data from sheet '" + sheet + "' row " + rowIndex + ": " + testData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load test data from Excel: " + e.getMessage(), e);
        }
    }

    private String getValueIgnoreCase(Map<String, String> map, String... candidateKeys) {
        if (map == null) return null;
        // Exact match first
        for (String k : candidateKeys) {
            if (map.containsKey(k)) return map.get(k);
        }
        // Case-insensitive fallback
        for (Map.Entry<String, String> entry : map.entrySet()) {
            for (String k : candidateKeys) {
                if (entry.getKey() != null && entry.getKey().equalsIgnoreCase(k)) {
                    return entry.getValue();
                }
            }
        }
        throw new IllegalArgumentException("None of the keys " + java.util.Arrays.toString(candidateKeys) + " found in test data: " + map.keySet());
    }
} 