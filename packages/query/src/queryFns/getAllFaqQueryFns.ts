import { GetAllFaqDocument, GetAllFaqQuery } from "@vardast/graphql/generated"
import request from "graphql-request"

export const getAllFaqQueryFns = async (): Promise<GetAllFaqQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetAllFaqDocument
  )
}
