import { authOptions } from "@vardast/auth/authOptions"
import {
  GetAllProductsDocument,
  IndexProductInput
} from "@vardast/graphql/generated"
import request from "graphql-request"
import { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"

import { TableFetchApiFunctionType } from "../../type"

export const getAllProductsQueryFn: TableFetchApiFunctionType = async (
  args: IndexProductInput
) => {
  const session =
    typeof window === "undefined"
      ? await getServerSession(authOptions)
      : await getSession()
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetAllProductsDocument,
    {
      indexProductInput: args
    },
    { authorization: `Bearer ${session?.accessToken ?? ""}` }
  )
}
