import {
  GetCountTotalEventDocument,
  GetCountTotalEventQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const getCountTotalEventQueryFns = async (
  accessToken = ""
): Promise<GetCountTotalEventQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetCountTotalEventDocument,
    {},
    {
      authorization: `Bearer ${accessToken ?? ""}`
    }
  )
}
