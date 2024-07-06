"use client"

import { Brand } from "@vardast/graphql/generated"

import { IHomeProps } from "@/app/(client)/(home)/components/HomeIndex"
import MobileHomeCategory from "@/app/(client)/(home)/components/MobileHomeCategory"
import MobileHomeNewestProducts from "@/app/(client)/(home)/components/MobileHomeNewestProducts"
import MobileHomeSlider from "@/app/(client)/(home)/components/MobileHomeSlider"
import MobileHomeTopBlogs from "@/app/(client)/(home)/components/MobileHomeTopBlogs"
import MobileHomeTopEntities from "@/app/(client)/(home)/components/MobileHomeTopEntities"
import NewestPriceProductSection from "@/app/(client)/(home)/components/NewestPriceProductSection"

const MobileHomeIndex = ({
  allBrandsCount,
  recentPriceProductsQuery,
  allProductsQuery,
  getVocabularyQueryFcQuery,
  homeSlidersQuery,
  getAllBlogsQuery,
  isMobileView
}: IHomeProps) => {
  return (
    <>
      {recentPriceProductsQuery?.data?.products?.data.length > 0 && (
        <NewestPriceProductSection
          isMobileView
          query={recentPriceProductsQuery}
        />
      )}
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
      {/* <HomeTopSellers
        title="جدیدترین فروشنده‌ها"
        allSellersCount={allSellersCount}
      /> */}
      <MobileHomeTopEntities
        isMobileView
        __typename="Brand"
        title="جدیدترین برندها"
        query={allBrandsCount.data?.brands.data.slice(0, 8) as Brand[]}
      />
      {allProductsQuery.data && (
        <MobileHomeNewestProducts
          isMobileView
          title="جدیدترین کالاها"
          query={allProductsQuery}
        />
      )}
      {getAllBlogsQuery.data && (
        <MobileHomeTopBlogs getAllBlogsQuery={getAllBlogsQuery} isMobileView />
      )}
    </>
  )
}

export default MobileHomeIndex
