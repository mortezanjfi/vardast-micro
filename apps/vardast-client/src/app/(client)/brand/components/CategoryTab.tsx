"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import CategoryListContainer from "@vardast/component/category/CategoryListContainer"
import CategoryListItem from "@vardast/component/category/CategoryListItem"
import CategoriesSort, {
  CategoriesSortStatic
} from "@vardast/component/desktop/CategoriesSort"
import ListHeader from "@vardast/component/desktop/ListHeader"
import FiltersSidebarContainer from "@vardast/component/filters-sidebar-container"
import InfiniteScrollPagination from "@vardast/component/InfiniteScrollPagination"
import NoResult from "@vardast/component/NoResult"
import NotFoundMessage from "@vardast/component/NotFound"
import ProductList, {
  checkLimitPageByCondition
} from "@vardast/component/product-list"
import { GetAllCategoriesQuery, InputMaybe } from "@vardast/graphql/generated"
import { setSidebar } from "@vardast/provider/LayoutProvider/use-layout"
import { getAllCategoriesQueryFn } from "@vardast/query/queryFns/allCategoriesQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import {
  SegmentItemLoader,
  Segments,
  SegmentsList,
  SegmentsListItem
} from "@vardast/ui/segment"
import clsx from "clsx"

import { IBrandOrSellerProfile } from "./BrandProfile"

