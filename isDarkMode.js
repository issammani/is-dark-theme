// TODO(issam) heuristics to detect dark mode
// check color-scheme css property on body ( getComputedStyle(document.body).colorScheme
// https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
// check color-scheme meta tag
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color
// check background color of body ( with canvas )
// check if dark mode is detected in light mode
// check if dark mode is detected in dark mode
// take screenshots in light and dark mode
// compare screenshots

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");

async function takeScreenshot(page, websiteName, theme) {
  const screenshotPath = path.join(
    __dirname,
    "screenshots",
    `${websiteName}-${theme}.png`
  );
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot for ${theme} mode saved: ${screenshotPath}`);
  return screenshotPath;
}

async function compareScreenshots({ light, dark }) {
  return new Promise((resolve) => {
    const img1 = fs
      .createReadStream(light)
      .pipe(new PNG())
      .on("parsed", doneReading);
    const img2 = fs
      .createReadStream(dark)
      .pipe(new PNG())
      .on("parsed", doneReading);
    let filesRead = 0;

    function doneReading() {
      if (++filesRead < 2) return;
      const { width, height } = img1;
      const diff = new PNG({ width, height });

      const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 }
      );
      const match = numDiffPixels === 0;
      resolve(match);
    }
  });
}

async function checkWebsiteThemeSupport(website) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.18 Safari/537.36",
  });

  const page = await context.newPage();
  const websiteName = new URL(website).hostname.replace("www.", "");
  let screenshots = {};

  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(website, { waitUntil: "networkidle" });
    page.on("console", (msg) => console.log(msg.text()));
    screenshots[theme] = await takeScreenshot(page, websiteName, theme);

    const isDarkModeDetected = await page.evaluate(
      ({ websiteName, theme }) => {
        const rgbToLuminance = (r, g, b) => {
          const a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928
              ? v / 12.92
              : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        };

        // Use the canvas method to convert the background color to RGB
        const bgColor = getComputedStyle(document.body).backgroundColor;
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas); // Temporarily add canvas to body to use it
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        document.body.removeChild(canvas); // Clean up by removing the canvas

        // Calculate luminance
        const luminance = rgbToLuminance(data[0], data[1], data[2]);
        console.log(
          `[${websiteName}] Checking ${theme} mode color: ${data} lum: ${luminance}`
        );

        console.log(
          `has theme-color meta ? ${
            document.querySelector("meta[name='theme-color']")?.outerHTML
          }`
        );

        console.log(
          `has color-scheme meta ? ${
            document.querySelector("meta[name='color-scheme']")?.outerHTML
          }`
        );
        return luminance < 0.5;
      },
      { websiteName, theme }
    );

    if (theme === "light") {
      screenshots["darkThemeDetectedInLightMode"] = isDarkModeDetected
        ? "Yes"
        : "No";
    } else if (theme === "dark") {
      screenshots["darkThemeDetectedInDarkMode"] = isDarkModeDetected
        ? "Yes"
        : "No";
    }
  }

  await browser.close();
  return { compare: await compareScreenshots(screenshots), screenshots };
}

async function checkWebsites() {
  const websites = [
    "https://duckduckgo.com",
    "https://playwright.dev/",
    "https://docs.amplify.aws/",
    "https://usehooks-ts.com/",
    "https://picocss.com/",
    "https://nextjs.org/",
    "https://hurl.dev/",
    "https://chat.openai.com",
    "https://github.com",
    "https://twitter.com",
  ];

  const results = [];

  for (const website of websites) {
    console.log(`Checking ${website}...`);
    const { compare, screenshots } = await checkWebsiteThemeSupport(website);
    results.push({
      website,
      screenshotsMatch: compare ? "Yes" : "No",
      isDarkModeDetectedInLightMode: screenshots.darkThemeDetectedInLightMode,
      isDarkModeDetectedInDarkMode: screenshots.darkThemeDetectedInDarkMode,
    });
  }

  writeResultsToCSV(results);
}

function writeResultsToCSV(results) {
  const csvPath = path.join(__dirname, "website_theme_support.csv");
  const csvHeader =
    "Website,Screenshots Match, Detected ( DM ), Detected ( LM ) \n";
  const csvContent = results
    .map(
      (result) =>
        `${result.website},${result.screenshotsMatch},${result.isDarkModeDetectedInDarkMode},${result.isDarkModeDetectedInLightMode} `
    )
    .join("\n");

  fs.writeFileSync(csvPath, csvHeader + csvContent);
  console.log(`Results saved to ${csvPath}`);
}

// Ensure the screenshots directory exists
const screenshotsDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

checkWebsites();
