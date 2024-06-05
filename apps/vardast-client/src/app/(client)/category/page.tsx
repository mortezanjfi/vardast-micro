import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import VocabulariesPage from "@vardast/component/category/VocabulariesPage"
import { GetVocabularyQuery } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getVocabularyQueryFn } from "@vardast/query/queryFns/vocabularyQueryFns"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "دسته‌بندی‌ها"
  }
}

const CategoriesPage = async () => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery<GetVocabularyQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.VOCABULARY_QUERY_KEY,
      { slug: "product_categories" }
    ],
    queryFn: () => getVocabularyQueryFn("product_categories")
  })
  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <VocabulariesPage isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}
export default CategoriesPage
