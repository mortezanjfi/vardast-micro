import {
  GetAllBrandsDocument,
  GetAllBrandsQuery,
  IndexBrandInput
} from "@vardast/graphql/generated"
import request from "graphql-request"

interface getAllBrandsFnArgs extends IndexBrandInput {}

export const getAllBrandsQueryFn = async ({
  name,
  page,
  sortType,
  categoryId
}: getAllBrandsFnArgs = {}): Promise<GetAllBrandsQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetAllBrandsDocument,
    {
      indexBrandInput: {
        name,
        page,
        sortType,
        categoryId
      }
    }
  )
}
