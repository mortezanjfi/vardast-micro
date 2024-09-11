import {
  GetMyProfileBrandsSellerDocument,
  GetMyProfileBrandsSellerQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const getMyProfileBrandsSellerQueryFns = async ({
  accessToken = "",
  name = ""
}): Promise<GetMyProfileBrandsSellerQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetMyProfileBrandsSellerDocument,
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
