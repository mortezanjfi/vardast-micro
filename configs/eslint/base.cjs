/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "turbo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier"
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
    "no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "turbo/no-undeclared-env-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
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
    "unused-imports/no-unused-imports": "off",
    "import/no-unresolved": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/no-base-to-string": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-unsafe-enum-comparison": "off",
    "no-console": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-redundant-type-constituents": "off",
    "@typescript-eslint/no-unnecessary-type-constraint": "off",
    "no-unsafe-optional-chaining": "off",
    "no-empty": "off",
    "prefer-const": "off"
  },
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.cjs",
    "**/i18n.js",
    "**/.eslintrc.cjs",
    "**/public/*.js",
    "**/public/*.map",
    ".next",
    "dist",
    "pnpm-lock.yaml"
  ],
  reportUnusedDisableDirectives: true
}

module.exports = config
