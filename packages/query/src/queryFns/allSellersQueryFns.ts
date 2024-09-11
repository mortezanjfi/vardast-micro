import {
  GetAllSellersDocument,
  GetAllSellersQuery,
  IndexSellerInput
} from "@vardast/graphql/generated"
import request from "graphql-request"

type getAllSellersFnArgs = IndexSellerInput

export const getAllSellersQueryFn = async ({
  name,
  page
}: getAllSellersFnArgs = {}): Promise<GetAllSellersQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT!,
    GetAllSellersDocument,
    {
      indexSellerInput: {
        name,
        page
      }
    }
  )
}
