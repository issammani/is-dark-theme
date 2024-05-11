# is-dark-theme

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

`is-dark-theme` is a utility to help investigate the feasibility of detecting pages in dark mode. In order to do so, the code checks the computed background color and compute the perceived brightness to determine if the color is dark or light. This utility was developed to potentially be used for WKWebview based browsers.

## Getting Started

To run this POC, ensure you have Node.js installed on your machine. Then, follow these steps:

1. Clone the repo.
2. Navigate to the project directory and install dependencies with:

```shell
npm i && npx playwright install
```

3. To run the tests, execute:

```shell
npm test
```

## How It Works

The node script at `index.js` will start a browser and navigate to different websites sepecified in the code. It will extract features from the website and attempt to determine if the website is in dark or light mode. After all tests finish, the code will output:

- a `screenshot` folder with screenshots of the websites in dark and light modes.
- a `website_theme_support.csv` that contains an analysis of the run.

## GitHub Actions Workflow

To enhance the functionality and documentation of `is-dark-theme`, a GitHub Actions workflow automates the generation of CSV data and screenshots that document the detection process in various scenarios.

**How to read the table below ?**

- The `Screenshots Match` column shows whether the screenshots taken in dark and light mode matched. A matching screenshot means that the website doesn't have built-in dark theme support ( or at least not controlled by the system theme ).
- The `DM Detected in System DM` column shows if a dark themed website was detected when the system theme was set to dark.
- The `DM Detected in System LM` column shows if a dark themed website was detected when the system theme was set to light.
- The `Expected` shows whether the result for that website is expected or not.

<!-- AUTO-GENERATED-CONTENT:START (DO_NOT_REMOVE) -->
## Test Results (Auto generated)

| Website                    | Screenshots Match   |  DM Detected in System DM   |  DM Detected in System LM   |  Expected   |
|:---------------------------|:--------------------|:----------------------------|:----------------------------|:------------|
| https://duckduckgo.com     | No                  | Yes                         | No                          | ✅           |
| https://reddit.com         | No                  | Yes                         | No                          | ✅           |
| https://openai.com/        | No                  | Yes                         | No                          | ✅           |
| https://docs.github.com/en | No                  | Yes                         | No                          | ✅           |
| https://twitter.com        | No                  | Yes                         | No                          | ✅           |
| https://cnn.com            | Yes                 | No                          | No                          | ✅           |
| https://google.com         | Yes                 | No                          | No                          | ✅           |
| https://playwright.dev/    | No                  | Yes                         | No                          | ✅           |
| https://docs.amplify.aws/  | No                  | Yes                         | No                          | ✅           |
| https://usehooks-ts.com/   | No                  | Yes                         | No                          | ✅           |
| https://picocss.com/       | No                  | Yes                         | No                          | ✅           |
| https://nextjs.org/        | No                  | Yes                         | No                          | ✅           |
| https://hurl.dev/          | No                  | Yes                         | No                          | ✅           |
| https://joshwcomeau.com    | No                  | Yes                         | No                          | ✅           |
## Screenshots

Screenshots available [here](https://github.com/issammani/is-dark-theme/actions/runs/9039486553/artifacts/1492844437).
<!-- AUTO-GENERATED-CONTENT:END -->
