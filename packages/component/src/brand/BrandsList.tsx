"use client"

import { useContext, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useSetAtom } from "jotai"
import { LucideSlidersHorizontal, LucideSortDesc } from "lucide-react"

import MobileBrandSortFilter from "../../../../apps/vardast-client/src/app/(client)/brands/components/MobilBrandSortFilter"
import {
  Brand,
  GetAllBrandsQuery,
  IndexBrandInput,
  SortBrandEnum
} from "../../../graphql/src/generated"
import { setSidebar } from "../../../provider/src/LayoutProvider/use-layout"
import { PublicContext } from "../../../provider/src/PublicProvider"
import { getAllBrandsQueryFn } from "../../../query/src/queryFns/allBrandsQueryFns"
import QUERY_FUNCTIONS_KEY from "../../../query/src/queryFns/queryFunctionsKey"
import { Button } from "../../../ui/src/button"
import BrandCard, { BrandCardSkeleton } from "../brand/BrandCard"
import BrandsOrSellersContainer, {
  BrandContainerType
} from "../BrandsOrSellersContainer"
import ListHeader from "../desktop/ListHeader"
import DesktopMobileViewOrganizer from "../DesktopMobileViewOrganizer"
import FiltersSidebarContainer from "../filters-sidebar-container"
import InfiniteScrollPagination from "../InfiniteScrollPagination"
import NoResult from "../NoResult"
import NotFoundMessage from "../NotFound"
import { checkLimitPageByCondition } from "../product-list"
import BrandSortFilter from "./BrandSortFilter"

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
  const { sortFilterVisibilityAtom, filtersVisibilityAtom } =
    useContext(PublicContext)

  const setSortFilterVisibility = useSetAtom(sortFilterVisibilityAtom)
  const setFiltersVisibility = useSetAtom(filtersVisibilityAtom)

  const [sort, setSort] = useState<SortBrandEnum>(
    args.sortType || SortBrandEnum.Sum
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
        sortType: sort,
        categoryId: args.categoryId
      }
    ],
    ({ pageParam = 1 }) =>
      getAllBrandsQueryFn({
        ...args,
        page: pageParam,
        sortType: sort,
        categoryId: args.categoryId
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

  // const DesktopHeader = (
  //   <div className="flex items-center justify-between md:pb-8">
  //     <BrandSort
  //       sort={sort}
  //       onSortChanged={(sort) => {
  //         setSort(sort)
  //         const params = new URLSearchParams(searchParams as any)
  //         params.set("orderBy", `${sort}`)
  //         push(pathname + "?" + params.toString())
  //       }}
  //     />
  //   </div>
  // )

  const Content =
    allBrandsQuery.isFetching && allBrandsQuery.isLoading ? (
      <BrandsOrSellersContainer type={BrandContainerType.BRANDS_PAGE_LIST}>
        {() => (
          <>
            {[...Array(20)].map((_, index) => (
              <BrandCardSkeleton key={`brand-page-skeleton-${index}`} />
            ))}
          </>
        )}
      </BrandsOrSellersContainer>
    ) : !allBrandsQuery.data ? (
      <NoResult entity="brand" />
    ) : allBrandsQuery.data.pages.length ? (
      <BrandsOrSellersContainer type={BrandContainerType.BRANDS_PAGE_LIST}>
        {({ selectedItemId, setSelectedItemId }) => (
          <InfiniteScrollPagination
            CardLoader={() => <BrandCardSkeleton />}
            infiniteQuery={allBrandsQuery}
          >
            {(page, ref) => (
              <>
                {page.brands.data.map(
                  (brand, index) =>
                    brand && (
                      <div className="px-3 py-6 ring-alpha-200">
                        <BrandCard
                          isMobileView={isMobileView}
                          ref={
                            page.brands.data.length - 1 === index
                              ? ref
                              : undefined
                          }
                          brand={brand as Brand}
                        />
                      </div>

                      // <BrandOrSellerCard
                      //   selectedItemId={selectedItemId}
                      //   setSelectedItemId={setSelectedItemId}
                      //   ref={
                      //     page.brands.data.length - 1 === index
                      //       ? ref
                      //       : undefined
                      //   }
                      //   key={brand.id}
                      //   content={{ ...(brand as Brand), __typename: "Brand" }}
                      // />
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
    <FiltersSidebarContainer>
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
        <BrandSortFilter
          sort={sort}
          onSortChanged={(sort) => {
            setSort(sort)
            const params = new URLSearchParams(searchParams as any)
            params.set("orderBy", `${sort}`)
            push(pathname + "?" + params.toString())
          }}
        />
      </div>
    </FiltersSidebarContainer>
  )

  //mobile--------------------->
  const MobileHeader = (
    <div className="sticky top-0 z-30 border-b border-b-alpha-300 bg-alpha-white p-4">
      <div className="grid grid-cols-2">
        <MobileBrandSortFilter
          sort={sort}
          onSortChanged={(sort) => {
            console.log(sort)
            setSort(sort)
            const params = new URLSearchParams(searchParams as any)
            params.set("orderBy", `${sort}`)
            push(pathname + "?" + params.toString())
            setSortFilterVisibility(false)
          }}
        />
        <Button
          onClick={() => setSortFilterVisibility(true)}
          size="small"
          variant="ghost"
          className=" h-full w-full rounded-none !border-l border-alpha-300 py-0 !text-alpha-black"
        >
          <LucideSortDesc className="icon text-alpha" />
          مرتب‌سازی
        </Button>
        <Button
          disabled
          onClick={() => setFiltersVisibility(true)}
          size="small"
          variant="ghost"
          className=" h-full w-full rounded-none py-0  !text-alpha-black"
        >
          <LucideSlidersHorizontal className="icon text-alpha" />
          فیلترها
        </Button>
      </div>
    </div>
  )
  setSidebar(DesktopSidebar)

  return (
    <DesktopMobileViewOrganizer
      isMobileView={isMobileView}
      Content={Content}
      MobileHeader={MobileHeader}
      DesktopHeader={
        <ListHeader
          borderBottom
          total={allBrandsQuery?.data?.pages[0].brands?.total}
          listName={"brands"}
        />
      }
      DesktopSidebar={<></>}
    />
  )
}

export default BrandsList