"use client"

import { Brand } from "@vardast/graphql/generated"

import { IHomeProps } from "@/app/(public)/(purchaser)/(home)/components/HomeIndex"
import HomeTopSellers from "@/app/(public)/(purchaser)/(home)/components/HomeTopSellers"
import MobileHomeCategory from "@/app/(public)/(purchaser)/(home)/components/MobileHomeCategory"
import MobileHomeNewestProducts from "@/app/(public)/(purchaser)/(home)/components/MobileHomeNewestProducts"
import MobileHomeSlider from "@/app/(public)/(purchaser)/(home)/components/MobileHomeSlider"
import MobileHomeTopBlogs from "@/app/(public)/(purchaser)/(home)/components/MobileHomeTopBlogs"
import MobileHomeTopEntities from "@/app/(public)/(purchaser)/(home)/components/MobileHomeTopEntities"

const MobileHomeIndex = ({
  allBrandsCount,
  allProductsQuery,
  allSellersCount,
  getVocabularyQueryFcQuery,
  homeSlidersQuery,
  getAllBlogsQuery,
  isMobileView
}: IHomeProps) => {
  return (
    <>
      <MobileHomeSlider query={homeSlidersQuery} isMobileView={isMobileView} />
      <MobileHomeCategory
        getVocabularyQueryFcQuery={getVocabularyQueryFcQuery}
      />
      {/* <MobileHomeTopEntities
      width={width * 0.9}
      __typename="Seller"
        title="جدیدترین فروشنده‌ها"
        query={allSellersCount.data?.sellers.data.slice(0, 8) as Seller[]}
      /> */}
      <HomeTopSellers
        title="جدیدترین فروشنده‌ها"
        allSellersCount={allSellersCount}
      />
      <MobileHomeTopEntities
        centeredSlides
        isMobileView
        __typename="Brand"
        title="جدیدترین برندها"
        query={allBrandsCount.data?.brands.data.slice(0, 8) as Brand[]}
      />
      {allProductsQuery.data && (
        <MobileHomeNewestProducts allProductsQuery={allProductsQuery} />
      )}
      {getAllBlogsQuery.data && (
        <MobileHomeTopBlogs getAllBlogsQuery={getAllBlogsQuery} isMobileView />
      )}
    </>
  )
}

export default MobileHomeIndex
