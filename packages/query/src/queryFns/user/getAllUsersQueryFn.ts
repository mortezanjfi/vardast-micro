import { authOptions } from "@vardast/auth/authOptions"
import { GetAllUsersDocument } from "@vardast/graphql/generated"
import request from "graphql-request"
import { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"

import { TableFetchApiFunctionType } from "../../type"

export const getAllUsersQueryFn: (
  roleIds?: number[]
) => TableFetchApiFunctionType = (roleIds) => async (args) => {
  const session =
    typeof window === "undefined"
      ? await getServerSession(authOptions)
      : await getSession()
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetAllUsersDocument,
    {
      indexUserInput: { ...args, roleIds }
    },
    {
      authorization: `Bearer ${session?.accessToken ?? ""}`
    }
  )
}