const CategoriesTab = ({
  sellerName,
  isBrand = true,
  brandName,
  productsProps
}: {
  sellerName?: string
  isBrand?: boolean
  brandName?: string | undefined
  productsProps: IBrandOrSellerProfile
}) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>("")
  const sliderRef = useRef<HTMLDivElement>(null)
  const [slideWidth, setSlideWidth] = useState(0)
  const [sort, setSort] = useState<CategoriesSortStatic>(undefined)

  useEffect(() => {
    const params = new URLSearchParams(searchParams as any)
    params.set("orderBy", CategoriesSortStatic.Sum)
    push(pathname + "?" + params.toString())
  }, [])

  const allCategoriesQuery = useInfiniteQuery<GetAllCategoriesQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_CATEGORIES_QUERY_KEY,
      {
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] }),
        page: productsProps.args.page || 1
      }
    ],
    ({ pageParam = 1 }) => {
      return getAllCategoriesQueryFn({
        page: pageParam,
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] })
      })
    },
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return productsProps.limitPage
          ? checkLimitPageByCondition(
              lastPage.categories.currentPage <= productsProps.limitPage,
              allPages
            )
          : checkLimitPageByCondition(
              lastPage.categories.currentPage < lastPage.categories.lastPage,
              allPages
            )
      }
    }
    // enabled: openTabName === "CATEGORY"
  )

  const onValueChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const slide = sliderRef.current?.children[0]

    if (slide?.clientWidth) {
      setSlideWidth(slide?.clientWidth)
    }
  }, [allCategoriesQuery.data?.pages])

  useEffect(() => {
    const tempActiveTab =
      allCategoriesQuery.data?.pages[0].categories?.data?.at(0)?.id || ""

    if (tempActiveTab) {
      setActiveTab(`${tempActiveTab}`)
    }
  }, [allCategoriesQuery.data?.pages])

  useEffect(() => {
    const params = new URLSearchParams(searchParams as any)
    const paramsKeys = params.keys()
    for (const key of paramsKeys) {
      if (key.includes("orderBy")) {
        params.delete(key)
      }
    }
    push(pathname + "?" + params.toString())
  }, [])

  productsProps.args.categoryIds = [+activeTab]

  const dynamicHref = ({
    sellerName,
    sellerId,
    brandName,
    categoryId,
    categoryTitle,
    brandId
  }: {
    sellerId?: InputMaybe<number>
    sellerName?: string
    brandName?: string
    categoryId: number
    categoryTitle: string
    brandId?: InputMaybe<number>
  }) => {
    const baseUrl = `/products/${categoryId}/${categoryTitle}`
    const urlParams = new URLSearchParams()
    if (brandId && brandName) {
      urlParams.set("brandId", String(brandId))
      urlParams.set("brandName", brandName)
    }
    if (sellerId && sellerName) {
      urlParams.set("sellerId", String(sellerId))
      urlParams.set("sellerName", sellerName)
    }
    return `${baseUrl}?${urlParams.toString()}`
  }

  const DesktopSidebar = (
    <FiltersSidebarContainer
      sort={
        <CategoriesSort
          sort={sort}
          onSortChanged={(sort) => {
            setSort(sort)
            const params = new URLSearchParams(searchParams as any)
            params.set("orderBy", `${sort}`)
            push(pathname + "?" + params.toString())
          }}
        />
      }
    />
  )
  setSidebar(DesktopSidebar)
  return (
    <Segments
      value={activeTab}
      onValueChange={onValueChange}
      className="h-full flex-col sm:flex"
    >
      {productsProps.isMobileView ? (
        <>
          <SegmentsList className="border-b p">
            <InfiniteScrollPagination
              fetchingLoaderCount={6}
              CardLoader={() => <SegmentItemLoader />}
              infiniteQuery={allCategoriesQuery}
            >
              {(page, ref) => (
                <>
                  {page.categories?.data?.map(
                    ({ title, id, imageCategory }, index) => (
                      <SegmentsListItem
                        noStyle
                        ref={
                          page.categories.data.length - 1 === index
                            ? ref
                            : undefined
                        }
                        className="h-full pl"
                        key={id}
                        onClick={() => {
                          onValueChange(String(id))
                        }}
                        value={String(id)}
                      >
                        <>
                          <div
                            ref={sliderRef}
                            className={clsx(
                              "h-full w-[20vw] flex-shrink-0 cursor-pointer md:w-[100px]"
                            )}
                          >
                            <div
                              className={clsx(
                                "flex h-full flex-col justify-start gap-y-3"
                              )}
                            >
                              <div
                                style={{
                                  height: slideWidth
                                }}
                                className={clsx(
                                  "relative w-full overflow-hidden rounded-full border border-alpha-400 bg-alpha-50",
                                  id === +activeTab
                                    ? "border-2 border-primary"
                                    : ""
                                )}
                              >
                                <Image
                                  src={
                                    (imageCategory &&
                                      (imageCategory[0]?.file.presignedUrl
                                        ?.url as string)) ??
                                    "" ??
                                    `/images/categories/${id}.png`
                                  }
                                  alt="category"
                                  fill
                                  className="rounded-xl object-contain"
                                />
                              </div>
                              <h5
                                className={clsx(
                                  "relative z-20 line-clamp-2 h-12 whitespace-pre-wrap bg-opacity-60 text-center text-sm font-semibold",
                                  id === +activeTab ? "text-primary" : ""
                                )}
                              >
                                {title}
                              </h5>
                            </div>
                          </div>
                        </>
                      </SegmentsListItem>
                    )
                  )}
                </>
              )}
            </InfiniteScrollPagination>
          </SegmentsList>
          {/* <TotalItemsReport
            total={
              allCategoriesQuery.isLoading || allCategoriesQuery.isFetching
                ? undefined
                : allCategoriesQuery.data?.pages[0].categories.total
            }
            title="کالاهای این دسته بندی"
          /> */}
          <ProductList
            isMobileView={productsProps.isMobileView}
            args={productsProps.args}
            selectedCategoryIds={[]}
          />
        </>
      ) : (
        <>
          <ListHeader
            secondTitle="category"
            total={allCategoriesQuery.data?.pages[0].categories.total}
            listName={"categories"}
          />

          {allCategoriesQuery.isLoading && allCategoriesQuery.isFetching ? (
            <CategoryListContainer>
              {() => (
                <>
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={`desktop-home-category-${index}`}
                      className="animated-card h-60 w-full"
                    ></div>
                  ))}
                </>
              )}
            </CategoryListContainer>
          ) : !allCategoriesQuery.data ? (
            <NoResult entity="category" />
          ) : allCategoriesQuery.data.pages.length ? (
            <CategoryListContainer>
              {({ selectedItemId, setSelectedItemId }) => (
                <InfiniteScrollPagination
                  CardLoader={() => (
                    <div className="animated-card h-60 w-full"></div>
                  )}
                  infiniteQuery={allCategoriesQuery}
                >
                  {(page, ref) => (
                    <>
                      {page.categories.data.map((category, index) => (
                        <CategoryListItem
                          key={category.id}
                          ref={
                            page.categories.data.length - 1 === index
                              ? ref
                              : undefined
                          }
                          productsCount={category.productsCount}
                          // className="sm:max-h-60 sm:!min-h-full sm:min-w-full sm:!rounded-none sm:ring-2 sm:ring-alpha-200"
                          title={category?.title}
                          id={category.id}
                          selectedItemId={selectedItemId}
                          src={
                            (category &&
                              category?.imageCategory &&
                              (category?.imageCategory[0]?.file.presignedUrl
                                ?.url as string)) ??
                            "" ??
                            `/images/category/${category.id}.png`
                          }
                          // productsCount={category.}
                          onClick={() => setSelectedItemId(category.id)}
                          href={dynamicHref({
                            sellerId: productsProps.args["sellerId"],
                            sellerName: sellerName,
                            brandName: brandName,
                            brandId: productsProps?.args["brandId"],
                            categoryId: category.id,
                            categoryTitle: category.title
                          })}
                        />
                      ))}
                    </>
                  )}
                </InfiniteScrollPagination>
              )}
            </CategoryListContainer>
          ) : (
            <NotFoundMessage />
          )}
        </>
      )}
    </Segments>
  )
}
export default CategoriesTab
