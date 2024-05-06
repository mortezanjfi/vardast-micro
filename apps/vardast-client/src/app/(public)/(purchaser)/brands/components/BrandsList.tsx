"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import NoResult from "@vardast/component/NoResult"
import NotFoundMessage from "@vardast/component/NotFound"
import {
  Brand,
  GetAllBrandsQuery,
  IndexBrandInput,
  SortBrandEnum
} from "@vardast/graphql/generated"
import { getAllBrandsQueryFn } from "@vardast/query/queryFns/allBrandsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"

import BrandSort from "@/app/(public)/(purchaser)/brands/components/BrandSort"
import BrandOrSellerCard, {
  BrandOrSellerCardSkeleton
} from "@/app/components/BrandOrSellerCard"
import BrandsOrSellersContainer, {
  BrandContainerType
} from "@/app/components/BrandsOrSellersContainer"
import DesktopMobileViewOrganizer from "@/app/components/DesktopMobileViewOrganizer"
import InfiniteScrollPagination from "@/app/components/InfiniteScrollPagination"
import { checkLimitPageByCondition } from "@/app/components/product-list"

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
  // const [queryTemp, setQueryTemp] = useState<string>("")

  const [sort, setSort] = useState<SortBrandEnum>(
    args.sortType || SortBrandEnum.Newest
  )
  const pathname = usePathname()
  const { push } = useRouter()
  const searchParams = useSearchParams()

  const [filterAttributes, setFilterAttributes] = useState<[]>([])
  // const [filterAttributes, setFilterAttributes] = useState<FilterAttribute[]>(
  //   []
  // )

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
    <div className="top-40 h-fit border-alpha-200 bg-alpha-white px-4 py-4 sm:sticky md:w-[250px] md:min-w-[200px] md:rounded md:border-2 md:bg-inherit">
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

export default BrandsList
