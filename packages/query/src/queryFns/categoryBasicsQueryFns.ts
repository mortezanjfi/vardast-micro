import {
  GetCategoryBasicsDocument,
  GetCategoryBasicsQuery
} from "@vardast/graphql/generated"
import { Session } from "@vardast/graphql/src/auth.type"
import request from "graphql-request"

type getCategoryBasicsQueryFnType = {
  accessToken?: Session["accessToken"]
  id: number
}
export const getCategoryBasicsQueryFn = async ({
  id,
  accessToken
}: getCategoryBasicsQueryFnType): Promise<GetCategoryBasicsQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT!,
    GetCategoryBasicsDocument,
    {
      id: +id
    },
    {
      authorization: `Bearer ${accessToken ?? ""}`
    }
  )
}
