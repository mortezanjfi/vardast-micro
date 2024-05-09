import {
  GetMyProfileSellerDocument,
  GetMyProfileSellerQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const getMyProfileSellerQueryFns = async (
  { accessToken = "", name = "" }
  // query,
  // page,
  // brandId,
  // attributes,
  // categoryIds,
  // orderBy,
  // sellerId
): Promise<GetMyProfileSellerQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetMyProfileSellerDocument,
    {
      searchSellerRepresentativeInput: {
        name
      }
    },
    {
      authorization: `Bearer ${accessToken ?? ""}`
    }
  )
}
