"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import NoResult from "@vardast/component/NoResult"
import NotFoundMessage from "@vardast/component/NotFound"
import {
  GetAllSellersQuery,
  IndexBrandInput,
  Seller
} from "@vardast/graphql/generated"
import { getAllSellersQueryFn } from "@vardast/query/queryFns/allSellersQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"

import SellersSort, {
  SellerSortStatic
} from "@/app/(public)/(purchaser)/sellers/components/SellerSort"
import BrandOrSellerCard, {
  BrandOrSellerCardSkeleton
} from "@/app/components/BrandOrSellerCard"
import BrandsOrSellersContainer, {
  BrandContainerType
} from "@/app/components/BrandsOrSellersContainer"
import DesktopMobileViewOrganizer from "@/app/components/DesktopMobileViewOrganizer"
import InfiniteScrollPagination from "@/app/components/InfiniteScrollPagination"
import { checkLimitPageByCondition } from "@/app/components/product-list"

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
    <div className="top-40 h-fit border-alpha-200 bg-alpha-white px-4 py-4 md:sticky md:w-[250px] md:min-w-[200px] md:rounded md:border-2 md:bg-inherit">
      {/* {hasSearch && (
        <div className="relative flex transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
          {queryTemp !== query ? (
            <Loader2 className="h-6 w-6 animate-spin text-alpha-400" />
          ) : (
            <LucideSearch className="h-6 w-6 text-primary" />
          )}
          <Input
            autoFocus
            value={queryTemp}
            defaultValue={query}
            onChange={(e) => {
              setQueryTemp(e.target.value)
              setQuery(e.target.value)
            }}
            type="text"
            placeholder="نام کالا | برند | فروشنده | دسته بندی | SKU"
            className="flex h-full
                  w-full
                  items-center
                  gap-2
                  rounded-lg
                  bg-alpha-100
                  px-4
                  py-3
                  focus:!ring-0 disabled:bg-alpha-100"
          />
          <Button
            variant="ghost"
            size="small"
            iconOnly
            className="rounded-full"
            onClick={() => {
              setQuery("")
              setQueryTemp("")
            }}
          >
            <LucideX className="icon" />
          </Button>
        </div>
      )} */}
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
        {/* {selectedCategoryIds &&
            selectedCategoryIds.length === 1 &&
            !brandId &&
            !sellerId && (
              <CategoryFilter selectedCategoryId={selectedCategoryIds[0]} />
            )} */}

        {/* {brandId && (
          <BrandOrSellerCategoryFilter
            categoryIdsFilter={categoryIdsFilter}
            onCategoryIdsFilterChanged={onCategoryIdsFilterChanged}
            brandId={brandId}
          />
        )} */}

        {/* {sellerId && (
          <BrandOrSellerCategoryFilter
            categoryIdsFilter={categoryIdsFilter}
            onCategoryIdsFilterChanged={onCategoryIdsFilterChanged}
            sellerId={sellerId}
          />
        )} */}

        {/* {selectedCategoryIds &&
          selectedCategoryIds.length === 1 &&
          selectedCategoryIds[0] !== 0 && (
            <FiltersContainer
              selectedCategoryId={selectedCategoryIds[0]}
              filterAttributes={filterAttributes}
              onFilterAttributesChanged={onFilterAttributesChanged}
            />
          )} */}

        {/* {!selectedCategoryIds && !brandId && !sellerId && <VocabularyFilter />} */}
      </div>
    </div>
  )

  return (
    <DesktopMobileViewOrganizer
      isMobileView={isMobileView}
      Content={Content}
      DesktopHeader={DesktopHeader}
      DesktopSidebar={DesktopSidebar}
    ></DesktopMobileViewOrganizer>
  )
}

export default SellersList
