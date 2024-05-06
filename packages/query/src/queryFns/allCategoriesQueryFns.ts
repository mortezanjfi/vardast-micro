import {
  GetAllCategoriesDocument,
  GetAllCategoriesQuery,
  IndexCategoryInput
} from "@vardast/graphql/generated"
import { Session } from "@vardast/graphql/src/auth.type"
import request from "graphql-request"

type getAllCategoriesQueryFnType = IndexCategoryInput & {
  accessToken?: Session["accessToken"]
}

export const getAllCategoriesQueryFn = async ({
  brandId,
  sellerId,
  page,
  accessToken
}: getAllCategoriesQueryFnType = {}): Promise<GetAllCategoriesQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT!,
    GetAllCategoriesDocument,
    {
      indexCategoryInput: {
        brandId,
        sellerId,
        page
      }
    },
    {
      authorization: `Bearer ${accessToken}`
    }
  )
}
