import {
  GetBrandToSellerQuery,
  GetBrandToSellerQueryDocument,
  IndexTakeBrandToSeller
} from "@vardast/graphql/generated"
import request from "graphql-request"

interface IGetBrandToSellerQueryFns extends IndexTakeBrandToSeller {}

export const getBrandToSellerQueryFns = async ({
  page,
  brandId
}: IGetBrandToSellerQueryFns): Promise<GetBrandToSellerQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetBrandToSellerQueryDocument,
    {
      indexTakeBrandToSeller: {
        brandId,
        page
      }
    }
  )
}
