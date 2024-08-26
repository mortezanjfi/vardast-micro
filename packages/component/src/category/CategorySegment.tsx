"use client"

import { UseQueryResult } from "@tanstack/react-query"
import { Category, GetVocabularyQuery } from "@vardast/graphql/generated"

import CategoryCircleItem, {
  CategoryCircleItemLoader
} from "./CategoryCircleItem"

const CategorySegment = ({
  getVocabularyQueryFcQuery
}: {
  getVocabularyQueryFcQuery: UseQueryResult<GetVocabularyQuery>
}) => {
  return (
    <div className="overflow-hidden">
      <div className="hide-scrollbar inline-flex h-full w-full overflow-x-auto px-5 pb-7">
        {getVocabularyQueryFcQuery.isLoading
          ? [...Array(4)].map((_, index) => (
              <CategoryCircleItemLoader
                isMobileView
                key={`category-segment-loader-${index}`}
              />
            ))
          : getVocabularyQueryFcQuery?.data?.vocabulary.categories
              ?.slice(0, 14)
              .map(
                (props) =>
                  props && (
                    <CategoryCircleItem
                      data={props as Category}
                      isMobileView
                      key={`category-segment-${props.id}`}
                    />
                  )
              )}
      </div>
    </div>
  )
}

export default CategorySegment
