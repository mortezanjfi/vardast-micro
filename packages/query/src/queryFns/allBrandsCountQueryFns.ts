import {
  GetAllBrandsCountDocument,
  GetAllBrandsCountQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const getAllBrandsCountQueryFn =
  async (): Promise<GetAllBrandsCountQuery> => {
    return await request<any>(
      process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
      GetAllBrandsCountDocument,
      {}
    )
  }
