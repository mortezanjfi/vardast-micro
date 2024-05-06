import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://gateway.vardast.com/graphql",
  documents: "src/**/*graphql",
  ignoreNoDocuments: true,
  generates: {
    "src/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
        "typescript-validation-schema",
        {
          add: {
            content: "// @ts-nocheck"
          }
        }
      ],
      config: {
        documentMode: "string",
        dedupeOperationSuffix: true,
        fetcher: "graphql-request",
        schema: "zod"
      }
    }
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"]
  }
}
export default config
