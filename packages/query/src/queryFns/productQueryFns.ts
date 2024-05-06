import { GetProductDocument, GetProductQuery } from "@vardast/graphql/generated"
import request from "graphql-request"

export const getProductQueryFn = async (
  id: number
): Promise<GetProductQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT!,
    GetProductDocument,
    {
      id: +id
    }
  )
}
