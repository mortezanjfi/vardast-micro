import { GetBrandDocument, GetBrandQuery } from "@vardast/graphql/generated"
import { Session } from "@vardast/graphql/src/auth.type"
import request from "graphql-request"

type getBrandQueryFnType = {
  accessToken?: Session["accessToken"]
  id: number
}
export const getBrandQueryFn = async ({
  id,
  accessToken
}: getBrandQueryFnType): Promise<GetBrandQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT!,
    GetBrandDocument,
    {
      id: +id
    },
    {
      authorization: `Bearer ${accessToken ?? ""}`
    }
  )
}
