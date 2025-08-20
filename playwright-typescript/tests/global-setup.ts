import type { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

function killProcesses(): void {
  const platform = process.platform; // 'win32' | 'darwin' | 'linux'
  try {
    if (platform === 'win32') {
      // Close Excel UI if open, Chrome and drivers
      execSync('taskkill /F /IM EXCEL.EXE /T', { stdio: 'ignore' });
      execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
      execSync('taskkill /F /IM chromedriver.exe /T', { stdio: 'ignore' });
    } else {
      // macOS/Linux best-effort
      execSync("pkill -f 'Excel' || true", { stdio: 'ignore', shell: '/bin/bash' });
      execSync("pkill -f 'chrome' || true", { stdio: 'ignore', shell: '/bin/bash' });
      execSync("pkill -f 'chromedriver' || true", { stdio: 'ignore', shell: '/bin/bash' });
    }
  } catch {
    // Ignore failures; best-effort cleanup
  }
}

async function globalSetup(config: FullConfig) {
  killProcesses();
}

export default globalSetup;
