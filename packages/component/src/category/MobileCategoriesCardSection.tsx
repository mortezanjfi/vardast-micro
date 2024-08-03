"use client"

import { UseQueryResult } from "@tanstack/react-query"
import { Category, GetCategoryQuery } from "@vardast/graphql/generated"
import { Swiper, SwiperSlide } from "swiper/react"

import CategoryCircleItem, {
  CategoryCircleItemLoader
} from "./CategoryCircleItem"

type Props = {
  slug: Array<string | number>
  getCategoryQuery: UseQueryResult<GetCategoryQuery, unknown>
}

const MobileCategoriesCardSection = ({ slug, getCategoryQuery }: Props) => {
  return getCategoryQuery && getCategoryQuery.data.category.children.length ? (
    <div className="relative overflow-hidden border-b px-6 pt-6">
      <Swiper
        // freeMode={true}
        // pagination={{
        //   clickable: true
        // }}
        // modules={[FreeMode]}
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
                <CategoryCircleItemLoader isMobileView isProductsPage />
              </SwiperSlide>
            ))}
          </>
        ) : getCategoryQuery.data.category.children.length ? (
          getCategoryQuery?.data.category.children?.map(
            (category, index) =>
              category && (
                <SwiperSlide key={index} className="w-20 overflow-hidden ">
                  <div>
                    <CategoryCircleItem
                      slug={slug}
                      isMobileView
                      isProductsPage
                      data={category as Category}
                    />
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
