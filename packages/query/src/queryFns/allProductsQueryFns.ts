import {
  GetAllProductsDocument,
  GetAllProductsQuery,
  IndexProductInput
} from "@vardast/graphql/generated"
import request from "graphql-request"

type getAllProductsQueryFnArgs = IndexProductInput

export const getAllProductsQueryFn = async ({
  query,
  page,
  brandId,
  attributes,
  categoryIds,
  orderBy,
  sellerId,
  sortField,
  sortDirection,
  cityId
}: getAllProductsQueryFnArgs = {}): Promise<GetAllProductsQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT!,
    GetAllProductsDocument,
    {
      indexProductInput: {
        query,
        page,
        brandId,
        attributes,
        categoryIds,
        orderBy,
        sellerId,
        sortField,
        sortDirection,
        cityId
      }
    }
  )
}
