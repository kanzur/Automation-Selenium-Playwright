package com.automation.support;

import org.openqa.selenium.WebDriver;

import com.automation.pages.LoginPage;
import com.automation.pages.AdminPage;
import com.automation.pages.PIMPage;
import com.automation.pages.LeavePage;
import com.automation.pages.TimePage;
import com.automation.pages.RecruitmentPage;
import com.automation.pages.MyInfoPage;
import com.automation.pages.PerformancePage;
import com.automation.pages.DashboardPage;
import com.automation.pages.DirectoryPage;
import com.automation.pages.ClaimPage;
import com.automation.pages.BuzzPage;

/**
 * Ref container: holds one instance of each page object for easy access in steps.
 */
public class Ref {
    public final LoginPage login;
    public final AdminPage admin;
    public final PIMPage pim;
    public final LeavePage leave;
    public final TimePage time;
    public final RecruitmentPage recruitment;
    public final MyInfoPage myInfo;
    public final PerformancePage performance;
    public final DashboardPage dashboard;
    public final DirectoryPage directory;
    public final ClaimPage claim;
    public final BuzzPage buzz;

    public Ref(WebDriver driver) {
        this.login = new LoginPage(driver);
        this.admin = new AdminPage(driver);
        this.pim = new PIMPage(driver);
        this.leave = new LeavePage(driver);
        this.time = new TimePage(driver);
        this.recruitment = new RecruitmentPage(driver);
        this.myInfo = new MyInfoPage(driver);
        this.performance = new PerformancePage(driver);
        this.dashboard = new DashboardPage(driver);
        this.directory = new DirectoryPage(driver);
        this.claim = new ClaimPage(driver);
        this.buzz = new BuzzPage(driver);
    }
}


