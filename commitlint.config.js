// ci: Changes to our CI configuration files and scripts (examples: CircleCi, SauceLabs)
// feat: A new feature
// fix: A bug fix
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// test: Adding missing tests or correcting existing tests
// comm: Comment some code
// merge: Fix merge conflicts
// docs: Documentation updates
// revert: Changes that improve the security of the codebase
// lint: Fix lint errors

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [2, "always", 200],
    "footer-leading-blank": [1, "always"],
    "footer-max-line-length": [2, "always", 200],
    "header-max-length": [2, "always", 400],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"]
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "ci",
        "feat",
        "fix",
        "perf",
        "refactor",
        "test",
        "conf",
        "comm",
        "merge",
        "docs",
        "revert",
        "lint",
        "seo"
      ]
    ]
  }
}
