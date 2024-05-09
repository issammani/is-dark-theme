# is-dark-theme

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

is-dark-theme is a utility to help investigate the feasibility of detecting pages in dark mode. We check the computed background color and compute the perceived brightness to determine if the color is dark or light. This utility was developed to potentially be used for WKWebview based browsers.

<!-- ## Data and Visualizations

Below is a table generated from the latest CSV data, showing examples of theme detection results:

| URL                | Computed Background | Perceived Brightness | Is Dark? |
| ------------------ | ------------------- | -------------------- | -------- |
| `example.com`      | `#000000`           | Low                  | Yes      |
| `another-site.com` | `#FFFFFF`           | High                 | No       |

Visualizations of the theme detection can be viewed through the following links:

- [View Screenshots](https://github.com/user/repo/actions/runs/123456/artifacts/789123) -->

## How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/is-dark-theme.git
   cd is-dark-theme
   ```
2. Install dependencies
   ```bash
   npm i
   ```
3. Run the test
   ```bash
   npm test
   ```
   This will take a bit of time, but after it's finished, a `screenshot` folder will be generated with screenshots of the websites in dark and light modes. `website_theme_support.csv` will also be generated and contain an analysis about that run.

## GitHub Actions Workflow

To enhance the functionality and documentation of `is-dark-theme`, a GitHub Actions workflow automates the generation of CSV data and screenshots that document the detection process in various scenarios.

## Data Table

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

Screenshots available [here]().