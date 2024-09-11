import {
  EntityTypeEnum,
  GetUserFavoriteSellersDocument,
  GetUserFavoriteSellersQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const allUserFavoriteSellersQueryFns = async ({
  accessToken = ""
}): Promise<GetUserFavoriteSellersQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetUserFavoriteSellersDocument,
    {
      favoritesInput: {
        type: EntityTypeEnum.Seller
      }
    },
    {
      authorization: `Bearer ${accessToken ?? ""}`
    }
  )
}
