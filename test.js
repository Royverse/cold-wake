const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const screenshotPath = path.join(process.env.USERPROFILE, '.gemini/antigravity/brain/fd115753-66fd-467a-b9b0-e19881d95047/screenshot.png');
  console.log("Will save to:", screenshotPath);
  console.log("Launching browser...");
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[Browser Error] ${err.message}`));

  console.log("Navigating to game...");
  try {
    await page.goto('http://localhost:8712/single.html?v=27', { waitUntil: 'load', timeout: 10000 });
  } catch (e) {
    console.log("Goto failed:", e.message);
  }

  await page.waitForTimeout(2000);

  console.log("Looking for deploy button...");
  try {
    const btn = await page.locator('#btn-deploy');
    if (await btn.isVisible()) {
      console.log("Clicking deploy...");
      await btn.click({ timeout: 5000 });
    }
  } catch (e) {
    console.log("Could not click deploy button:", e.message);
  }

  console.log("Playing for a few seconds...");
  await page.waitForTimeout(4000);

  console.log(`Taking screenshot: ${screenshotPath}`);
  try {
    await page.screenshot({ path: screenshotPath, timeout: 10000 });
  } catch (e) {
    console.log("Screenshot failed:", e.message);
  }

  await browser.close();
  console.log("Done.");
})();
