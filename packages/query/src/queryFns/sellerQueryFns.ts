import { GetSellerDocument, GetSellerQuery } from "@vardast/graphql/generated"
import { Session } from "@vardast/graphql/src/auth.type"
import request from "graphql-request"

type getSellerQueryFnType = {
  accessToken?: Session["accessToken"]
  id: number
}
export const getSellerQueryFn = async ({
  id,
  accessToken
}: getSellerQueryFnType): Promise<GetSellerQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT!,
    GetSellerDocument,
    {
      id: +id
    },
    {
      authorization: `Bearer ${accessToken}`
    }
  )
}
