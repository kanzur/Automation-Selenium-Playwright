package com.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LeavePage {
    private final WebDriver driver;
    private final By header = By.cssSelector("h6.oxd-text");
    private final By breadcrumb = By.cssSelector(".oxd-topbar-header-breadcrumb");

    public LeavePage(WebDriver driver) { this.driver = driver; }

    public void openTab() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        // Try multiple selectors to be resilient across UI updates/side menu
        By[] candidates = new By[] {
            By.xpath("//span[normalize-space()='Leave']"),
            By.xpath("//a[contains(@href,'leave')]"),
            By.xpath("//aside//span[normalize-space()='Leave']"),
            By.cssSelector("a.oxd-main-menu-item[href*='leave']"),
        };
        WebElement element = null;
        for (By by : candidates) {
            try {
                element = wait.until(ExpectedConditions.presenceOfElementLocated(by));
                if (element != null) break;
            } catch (Exception ignored) { }
        }
        if (element == null) {
            throw new RuntimeException("Leave tab not found using known selectors");
        }
        try {
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
        } catch (Exception ignored) { }
        try {
            wait.until(ExpectedConditions.elementToBeClickable(element)).click();
        } catch (Exception e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        }
    }

    public boolean headerOrBreadcrumbContains(String expectedToken) {
        String h = safeGetText(header); String b = safeGetText(breadcrumb);
        return (h != null && h.contains(expectedToken)) || (b != null && b.contains(expectedToken));
    }

    private String safeGetText(By locator) { try { return driver.findElement(locator).getText(); } catch(Exception e){ return null; } }
}


