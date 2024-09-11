/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["plugin:@next/next/recommended"],
  rules: {
    "@next/next/no-html-link-for-pages": "off"
  },
  overrides: [
    {
      files: ["**/*.jsx"],
      parserOptions: {
        project: ["./tsconfig.json"] // This disables the TypeScript project settings for JSX files
      }
    }
  ]
}

module.exports = config
