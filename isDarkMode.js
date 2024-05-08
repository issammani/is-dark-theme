const rgbToLuminance = (r, g, b) => {
  const normalized = [r, g, b].map(function (channel) {
    channel /= 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return normalized[0] * 0.2126 + normalized[1] * 0.7152 + normalized[2] * 0.0722;
};

const colorToRgb = (color) => {
  const canvasContext = document.createElement("canvas").getContext("2d");
  canvasContext.fillStyle = color;
  canvasContext.fillRect(0, 0, 1, 1);
  const foo = canvasContext.getImageData(0, 0, 1, 1).data;
  return [...foo];
};

const colorsMatch = (color1, color2, compareAlpha = false) => {
  const [r1, g1, b1, a1] = colorToRgb(color1);
  const [r2, g2, b2, a2] = colorToRgb(color2);

  if (compareAlpha && a1 !== a2) {
    return false;
  }

  return r1 === r2 && g1 === g2 && b1 === b2;
};

const isTransparent = (color) => colorToRgb(color).at(-1) === 0;

const isPageInDarkMode = () => {
  const colorScheme = () => getComputedStyle(document.body).colorScheme;
  // const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let backgroundColor = getComputedStyle(document.body).backgroundColor;
  const documentElementBgColor = getComputedStyle(document.documentElement).backgroundColor;

  if (isTransparent(backgroundColor) && !isTransparent(documentElementBgColor)) {
    backgroundColor = documentElementBgColor;
  } else if (isTransparent(backgroundColor) && isTransparent(documentElementBgColor)) {
    backgroundColor = "white"; // Fallback to white if both are transparent.
  }

  const backgroundColorluminance = rgbToLuminance(...colorToRgb(backgroundColor));

  // const metaThemeColorContent = document.querySelector('meta[name="theme-color"]')?.content;
  // const metaBgluminance = metaThemeColorContent
  //   ? rgbToLuminance(...colorToRgb(metaThemeColorContent))
  //   : -1;
  return colorScheme() !== "light" && backgroundColorluminance < 0.5;

  // Decision logic.
  // The page is considered in dark mode if any of the following conditions are met:
  // 1. The color scheme is explicitly set to dark.
  // 2. The user prefers dark mode, and the body background luminance is low.
  // 3. The theme color's luminance is low (indicating a dark theme).
};

// export { isPageInDarkMode };
