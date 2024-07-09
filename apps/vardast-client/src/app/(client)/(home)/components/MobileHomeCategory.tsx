"use client"

import { UseQueryResult } from "@tanstack/react-query"
import CategorySegment from "@vardast/component/category/CategorySegment"
import { GetVocabularyQuery } from "@vardast/graphql/generated"

import MobileHomeSection from "@vardast/component/home/MobileHomeSection"

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
