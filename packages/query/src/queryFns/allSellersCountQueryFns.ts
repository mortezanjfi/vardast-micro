import {
  GetAllSellersCountDocument,
  GetAllSellersCountQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const getAllSellersCountQueryFn =
  async (): Promise<GetAllSellersCountQuery> => {
    return await request<any>(
      process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
      GetAllSellersCountDocument,
      {}
    )
  }
