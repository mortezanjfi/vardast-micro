"use client"

import { UseQueryResult } from "@tanstack/react-query"
import { Category, GetVocabularyQuery } from "@vardast/graphql/generated"

import { MotionDiv } from "../motion/Motion"
import CategoryCircleItem, {
  CategoryCircleItemLoader
} from "./CategoryCircleItem"

const CategorySegment = ({
  getVocabularyQueryFcQuery
}: {
  getVocabularyQueryFcQuery: UseQueryResult<GetVocabularyQuery>
}) => {
  return (
    <MotionDiv
      variants={{
        hidden: { opacity: 0, y: 0, x: -500, scale: 1 },
        enter: { opacity: 1, y: 0, x: 0, scale: 1 },
        exit: { opacity: 0, y: 0, x: -500, scale: 1 } // Add exit variant for completeness
      }}
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear", delay: 0.2 }} // Set the transition to linear with a delay of 0.5 seconds
      className="overflow-hidden"
    >
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
                      isMobileView
                      key={`category-segment-${props.id}`}
                      data={props as Category}
                    />
                  )
              )}
      </div>
    </MotionDiv>
  )
}

export default CategorySegment
