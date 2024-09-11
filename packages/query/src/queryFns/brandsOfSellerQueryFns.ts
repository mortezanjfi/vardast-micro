import {
  GetBrandsOfSellerDocument,
  GetBrandsOfSellerQuery,
  IndexSellerBrandInput
} from "@vardast/graphql/generated"
import request from "graphql-request"

interface getAllBrandsOfSellerFnArgs extends IndexSellerBrandInput {}
export const brandsOfSellerQueryFns = async ({
  sellerId,
  page
}: getAllBrandsOfSellerFnArgs): Promise<GetBrandsOfSellerQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetBrandsOfSellerDocument,
    {
      indexSellerBrandInput: {
        sellerId,
        page
      }
    }
  )
}
