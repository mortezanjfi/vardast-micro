const { fileURLToPath } = require("url");
const path = require("path");

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
module.exports = {
  tailwindConfig: fileURLToPath(
    new URL(
      "../../configs/tailwind/tailwind.config.ts",
      `file://${__filename}`,
    ),
  ),
  tailwindFunctions: ["cn", "cva"],
  tabWidth: 2,
  useTabs: false,
  semi: false,
  printWidth: 80,
  trailingComma: "none",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/generated",
    "",
    "^types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@core/clients/(.*)$",
    "^@core/utils/(.*)$",
    "^@core/ui/(.*)$",
    "^@core/components/(.*)$",
    "^@core/(.*)$",
    "^@/styles/(.*)$",
    "^@/app/(.*)$",
    "",
    "^@/assets/(.*)$",
    "",
    "^[./]",
  ],
  pluginSearchDirs: ["."],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: [
    require.resolve("@ianvs/prettier-plugin-sort-imports"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],
};
