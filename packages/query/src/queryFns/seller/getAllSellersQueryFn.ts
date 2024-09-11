import { authOptions } from "@vardast/auth/authOptions"
import { GetAllSellersDocument } from "@vardast/graphql/generated"
import request from "graphql-request"
import { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"

import { TableFetchApiFunctionType } from "../../type"

export const getAllSellersQueryFn: TableFetchApiFunctionType = async (args) => {
  const session =
    typeof window === "undefined"
      ? await getServerSession(authOptions)
      : await getSession()
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetAllSellersDocument,
    {
      indexSellerInput: args
    },
    {
      authorization: `Bearer ${session?.accessToken ?? ""}`
    }
  )
}
