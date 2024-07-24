"use client"

import { useState } from "react"
import CategoryCircleItem, {
  CategoryCircleItemLoader
} from "@vardast/component/category/CategoryCircleItem"
import MobileHomeSection from "@vardast/component/home/MobileHomeSection"
import MobileHomeTopBlogs from "@vardast/component/home/MobileHomeTopBlogs"
import { Brand, Category } from "@vardast/graphql/generated"
import clsx from "clsx"

import { IHomeProps } from "@/app/(client)/(home)/components/HomeIndex"
import MegaMenu, {
  MegaMenuLoader
} from "@/app/(client)/(home)/components/MegaMenu"
import MobileHomeNewestProducts from "@/app/(client)/(home)/components/MobileHomeNewestProducts"
import MobileHomeSlider from "@/app/(client)/(home)/components/MobileHomeSlider"
import MobileHomeTopEntities from "@/app/(client)/(home)/components/MobileHomeTopEntities"
import NewPriceSlider from "@/app/(client)/(home)/components/NewPriceSlider"
import PublicPreOrdersSection from "@/app/(client)/(home)/components/PublicPreOrdersSection"

const DesktopHomeIndex = ({
  megaMenuData,
  publicOrdersQuery,
  getVocabularyQueryFcQuery,
  recentPriceProductsQuery,
  allBrandsCount,
  allProductsQuery,
  getAllBlogsQuery,
  isMobileView,
  homeSlidersQuery
}: IHomeProps) => {
  const [blogFlag, setBlogFlag] = useState(false)

  const onOpenCategories = () => {
    setBlogFlag((prev) => !prev)
  }

  return (
    <>
      <div className="container relative mx-auto">
        {megaMenuData.isLoading || megaMenuData.isFetching ? (
          <MegaMenuLoader />
        ) : (
          <MegaMenu megaMenuData={megaMenuData} />
        )}
      </div>
      {recentPriceProductsQuery?.data?.products?.data?.length > 0 && (
        <div className="border-t-2 bg-alpha-white">
          <NewPriceSlider query={recentPriceProductsQuery} />
        </div>
      )}
      <div className="bg-alpha-100 sm:bg-alpha-white">
        <div className="">
          <MobileHomeSlider
            isMobileView={isMobileView}
            query={homeSlidersQuery}
          />
        </div>
      </div>
      <div className="border-t-2 bg-alpha-white">
        <div className="container mx-auto py-8">
          <MobileHomeSection viewAllHref="/category" title="دسته‌بندی‌ها">
            <div className="grid grid-cols-3 gap-y-10 sm:grid-cols-4 sm:pb-4 sm:pt-8 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {getVocabularyQueryFcQuery.isLoading
                ? [...Array(14)].map((_, index) => (
                    <CategoryCircleItemLoader
                      isMobileView={isMobileView}
                      key={`desktop-home-category-${index}`}
                    />
                  ))
                : getVocabularyQueryFcQuery?.data?.vocabulary.categories
                    ?.slice(0, 14)
                    .map(
                      (props) =>
                        props && (
                          <CategoryCircleItem
                            key={props.id}
                            isMobileView={isMobileView}
                            data={props as Category}
                          />
                        )
                    )}
            </div>
          </MobileHomeSection>
        </div>
      </div>{" "}
      {publicOrdersQuery && (
        <div className="border-t-2 bg-alpha-white">
          <div className="container mx-auto py-8">
            <MobileHomeSection title="جدیدترین سفارشات" viewAllHref="/orders">
              <PublicPreOrdersSection query={publicOrdersQuery} />
            </MobileHomeSection>
          </div>
        </div>
      )}
      {allBrandsCount.data && (
        <div className="border-t-2 bg-alpha-white py-8">
          <div className="container mx-auto ">
            <MobileHomeTopEntities
              __typename="Brand"
              title="جدیدترین برندها"
              query={allBrandsCount.data?.brands.data.slice(0, 8) as Brand[]}
            />
          </div>
        </div>
      )}
      {allProductsQuery.data && (
        <div className="border-t-2 bg-alpha-white ">
          <div className="container mx-auto rounded-xl py-8">
            <MobileHomeNewestProducts
              centeredSlides={false}
              title="جدیدترین کالاها"
              query={allProductsQuery}
            />
          </div>
        </div>
      )}
      {getAllBlogsQuery.data && (
        <div className="border-t-2 bg-alpha-white">
          <div className="container mx-auto py-8">
            <MobileHomeTopBlogs
              isMobileView={false}
              getAllBlogsQuery={getAllBlogsQuery}
            />
          </div>
        </div>
      )}
      <div className="border-t-2 bg-alpha-white">
        <div className="container mx-auto py-8 pb-16">
          <MobileHomeSection
            customButton={{
              onClick: onOpenCategories,
              title: blogFlag ? "بستن" : "مشاهده بیشتر"
            }}
            title={
              <div className="flex items-center gap-x-1 font-semibold">
                <h3 className="text-xl font-medium">دسته بندی‌های اصلی </h3>
                <h1 className="text-xl text-primary">وردست</h1>
              </div>
            }
          >
            <div className={clsx("gap-y-6", !blogFlag && "line-clamp-6")}>
              {getVocabularyQueryFcQuery.data?.vocabulary.categories.map(
                (category, index) => (
                  <div key={category?.id} className={clsx(index > 0 && "mt-7")}>
                    <h4 className="font-semibold">{category?.title}</h4>
                    <p className="pt text-justify leading-7">
                      {category?.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </MobileHomeSection>
        </div>
      </div>
    </>
  )
}

export default DesktopHomeIndex
