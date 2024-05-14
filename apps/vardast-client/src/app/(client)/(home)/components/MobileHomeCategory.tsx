"use client"

import { UseQueryResult } from "@tanstack/react-query"
import { GetVocabularyQuery } from "@vardast/graphql/generated"

import MobileHomeSection from "@/app/(client)/(home)/components/MobileHomeSection"
import CategorySegment from "@/app/(client)/category/components/CategorySegment"

const MobileHomeCategory = ({
  getVocabularyQueryFcQuery
}: {
  getVocabularyQueryFcQuery: UseQueryResult<GetVocabularyQuery>
}) => {
  return (
    <MobileHomeSection bgWhite block title="دسته‌بندی‌ها">
      <CategorySegment getVocabularyQueryFcQuery={getVocabularyQueryFcQuery} />
    </MobileHomeSection>
  )
}

export default MobileHomeCategory
