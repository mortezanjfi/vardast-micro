"use client"

import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import BrandOrSellerCard, {
  BrandOrSellerCardSkeleton
} from "@vardast/component/BrandOrSellerCard"
import BrandsOrSellersContainer, {
  BrandContainerType
} from "@vardast/component/BrandsOrSellersContainer"
import FiltersSidebarContainer from "@vardast/component/filters-sidebar-container"
import InfiniteScrollPagination from "@vardast/component/InfiniteScrollPagination"
import { checkLimitPageByCondition } from "@vardast/component/product-list"
import {
  Brand,
  GetBrandsOfSellerQuery,
  GetBrandToSellerQuery,
  Seller,
  SortBrandEnum
} from "@vardast/graphql/generated"
import { setSidebar } from "@vardast/provider/LayoutProvider/use-layout"
import { brandsOfSellerQueryFns } from "@vardast/query/queryFns/brandsOfSellerQueryFns"
import { getBrandToSellerQueryFns } from "@vardast/query/queryFns/getBrandToSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import clsx from "clsx"

import BrandSort from "@/app/(client)/brands/components/BrandSort"
import SellersSort, {
  SellerSortStatic
} from "@/app/(client)/sellers/components/SellerSort"

import {
  IBrandOrSellerProfile,
  sortContainerClass,
  TotalItemsReport
} from "./BrandProfile"

const BrandOrSellersTab = ({
  slug,
  isBrand = true,
  productsProps
}: {
  slug: Array<string | number>
  isBrand?: boolean
  productsProps: IBrandOrSellerProfile
}) => {
  // const [openTabName] = useQueryState("tab")
  // const pathname = usePathname()
  // const searchParams = useSearchParams()
  // const { push } = useRouter()

  const [sort, setSort] = useState<SellerSortStatic>(SellerSortStatic.Newest)
  const [brandSort, setBrandSort] = useState<SortBrandEnum>(
    SortBrandEnum.Newest
  )
  const brandToSellerQuery = useInfiniteQuery<GetBrandToSellerQuery>(
    [
      QUERY_FUNCTIONS_KEY.TAKE_BRAND_TO_SELLER,
      {
        page: 1,
        brandId: +slug[0]
      }
    ],
    ({ pageParam = 1 }) =>
      getBrandToSellerQueryFns({
        page: pageParam,
        brandId: +slug[0]
      }),
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return checkLimitPageByCondition(
          lastPage.takeBrandToSeller.currentPage <
            lastPage.takeBrandToSeller.lastPage,
          allPages
        )
      },
      enabled: !!isBrand
    }
  )

  const brandsOfSellerQuery = useInfiniteQuery<GetBrandsOfSellerQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_BRANDS_OF_SELLER,
      {
        page: 1,
        sellerId: +slug[0]
      }
    ],
    ({ pageParam = 1 }) => {
      return brandsOfSellerQueryFns({
        sellerId: +slug[0],
        page: pageParam
      })
    },
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return checkLimitPageByCondition(
          lastPage.brandsOfSeller.currentPage <
            lastPage.brandsOfSeller.lastPage,
          allPages
        )
      },
      enabled: !isBrand
    }
  )

  const DesktopSidebar = productsProps.isMobileView ? null : (
    <FiltersSidebarContainer />
  )

  setSidebar(DesktopSidebar)

  return (
    <>
      {(isBrand &&
        (brandToSellerQuery.isLoading || brandToSellerQuery.isFetching) &&
        !brandToSellerQuery.isFetchingNextPage) ||
      (!isBrand &&
        (brandsOfSellerQuery.isLoading || brandsOfSellerQuery.isFetching) &&
        !brandsOfSellerQuery.isFetchingNextPage) ? (
        <div
          className={clsx(
            "grid grid-cols-3 gap p pb-5 md:grid-cols-4 md:bg-alpha-white lg:grid-cols-5"
          )}
        >
          <BrandOrSellerCardSkeleton />
          <BrandOrSellerCardSkeleton />
          <BrandOrSellerCardSkeleton />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:gap-9 md:bg-alpha-white">
          <div className="flex w-full flex-col gap-9">
            {!productsProps.isMobileView && isBrand ? (
              <div className={sortContainerClass}>
                <BrandSort
                  sort={brandSort}
                  onSortChanged={(sort) => {
                    setBrandSort(sort)
                  }}
                />
                {!productsProps.isMobileView && (
                  <TotalItemsReport
                    total={
                      brandToSellerQuery.isLoading ||
                      brandToSellerQuery.isFetching
                        ? undefined
                        : brandToSellerQuery.data?.pages[0].takeBrandToSeller
                            .total
                    }
                    title="فروشندگان این برند"
                  />
                )}
              </div>
            ) : !productsProps.isMobileView && !isBrand ? (
              <div className={sortContainerClass}>
                <SellersSort
                  sort={sort}
                  onSortChanged={(sort) => {
                    setSort(sort)
                  }}
                />{" "}
                {!productsProps.isMobileView && (
                  <TotalItemsReport
                    total={
                      brandsOfSellerQuery.isLoading ||
                      brandsOfSellerQuery.isFetching
                        ? undefined
                        : brandsOfSellerQuery.data?.pages[0].brandsOfSeller
                            .total
                    }
                    title="برندهای این فروشنده"
                  />
                )}
              </div>
            ) : null}

            <BrandsOrSellersContainer
              type={BrandContainerType.Brand_Or_Seller_Profile}
            >
              {({ selectedItemId, setSelectedItemId }) => (
                <>
                  {isBrand ? (
                    <InfiniteScrollPagination
                      CardLoader={BrandOrSellerCardSkeleton}
                      infiniteQuery={brandToSellerQuery}
                    >
                      {(page, ref) => (
                        <>
                          {page.takeBrandToSeller.data.map(
                            (seller, index) =>
                              seller && (
                                <BrandOrSellerCard
                                  ref={
                                    page.takeBrandToSeller.data.length - 1 ===
                                    index
                                      ? ref
                                      : undefined
                                  }
                                  key={seller.id}
                                  selectedItemId={selectedItemId}
                                  setSelectedItemId={setSelectedItemId}
                                  content={{
                                    ...(seller as Seller),
                                    __typename: "Seller"
                                  }}
                                />
                              )
                          )}
                        </>
                      )}
                    </InfiniteScrollPagination>
                  ) : (
                    <InfiniteScrollPagination
                      CardLoader={BrandOrSellerCardSkeleton}
                      infiniteQuery={brandsOfSellerQuery}
                    >
                      {(page, ref) => (
                        <>
                          {page.brandsOfSeller.data.map(
                            (brandsOfSeller, index) =>
                              brandsOfSeller && (
                                <BrandOrSellerCard
                                  selectedItemId={selectedItemId}
                                  setSelectedItemId={setSelectedItemId}
                                  ref={
                                    page.brandsOfSeller.data.length - 1 ===
                                    index
                                      ? ref
                                      : undefined
                                  }
                                  key={brandsOfSeller.id}
                                  content={{
                                    ...(brandsOfSeller as Brand),
                                    __typename: "Brand"
                                  }}
                                />
                              )
                          )}
                        </>
                      )}
                    </InfiniteScrollPagination>
                  )}
                </>
              )}
            </BrandsOrSellersContainer>
          </div>
        </div>
      )}
    </>
  )
}

export default BrandOrSellersTab
