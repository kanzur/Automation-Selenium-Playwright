package com.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AdminPage {
    private final WebDriver driver;
    private final By tabAdmin = By.xpath("//span[normalize-space()='Admin']");
    private final By header = By.cssSelector("h6.oxd-text");
    private final By breadcrumb = By.cssSelector(".oxd-topbar-header-breadcrumb");

    public AdminPage(WebDriver driver) {
        this.driver = driver;
    }

    public void openTab() {
        driver.findElement(tabAdmin).click();
    }

    public boolean headerOrBreadcrumbContains(String expectedToken) {
        String h = safeGetText(header);
        String b = safeGetText(breadcrumb);
        return (h != null && h.contains(expectedToken)) || (b != null && b.contains(expectedToken));
    }

    private String safeGetText(By locator) {
        try {
            return driver.findElement(locator).getText();
        } catch (Exception e) {
            return null;
        }
    }
}


