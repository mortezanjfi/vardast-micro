"use client"

import { useContext, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedState } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useSetAtom } from "jotai"
import { LucideSlidersHorizontal, LucideSortDesc } from "lucide-react"
import { TypeOf, z } from "zod"

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
import { Input } from "../../../ui/src/input"
import BrandCard, { BrandCardSkeleton } from "../brand/BrandCard"
import BrandsOrSellersContainer, {
  BrandContainerType
} from "../BrandsOrSellersContainer"
import ListHeader from "../desktop/ListHeader"
import DesktopMobileViewOrganizer from "../DesktopMobileViewOrganizer"
import DynamicHeroIcon from "../DynamicHeroIcon"
import FiltersSidebarContainer from "../filters-sidebar-container"
import InfiniteScrollPagination from "../InfiniteScrollPagination"
import NoResult from "../NoResult"
import NotFoundMessage from "../NotFound"
import { checkLimitPageByCondition } from "../product-list"
import BrandSortFilter from "./BrandSortFilter"
import CategoryFilterSection from "./CategoryFilterSection"
import CityFilterSection from "./CityFilterSection"

type BrandsListProps = {
  hasTitle?: boolean
  limitPage?: number
  args: IndexBrandInput
  isMobileView: boolean
  brandId?: number
  sellerId?: number
  hasFilter?: boolean
  isSellerPanel?: boolean
}

const filterSchema = z.object({
  categoryId: z.number().optional()
})

export type BrandsFilterFields = TypeOf<typeof filterSchema>
const BrandsList = ({
  hasTitle = true,
  limitPage,
  args,
  isMobileView
}: BrandsListProps) => {
  const { sortFilterVisibilityAtom, filtersVisibilityAtom } =
    useContext(PublicContext)

  const setSortFilterVisibility = useSetAtom(sortFilterVisibilityAtom)
  const setFiltersVisibility = useSetAtom(filtersVisibilityAtom)

  const [sort, setSort] = useState<SortBrandEnum>(undefined)
  const pathname = usePathname()
  const { push } = useRouter()
  const searchParams = useSearchParams()

  const [filterAttributes, setFilterAttributes] = useState<[]>([])
  const [brandsQuery, setBrandsQuery] = useDebouncedState("", 500)
  const [brandsQueryTemp, setBrandsQueryTemp] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<
    number[] | null
  >([])
  const [selectedCityId, setSelectedCityId] = useState<number | null>()
  useEffect(() => {
    args["categoryIds"] = selectedCategoryIds
  }, [selectedCategoryIds])
  const allBrandsQuery = useInfiniteQuery<GetAllBrandsQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_ALL_BRANDS_QUERY_KEY,
      {
        ...args,
        page: args.page,
        sortType: sort && sort,
        categoryId: args.categoryId,
        name: brandsQuery,
        categoryIds: selectedCategoryIds,
        cityId: selectedCityId
      }
    ],
    ({ pageParam = 1 }) =>
      getAllBrandsQueryFn({
        ...args,
        name: brandsQuery,
        page: pageParam,
        sortType: sort && sort,
        categoryId: args.categoryId,
        categoryIds: selectedCategoryIds,
        cityId: selectedCityId
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
        {(_) => (
          <InfiniteScrollPagination
            CardLoader={() => <BrandCardSkeleton />}
            infiniteQuery={allBrandsQuery}
          >
            {(page, ref) => (
              <>
                {page.brands.data.map(
                  (brand, index) =>
                    brand && (
                      <BrandCard
                        isMobileView={isMobileView}
                        ref={
                          page.brands.data.length - 1 === index
                            ? ref
                            : undefined
                        }
                        brand={brand as Brand}
                      />

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
      <div className="flex flex-col gap-5">
        <BrandSortFilter
          searchParams={searchParams}
          pathname={pathname}
          setSort={setSort}
          sort={sort}
        />
        <div className="flex flex-col">
          {" "}
          <div className=" flex items-center border-b-2 border-b-alpha-200 py-4">
            <div className="flex items-center gap-2">
              <DynamicHeroIcon
                icon="AdjustmentsHorizontalIcon"
                className="h-7 w-7"
                solid
              />
              <strong>فیلترها</strong>
            </div>{" "}
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
          </div>{" "}
          <Input
            autoFocus
            value={brandsQueryTemp}
            onChange={(e) => {
              setBrandsQueryTemp(e.target.value)
              setBrandsQuery(e.target.value)
            }}
            type="text"
            placeholder="نام برند"
            className="my-4 flex h-full w-full
                          items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                          py-3.5
                           focus:!ring-0 disabled:bg-alpha-100"
          />
          <CategoryFilterSection
            setSelectedCategoryIds={setSelectedCategoryIds}
            selectedCategoryIds={selectedCategoryIds}
          />
          <CityFilterSection
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
          />
        </div>
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
        hasTitle && (
          <ListHeader
            secondTitle="brand"
            borderBottom
            total={allBrandsQuery?.data?.pages[0].brands?.total}
            listName={"brands"}
          />
        )
      }
    />
  )
}

export default BrandsList
