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
        <div className="flex items-center gap-3 bg-alpha-white">
          <NewPriceSlider query={recentPriceProductsQuery} />
        </div>
      )}
      <MobileHomeSlider query={homeSlidersQuery} isMobileView={isMobileView} />

      <MobileHomeCategory
        getVocabularyQueryFcQuery={getVocabularyQueryFcQuery}
      />
      {publicOrdersQuery && (
        <MobileHomeSection
          block
          bgWhite
          title="جدیدترین سفارشات"
          viewAllHref="/orders"
        >
          <PublicPreOrdersSection query={publicOrdersQuery} isMobileView />
        </MobileHomeSection>
      )}
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
