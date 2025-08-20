package com.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class RecruitmentPage {
    private final WebDriver driver;
    private final By tab = By.xpath("//a[contains(@href,'viewRecruitmentModule')] | //span[normalize-space()='Recruitment']");
    private final By header = By.cssSelector("h6.oxd-text");
    private final By breadcrumb = By.cssSelector(".oxd-topbar-header-breadcrumb");

    public RecruitmentPage(WebDriver driver) { this.driver = driver; }

    public void openTab() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(tab));
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


