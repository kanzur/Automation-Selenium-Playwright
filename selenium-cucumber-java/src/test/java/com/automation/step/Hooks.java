package com.automation.step;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class Hooks {
    public static Scenario sc;
    public static List<Map<String, String>> dataMap;
    private static final Logger log = Logger.getLogger(Hooks.class);

    @Before
    public void before(Scenario scenario) {
        sc = scenario;
        log.info("Starting Scenario: " + scenario.getName());
        // Ensure any stray apps are closed before we start to avoid confusion
        closeStrayApplications();
    }

    @After
    public void after(Scenario scenario) {
        log.info("Finished Scenario: " + scenario.getName() + " - Status: " + scenario.getStatus());
        // Best-effort cleanup after each scenario
        closeStrayApplications();
    }

    private void closeStrayApplications() {
        // Windows-specific process names; add others if needed
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win")) {
            // Kill Excel UI if open (users often leave it open and lock the file)
            bestEffortTaskkill("EXCEL.EXE");
            // Kill Chrome and driver to ensure clean state
            bestEffortTaskkill("chrome.exe");
            bestEffortTaskkill("chromedriver.exe");
        } else {
            // macOS/Linux
            bestEffortPkill("Excel");
            bestEffortPkill("chrome");
            bestEffortPkill("chromedriver");
        }
    }

    private void bestEffortTaskkill(String imageName) {
        try {
            Process p = new ProcessBuilder("cmd", "/c", "taskkill /F /IM " + imageName + " /T")
                .redirectErrorStream(true)
                .start();
            p.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
        } catch (IOException | InterruptedException ignored) { }
    }

    private void bestEffortPkill(String processName) {
        try {
            Process p = new ProcessBuilder("bash", "-lc", "pkill -f '" + processName + "'")
                .redirectErrorStream(true)
                .start();
            p.waitFor(5, TimeUnit.SECONDS);
        } catch (IOException | InterruptedException ignored) { }
    }
}


