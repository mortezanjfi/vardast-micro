/** @type {import('tailwindcss').Config} */

import tailwindColors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"

import {
  containerPaddings,
  containerScreens,
  myColors,
  screens
} from "./themes"

const tailwind = {
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    "bg-error-50",
    "border-error-100",
    "bg-info-50",
    "border-info-100",
    "bg-success-50",
    "border-success-100",
    "bg-warning",
    "bg-error",
    "bg-success",
    "bg-alpha",
    "bg-red",
    "bg-blue",
    "bg-info",
    "bg-warning-600",
    "bg-error-600",
    "bg-success-600",
    "bg-alpha-600",
    "bg-red-600",
    "bg-blue-600",
    "bg-info-600",
    "bg-warning-100",
    "bg-error-100",
    "bg-success-100",
    "bg-alpha-100",
    "bg-red-100",
    "bg-blue-100",
    "bg-info-100",
    "text-warning-600",
    "text-error-600",
    "text-success-600",
    "text-alpha-600",
    "text-red-600",
    "text-blue-600",
    "text-info-600",
    "text-warning",
    "text-error",
    "text-success",
    "text-alpha",
    "text-red",
    "text-blue",
    "text-info",
    "text-warning-100",
    "text-error-100",
    "text-success-100",
    "text-alpha-100",
    "text-red-100",
    "text-blue-100",
    "text-info-100",
    "col-span-1",
    "col-span-2",
    "col-span-3",
    "col-span-4",
    "col-span-5",
    "col-span-6",
    "col-span-7",
    "col-span-8",
    "col-span-9",
    "col-span-10",
    "col-span-11",
    "col-span-12"
  ],
  darkMode: "class",
  theme: {
    screens,
    extend: {
      height: { ...screens, header: "92px", largeHeader: "140px" },
      container: {
        // you can configure the container to be centered
        center: true,
        padding: containerPaddings,
        screens: containerScreens
      },
      gridTemplateRows: {
        7: "repeat(7, minmax(0, 1fr));",
        12: "repeat(12, minmax(0, 1fr));"
      },
      spacing: {
        DEFAULT: "0.875rem",
        half: "0.5px"
      },
      maxWidth: {
        screen: "100vw"
      },
      borderRadius: {
        DEFAULT: "0.5rem"
      },
      fontFamily: {
        iranYekan: [
          "Iran Yekan",
          "Helvetica Neue",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji"
        ]
      },
      fontWeight: {
        extrablack: "950"
      },
      borderWidth: {
        0.5: "0.125rem",
        1: "0.25rem"
      },
      colors: {
        primary: {
          ...myColors.primary,
          DEFAULT: myColors.primary[600]
        },
        secondary: {
          ...myColors.secondary,
          DEFAULT: myColors.secondary[600]
        },
        error: {
          ...tailwindColors.red,
          DEFAULT: tailwindColors.red[600]
        },
        success: {
          ...tailwindColors.green,
          DEFAULT: tailwindColors.green[600]
        },
        warning: {
          ...tailwindColors.amber,
          DEFAULT: tailwindColors.yellow[600]
        },
        info: {
          ...tailwindColors.blue,
          DEFAULT: tailwindColors.blue[600]
        },
        alpha: {
          white: tailwindColors.white,
          ...myColors.alpha,
          DEFAULT: tailwindColors.gray[600],
          black: tailwindColors.black
        }
      }
    }
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        html: {
          fontSize: theme("fontSize.sm"),
          color: theme("colors.alpha.800"),
          fontFamily: theme("fontWeight.normal")
        },
        h1: {
          fontSize: theme("fontSize.2xl")
        },
        h2: {
          fontSize: theme("fontSize.xl")
        },
        h3: {
          fontSize: theme("fontSize.lg")
        },
        h4: {
          fontSize: theme("fontSize.base")
        },
        h5: {
          fontSize: theme("fontSize.sm")
        },
        h6: {
          fontSize: theme("fontSize.xs")
        }
      })
    }),
    require("tailwindcss-animate")
  ]
}

// {
//   xs: [ '0.75rem', { lineHeight: '1rem' } ],
//   sm: [ '0.875rem', { lineHeight: '1.25rem' } ],
//   base: [ '1rem', { lineHeight: '1.5rem' } ],
//   lg: [ '1.125rem', { lineHeight: '1.75rem' } ],
//   xl: [ '1.25rem', { lineHeight: '1.75rem' } ],
//   '2xl': [ '1.5rem', { lineHeight: '2rem' } ],
//   '3xl': [ '1.875rem', { lineHeight: '2.25rem' } ],
//   '4xl': [ '2.25rem', { lineHeight: '2.5rem' } ],
//   '5xl': [ '3rem', { lineHeight: '1' } ],
//   '6xl': [ '3.75rem', { lineHeight: '1' } ],
//   '7xl': [ '4.5rem', { lineHeight: '1' } ],
//   '8xl': [ '6rem', { lineHeight: '1' } ],
//   '9xl': [ '8rem', { lineHeight: '1' } ]
// }

export default tailwind
