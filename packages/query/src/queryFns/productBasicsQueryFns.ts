import {
  GetProductBasicsDocument,
  GetProductBasicsQuery
} from "@vardast/graphql/generated"
import { Session } from "@vardast/graphql/src/auth.type"
import request from "graphql-request"

type getProductBasicsQueryFnType = {
  accessToken?: Session["accessToken"]
  id: number
}
export const getProductBasicsQueryFn = async ({
  id,
  accessToken
}: getProductBasicsQueryFnType): Promise<GetProductBasicsQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT!,
    GetProductBasicsDocument,
    {
      id: +id
    },
    {
      authorization: `Bearer ${accessToken ?? ""}`
    }
  )
}
