import { FindPreOrderByIdDocument } from "@vardast/graphql/generated"
import request from "graphql-request"

import { TableFetchApiFunctionType } from "../../type"

export const findPreOrderByIdQueryFn: TableFetchApiFunctionType = async (
  args,
  accessToken
) => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    FindPreOrderByIdDocument,
    { ...args },
    {
      authorization: `Bearer ${accessToken ?? ""}`
    }
  )
}
