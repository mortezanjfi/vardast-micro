import type { CodegenConfig } from "@graphql-codegen/cli"
import { config as dotenvConfig } from "dotenv"

dotenvConfig()

console.log({ bib: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT })

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT,
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
