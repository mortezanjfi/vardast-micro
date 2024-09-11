import {
  GetVocabularyDocument,
  GetVocabularyQuery
} from "@vardast/graphql/generated"
import request from "graphql-request"

export const getVocabularyQueryFn = async (
  slug: string
): Promise<GetVocabularyQuery> => {
  return await request<any>(
    process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
    GetVocabularyDocument,
    {
      slug
    }
  )
}
