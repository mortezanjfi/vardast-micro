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
  Brand,
  GetAllBrandsQuery,
  IndexBrandInput,
  SortBrandEnum
} from "@vardast/graphql/generated"
import { setSidebar } from "@vardast/provider/LayoutProvider"
import { getAllBrandsQueryFn } from "@vardast/query/queryFns/allBrandsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"

import BrandSort from "@/app/(client)/brands/components/BrandSort"

type BrandsListProps = {
  limitPage?: number
  args: IndexBrandInput
  isMobileView: boolean
  brandId?: number
  sellerId?: number
  hasFilter?: boolean
  isSellerPanel?: boolean
}

const BrandsList = ({ limitPage, args, isMobileView }: BrandsListProps) => {
  const [sort, setSort] = useState<SortBrandEnum>(
    args.sortType || SortBrandEnum.Newest
  )
  const pathname = usePathname()
  const { push } = useRouter()
  const searchParams = useSearchParams()

  const [filterAttributes, setFilterAttributes] = useState<[]>([])

  const allBrandsQuery = useInfiniteQuery<GetAllBrandsQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_ALL_BRANDS_QUERY_KEY,
      {
        ...args,
        page: args.page,
        sortType: sort
      }
    ],
    ({ pageParam = 1 }) =>
      getAllBrandsQueryFn({
        ...args,
        page: pageParam,
        sortType: sort
      }),
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return limitPage
          ? checkLimitPageByCondition(
              lastPage.brands.currentPage <= limitPage,
              allPages
            )
          : checkLimitPageByCondition(
              lastPage.brands.currentPage < lastPage.brands.lastPage,
              allPages
            )
      }
    }
  )

  const DesktopHeader = (
    <div className="flex items-center justify-between md:pb-8">
      <BrandSort
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
    allBrandsQuery.isFetching && allBrandsQuery.isLoading ? (
      <BrandsOrSellersContainer type={BrandContainerType.Brands_Page_List}>
        {() => (
          <>
            {[...Array(20)].map((_, index) => (
              <BrandOrSellerCardSkeleton key={`brand-page-skeleton-${index}`} />
            ))}
          </>
        )}
      </BrandsOrSellersContainer>
    ) : !allBrandsQuery.data ? (
      <NoResult entity="brand" />
    ) : allBrandsQuery.data.pages.length ? (
      <BrandsOrSellersContainer type={BrandContainerType.Brands_Page_List}>
        {({ selectedItemId, setSelectedItemId }) => (
          <InfiniteScrollPagination
            CardLoader={() => <BrandOrSellerCardSkeleton />}
            infiniteQuery={allBrandsQuery}
          >
            {(page, ref) => (
              <>
                {page.brands.data.map(
                  (brand, index) =>
                    brand && (
                      <BrandOrSellerCard
                        selectedItemId={selectedItemId}
                        setSelectedItemId={setSelectedItemId}
                        ref={
                          page.brands.data.length - 1 === index
                            ? ref
                            : undefined
                        }
                        key={brand.id}
                        content={{ ...(brand as Brand), __typename: "Brand" }}
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

export default BrandsList
