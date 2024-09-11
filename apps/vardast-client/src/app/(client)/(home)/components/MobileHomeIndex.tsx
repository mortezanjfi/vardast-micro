"use client"

import MobileHomeSection from "@vardast/component/home/MobileHomeSection"
import MobileHomeTopBlogs from "@vardast/component/home/MobileHomeTopBlogs"
import { Brand } from "@vardast/graphql/generated"

import { IHomeProps } from "@/app/(client)/(home)/components/HomeIndex"
import MobileHomeCategory from "@/app/(client)/(home)/components/MobileHomeCategory"
import MobileHomeNewestProducts from "@/app/(client)/(home)/components/MobileHomeNewestProducts"
import MobileHomeSlider from "@/app/(client)/(home)/components/MobileHomeSlider"
import MobileHomeTopEntities from "@/app/(client)/(home)/components/MobileHomeTopEntities"
import NewPriceSlider from "@/app/(client)/(home)/components/NewPriceSlider"
import PublicPreOrdersSection from "@/app/(client)/(home)/components/PublicPreOrdersSection"

const MobileHomeIndex = ({
  allBrandsCount,
  recentPriceProductsQuery,
  allProductsQuery,
  getVocabularyQueryFcQuery,
  homeSlidersQuery,
  getAllBlogsQuery,
  publicOrdersQuery,
  isMobileView
}: IHomeProps) => {
  return (
    <>
      {recentPriceProductsQuery?.data?.products?.data.length > 0 && (
        <div className="flex h-12 max-h-12 min-h-12 items-center gap-3 bg-alpha-white">
          <NewPriceSlider query={recentPriceProductsQuery} />
        </div>
      )}
      <MobileHomeSlider isMobileView={isMobileView} query={homeSlidersQuery} />

      <MobileHomeCategory
        getVocabularyQueryFcQuery={getVocabularyQueryFcQuery}
      />
      {publicOrdersQuery && (
        <MobileHomeSection
          bgWhite
          block
          title="جدیدترین سفارشات"
          viewAllHref="/orders"
        >
          <PublicPreOrdersSection isMobileView query={publicOrdersQuery} />
        </MobileHomeSection>
      )}
      <MobileHomeTopEntities
        __typename="Brand"
        isMobileView
        query={allBrandsCount.data?.brands.data.slice(0, 8) as Brand[]}
        title="جدیدترین برندها"
      />
      {allProductsQuery.data && (
        <MobileHomeNewestProducts
          isMobileView
          query={allProductsQuery}
          title="جدیدترین کالاها"
        />
      )}
      {getAllBlogsQuery.data && (
        <MobileHomeTopBlogs getAllBlogsQuery={getAllBlogsQuery} isMobileView />
      )}
    </>
  )
}

export default MobileHomeIndex
