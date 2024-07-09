"use client"

import { useState } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { Category, GetCategoryQuery } from "@vardast/graphql/generated"
import { useInView } from "react-intersection-observer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

import { ICategoryListLoader } from "../category/CategoryListLoader"
import CategoryCircleImage, {
  CategoryCircleImageSkeleton
} from "./CategoryCircleImage"

type Props = {
  getCategoryQuery: UseQueryResult<GetCategoryQuery, unknown>
}

const MobileCategoriesCardSection = ({ getCategoryQuery }: Props) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>()
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  const { ref: refNext, inView: inViewNext } = useInView({ threshold: 0.1 })
  const { ref: refPrev, inView: inViewPrev } = useInView({ threshold: 0.1 })

  return getCategoryQuery && getCategoryQuery.data.category.children.length ? (
    <div className="relative overflow-hidden border-b px-6 pt-6">
      <Swiper
        // freeMode={true}
        // pagination={{
        //   clickable: true
        // }}
        // modules={[FreeMode]}
        onSwiper={setSwiperRef}
        // centeredSlides={centeredSlides ?? true}
        slidesPerView={"auto"}
        spaceBetween={15}
        // className="h-full pb-12 sm:px-5 sm:py-8 md:px-0"
      >
        {getCategoryQuery.isLoading || getCategoryQuery.isFetching ? (
          <>
            {[...Array(10)].map((_, index) => (
              <SwiperSlide
                key={index}
                className="overflow-hidden bg-alpha-white"
              >
                <CategoryCircleImageSkeleton />
              </SwiperSlide>
            ))}
          </>
        ) : getCategoryQuery.data.category.children.length ? (
          getCategoryQuery?.data.category.children?.map(
            (category, index) =>
              category && (
                <SwiperSlide key={index} className="w-20 overflow-hidden ">
                  <div
                    ref={
                      index ===
                      getCategoryQuery?.data.category.children?.length - 1
                        ? refNext
                        : index === 0
                          ? refPrev
                          : undefined
                    }
                  >
                    <CategoryCircleImage category={category as Category} />
                  </div>
                </SwiperSlide>
              )
          )
        ) : (
          ""
        )}
      </Swiper>
    </div>
  ) : null
}

export default MobileCategoriesCardSection
