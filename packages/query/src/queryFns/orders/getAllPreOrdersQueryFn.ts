import {
  GetAllPreOrdersQueryDocument,
  IndexPreOrderInput
} from "@vardast/graphql/generated"
import request from "graphql-request"

import { ApiArgsType, ApiResponseType } from "../../type"

export const getAllPreOrdersQueryFn = async <T>(
  args: ApiArgsType<IndexPreOrderInput>,
  accessToken: string
): Promise<ApiResponseType<T>> => {
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
