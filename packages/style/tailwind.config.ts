/** @type {import('tailwindcss').Config} */

import baseConfig from "@vardast/tailwind-config";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.

  content: baseConfig.content.concat(["../../packages/ui/**/*.{ts,tsx}"]),
  presets: [baseConfig],
};
