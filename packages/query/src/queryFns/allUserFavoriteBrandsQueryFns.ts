import {
  EntityTypeEnum,
  GetUserFavoriteBrandsDocument,
  GetUserFavoriteBrandsQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const allUserFavoriteBrandsQueryFns = async ({
  accessToken = ""
}): Promise<GetUserFavoriteBrandsQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetUserFavoriteBrandsDocument,
    {
      favoritesInput: {
        type: EntityTypeEnum.Brand
      }
    },
    {
      authorization: `Bearer ${accessToken}`
    }
  )
}
