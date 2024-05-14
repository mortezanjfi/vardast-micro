"use client"

import { notFound } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { GetVocabularyQuery } from "@vardast/graphql/generated"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getVocabularyQueryFn } from "@vardast/query/queryFns/vocabularyQueryFns"

import CategoriesList from "@/app/(client)/category/components/CategoriesList"

type VocabulariesPageProps = {
  isMobileView: boolean
}
const VocabulariesPage = ({ isMobileView }: VocabulariesPageProps) => {
  const { data, isLoading } = useQuery<GetVocabularyQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.VOCABULARY_QUERY_KEY,
      { slug: "product_categories" }
    ],
    queryFn: () => getVocabularyQueryFn("product_categories")
  })

  if (!data) {
    // return <NoProductFound />
    return notFound()
  }

  return (
    <CategoriesList
      isMobileView={isMobileView}
      data={data?.vocabulary.categories.slice(0, 14)}
      isLoading={isLoading}
    />
  )
}

export default VocabulariesPage
