import {
  GetAllBlogsDocument,
  GetAllBlogsQuery,
  IndexBlogInput
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const getAllBlogsQueryFn = async ({
  page
}: IndexBlogInput): Promise<GetAllBlogsQuery> => {
  return await request(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetAllBlogsDocument,
    {
      indexBlogInput: {
        page,
        perPage: 5
      }
    }
  )
}
