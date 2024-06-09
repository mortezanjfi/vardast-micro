"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import BrandOrSellerCard, {
  BrandOrSellerCardSkeleton
} from "@vardast/component/BrandOrSellerCard"
import BrandsOrSellersContainer, {
  BrandContainerType
} from "@vardast/component/BrandsOrSellersContainer"
import DesktopMobileViewOrganizer from "@vardast/component/DesktopMobileViewOrganizer"
import InfiniteScrollPagination from "@vardast/component/InfiniteScrollPagination"
import NoResult from "@vardast/component/NoResult"
import NotFoundMessage from "@vardast/component/NotFound"
import { checkLimitPageByCondition } from "@vardast/component/product-list"
import {
  GetAllSellersQuery,
  IndexBrandInput,
  Seller
} from "@vardast/graphql/generated"
import { setSidebar } from "@vardast/provider/LayoutProvider/use-layout"
import { getAllSellersQueryFn } from "@vardast/query/queryFns/allSellersQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"

import SellersSort, {
  SellerSortStatic
} from "@/app/(client)/sellers/components/SellerSort"

type SellersListProps = {
  limitPage?: number
  args: IndexBrandInput
  isMobileView: boolean
  brandId?: number
  sellerId?: number
  hasFilter?: boolean
  isSellerPanel?: boolean
}

const SellersList = ({ limitPage, args, isMobileView }: SellersListProps) => {
  // const [queryTemp, setQueryTemp] = useState<string>("")
  const [sort, setSort] = useState<SellerSortStatic>(SellerSortStatic.Newest)
  const [filterAttributes, setFilterAttributes] = useState<[]>([])
  const pathname = usePathname()
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const allSellersQuery = useInfiniteQuery<GetAllSellersQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_SELLERS_QUERY_KEY,
      {
        ...args,
        // name: query,
        page: args.page || 1
      }
    ],
    ({ pageParam = 1 }) =>
      getAllSellersQueryFn({
        ...args,
        // name: query,
        page: pageParam
      }),
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return limitPage
          ? checkLimitPageByCondition(
              lastPage.sellers.currentPage <= limitPage,
              allPages
            )
          : checkLimitPageByCondition(
              lastPage.sellers.currentPage < lastPage.sellers.lastPage,
              allPages
            )
      }
    }
  )

  const DesktopHeader = (
    <div className="flex items-center justify-between md:pb-8">
      <SellersSort
        sort={sort}
        onSortChanged={(sort) => {
          setSort(sort)
          const params = new URLSearchParams(searchParams as any)
          params.set("orderBy", `${sort}`)
          push(pathname + "?" + params.toString())
        }}
      />
    </div>
  )

  const Content =
    allSellersQuery.isFetching && allSellersQuery.isLoading ? (
      <BrandsOrSellersContainer type={BrandContainerType.Brands_Page_List}>
        {() => (
          <>
            {[...Array(20)].map((_, index) => (
              <BrandOrSellerCardSkeleton
                key={`seller-page-skeleton-${index}`}
              />
            ))}
          </>
        )}
      </BrandsOrSellersContainer>
    ) : !allSellersQuery.data ? (
      <NoResult entity="seller" />
    ) : allSellersQuery.data.pages.length ? (
      <BrandsOrSellersContainer type={BrandContainerType.Brands_Page_List}>
        {({ selectedItemId, setSelectedItemId }) => (
          <InfiniteScrollPagination
            CardLoader={() => <BrandOrSellerCardSkeleton />}
            infiniteQuery={allSellersQuery}
          >
            {(page, ref) => (
              <>
                {page.sellers.data.map(
                  (seller, index) =>
                    seller && (
                      <BrandOrSellerCard
                        selectedItemId={selectedItemId}
                        setSelectedItemId={setSelectedItemId}
                        ref={
                          page.sellers.data.length - 1 === index
                            ? ref
                            : undefined
                        }
                        key={seller.id}
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
        )}
      </BrandsOrSellersContainer>
    ) : (
      <NotFoundMessage />
    )

  const DesktopSidebar = (
    <div className="flex flex-col gap-9">
      <div className=" flex items-center border-b-2 border-b-alpha-200 py-4">
        <strong>فیلترها</strong>
        {filterAttributes.length > 0 && (
          <Button
            size="small"
            noStyle
            className="ms-auto text-sm text-red-500"
            onClick={() => setFilterAttributes([])}
          >
            حذف همه فیلترها
          </Button>
        )}
      </div>
    </div>
  )

  setSidebar(DesktopSidebar)

  return (
    <DesktopMobileViewOrganizer
      isMobileView={isMobileView}
      Content={Content}
      DesktopHeader={DesktopHeader}
      DesktopSidebar={<></>}
    />
  )
}

export default SellersList
