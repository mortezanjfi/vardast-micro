import {
  EntityTypeEnum,
  GetUserFavoriteProductsDocument,
  GetUserFavoriteProductsQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const allUserFavoriteProductsQueryFns = async ({
  accessToken = ""
}): Promise<GetUserFavoriteProductsQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetUserFavoriteProductsDocument,
    {
      favoritesInput: {
        type: EntityTypeEnum.Product
      }
    },
    {
      authorization: `Bearer ${accessToken}`
    }
  )
}
