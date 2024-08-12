/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "turbo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
    "src/stories/*",
    "src/generated.ts",
    "old-to-delete"
  ],
  env: {
    es2022: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: { project: true },
  plugins: ["@typescript-eslint", "import", "unused-imports"],
  rules: {
    "linebreak-style": "off",
    "prettier/prettier": "off",
    "import/no-unresolved": [
      2,
      {
        caseSensitive: false
      }
    ],
    "import/no-import-module-exports": "off",
    "import/no-extraneous-dependencies": "off",
    "implicit-arrow-linebreak": "off",
    "no-param-reassign": "off",
    "consistent-return": "off",
    "wrap-iife": "off",
    "comma-dangle": "off",
    "operator-linebreak": "off",
    "object-curly-newline": "off",
    "no-underscore-dangle": "off",
    "no-restricted-exports": "off",
    "import/prefer-default-export": "off",
    "import/no-cycle": "off",
    "max-len": "off",
    "no-empty-pattern": "off",
    indent: "off",
    "react/display-name": "off",
    "no-unused-vars": [1, { args: "after-used", argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "turbo/no-undeclared-env-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
    ],
    "@typescript-eslint/no-misused-promises": [
      2,
      { checksVoidReturn: { attributes: false } }
    ],
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "@typescript-eslint/ban-ts-comment": "error",
    "no-console": "warn",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "unused-imports/no-unused-imports": "error"
  },
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.cjs",
    "**/.eslintrc.cjs",
    ".next",
    "dist",
    "pnpm-lock.yaml"
  ],
  reportUnusedDisableDirectives: true
}

module.exports = config
