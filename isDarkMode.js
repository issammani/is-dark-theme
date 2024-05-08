const canvasContext = document.createElement("canvas").getContext("2d");

const rgbToLuminance = (r, g, b) => {
  const normalized = [r, g, b].map(function (channel) {
    channel /= 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return normalized[0] * 0.2126 + normalized[1] * 0.7152 + normalized[2] * 0.0722;
};

const colorToRgb = (color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(0, 0, 1, 1);
  const [r, g, b] = canvasContext.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

const isPageInDarkMode = () => {
  const isDarkColorScheme = getComputedStyle(document.body).colorScheme === "dark";
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const bodyBgColor = getComputedStyle(document.body).backgroundColor;
  const bodyBgluminance = rgbToLuminance(...colorToRgb(bodyBgColor));

  const metaThemeColorContent = document.querySelector('meta[name="theme-color"]')?.content;
  const metaBgluminance = metaThemeColorContent
    ? rgbToLuminance(...colorToRgb(metaThemeColorContent))
    : 1;

  // Decision logic.
  // The page is considered in dark mode if any of the following conditions are met:
  // 1. The color scheme is explicitly set to dark.
  // 2. The user prefers dark mode, and the body background luminance is low.
  // 3. The theme color's luminance is low (indicating a dark theme).
  return isDarkColorScheme || (prefersDarkScheme && bodyBgluminance < 0.5) || metaBgluminance < 0.5;
};

// export { isPageInDarkMode };
