package com.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class PerformancePage {
    private final WebDriver driver;
    private final By tab = By.xpath("//span[normalize-space()='Performance']");
    private final By header = By.cssSelector("h6.oxd-text");
    private final By breadcrumb = By.cssSelector(".oxd-topbar-header-breadcrumb");

    public PerformancePage(WebDriver driver) { this.driver = driver; }

    public void openTab() { driver.findElement(tab).click(); }

    public boolean headerOrBreadcrumbContains(String expectedToken) {
        String h = safeGetText(header); String b = safeGetText(breadcrumb);
        return (h != null && h.contains(expectedToken)) || (b != null && b.contains(expectedToken));
    }

    private String safeGetText(By locator) { try { return driver.findElement(locator).getText(); } catch(Exception e){ return null; } }
}


