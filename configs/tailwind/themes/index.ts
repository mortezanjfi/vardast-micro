const alphaColors = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#f0f0f0",
  300: "#d9d9d9",
  400: "#bfbfbf",
  500: "#8c8c8c",
  600: "#595959",
  700: "#434343",
  800: "#262626",
  900: "#1f1f1f",
  950: "#141414"
}

const userColors = {
  primary: {
    50: "#FEEFE9",
    100: "#FCDED3",
    200: "#FBCEBD",
    300: "#F9BDA7",
    400: "#F79D7A",
    500: "#F47C4E",
    600: "#F15B22",
    700: "#C1491B",
    800: "#913714",
    900: "#60240E",
    950: "#481B0A"
  },
  secondary: {
    50: "#EDF2F4",
    100: "#DCE4E7",
    200: "#CCD6DA",
    300: "#AAB9C0",
    400: "#899DA7",
    500: "#67808D",
    600: "#466473",
    700: "#38505C",
    800: "#2A3C45",
    900: "#1C282E",
    950: "#151E23"
  },
  alpha: alphaColors
}

const sellerColors = {
  secondary: {
    50: "#FEEFE9",
    100: "#FCDED3",
    200: "#FBCEBD",
    300: "#F9BDA7",
    400: "#F79D7A",
    500: "#F47C4E",
    600: "#F15B22",
    700: "#C1491B",
    800: "#913714",
    900: "#60240E",
    950: "#481B0A"
  },
  primary: {
    50: "#EDF2F4",
    100: "#DCE4E7",
    200: "#CCD6DA",
    300: "#AAB9C0",
    400: "#899DA7",
    500: "#67808D",
    600: "#466473",
    700: "#38505C",
    800: "#2A3C45",
    900: "#1C282E",
    950: "#151E23"
  },
  alpha: alphaColors
}

export const myColors =
  process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller"
    ? sellerColors
    : userColors

export const breakpoints = {
  xsm: 420,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920
}
export const containerPaddings = {
  DEFAULT: "0px",
  md: "20px",
  xl: "20px",
  "2xl": "20px"
}
export const containerScreens = {
  DEFAULT: "100%",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1336px",
  "2xl": "1536px",
  "3xl": "1676px"
}
export const screens = Object.fromEntries(
  Object.entries(breakpoints).map(([key, val]) => [key, `${val}px`])
)
