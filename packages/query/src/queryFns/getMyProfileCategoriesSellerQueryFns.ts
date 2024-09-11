import {
  GetMyProfileCategoriesSellerDocument,
  GetMyProfileCategoriesSellerQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const getMyProfileCategoriesSellerQueryFns = async ({
  accessToken = "",
  name = ""
}): Promise<GetMyProfileCategoriesSellerQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetMyProfileCategoriesSellerDocument,
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
