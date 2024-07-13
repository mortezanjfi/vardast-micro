import { GetAllPreOrdersQueryDocument } from "@vardast/graphql/generated"
import request from "graphql-request"

import { TableFetchApiFunctionType } from "../../type"

export const getAllPreOrdersQueryFn: TableFetchApiFunctionType = async (
  args,
  accessToken
) => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetAllPreOrdersQueryDocument,
    {
      indexPreOrderInput: args
    },
    {
      authorization: `Bearer ${accessToken ?? ""}`
    }
  )
}
