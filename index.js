// 1- TODO(issam) heuristics to detect dark mode
// check color-scheme css property on body ( getComputedStyle(document.body).colorScheme
// https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
// check color-scheme meta tag
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const resemble = require("node-resemble-js");

const injectLibrary = async (page, path) => {
  const scriptContent = fs.readFileSync(path, "utf8");
  await page.addScriptTag({ content: scriptContent });
};

const launchBrowser = async ({ colorScheme } = { colorScheme: "dark" }) => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    bypassCSP: true, // We don't want our script to be blocked by CSP
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.18 Safari/537.36",
  });

  const page = await context.newPage();
  await page.emulateMedia({ colorScheme });

  return { browser, page };
};

async function checkWebsiteThemeSupport(websiteName, colorScheme, screenshots, page) {
  screenshots[websiteName] = screenshots[websiteName] || {};
  screenshots[websiteName][colorScheme] = await takeScreenshot(page, websiteName, colorScheme);
  await injectLibrary(page, "./isDarkMode.js");
  const isDarkModeDetected = await page.evaluate(() => isPageInDarkMode());

  if (colorScheme === "light") {
    screenshots[websiteName]["darkThemeDetectedInLightMode"] = isDarkModeDetected ? "Yes" : "No";
  } else if (colorScheme === "dark") {
    screenshots[websiteName]["darkThemeDetectedInDarkMode"] = isDarkModeDetected ? "Yes" : "No";
  }
}

function writeResultsToCSV(results) {
  const csvPath = path.join(__dirname, "website_theme_support.csv");
  const csvHeader =
    "Website,Screenshots Match, DM Detected in System DM, DM Detected in System LM, Expected\n";
  const csvContent = results
    .map((result) => {
      // Implementing the detailed check for expected outcomes
      const expectedOutcome =
        (result.screenshotsMatch === "Yes" &&
          result.isDarkModeDetectedInDarkMode === "No" &&
          result.isDarkModeDetectedInLightMode === "No") ||
        (result.screenshotsMatch === "No" &&
          result.isDarkModeDetectedInDarkMode === "Yes" &&
          result.isDarkModeDetectedInLightMode === "No")
          ? "✅"
          : "❌";
      return `${result.website},${result.screenshotsMatch},${result.isDarkModeDetectedInDarkMode},${result.isDarkModeDetectedInLightMode},${expectedOutcome}`;
    })
    .join("\n");

  fs.writeFileSync(csvPath, csvHeader + csvContent);
  console.log(`Results saved to ${csvPath}`);
}

async function compareScreenshots({ light, dark }) {
  return new Promise((resolve) => {
    resemble(light)
      .compareTo(dark)
      .onComplete(function (data) {
        const match = +data.misMatchPercentage < 10; // 10% threshold
        resolve(match);
      });
  });
}

async function takeScreenshot(page, websiteName, theme) {
  const screenshotPath = path.join(__dirname, "screenshots", `${websiteName}-${theme}.png`);
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot for ${theme} mode saved: ${screenshotPath}`);
  return screenshotPath;
}

const checkWebsites = async () => {
  const websites = [
    "https://duckduckgo.com",
    "https://reddit.com",
    "https://openai.com/",
    "https://docs.github.com/en",
    "https://twitter.com",
    "https://cnn.com",
    "https://google.com",
    "https://playwright.dev/",
    "https://docs.amplify.aws/",
    "https://usehooks-ts.com/",
    "https://picocss.com/",
    "https://nextjs.org/",
    "https://hurl.dev/",
    "https://joshwcomeau.com",
  ];

  const results = [];
  const screenshots = {};
  for (const colorScheme of ["light", "dark"]) {
    const { browser, page } = await launchBrowser({ colorScheme });
    page.on("console", (msg) => console.log(msg.text()));

    for (const website of websites) {
      const websiteName = new URL(website).hostname.replace("www.", "");
      await page.goto(website, { waitUntil: "domcontentloaded" });
      await checkWebsiteThemeSupport(websiteName, colorScheme, screenshots, page);
    }
    await browser.close();
  }

  for (const website of websites) {
    const websiteName = new URL(website).hostname.replace("www.", "");
    const compare = await compareScreenshots(screenshots[websiteName]);
    results.push({
      website,
      screenshotsMatch: compare ? "Yes" : "No",
      isDarkModeDetectedInLightMode: screenshots[websiteName].darkThemeDetectedInLightMode,
      isDarkModeDetectedInDarkMode: screenshots[websiteName].darkThemeDetectedInDarkMode,
    });
  }

  writeResultsToCSV(results);
};

// Ensure the screenshots directory exists
const screenshotsDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

checkWebsites();
