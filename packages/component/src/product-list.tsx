"use client"

import { useContext, useEffect, useState } from "react"
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation"
import { useDebouncedState } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import {
  FilterAttribute,
  GetAllProductsQuery,
  IndexProductInput,
  InputMaybe,
  Product,
  ProductSortablesEnum,
  useGetAllFilterableAttributesBasicsQuery
} from "@vardast/graphql/generated"
import { setSidebar } from "@vardast/provider/LayoutProvider/use-layout"
import { PublicContext } from "@vardast/provider/PublicProvider"
import graphqlRequestClientWithoutToken from "@vardast/query/queryClients/graphqlRequestClientWithoutToken"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/allProductsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"
import { Input } from "@vardast/ui/input"
import { ClientError } from "graphql-request"
import { useSetAtom } from "jotai"
import {
  Loader2,
  LucideSearch,
  LucideSlidersHorizontal,
  LucideSortDesc,
  LucideX
} from "lucide-react"

import CategoryFilterSection from "./brand/CategoryFilterSection"
import ListHeader from "./desktop/ListHeader"
import DesktopMobileViewOrganizer from "./DesktopMobileViewOrganizer"
import FiltersContainer from "./filters-container"
import FiltersSidebarContainer from "./filters-sidebar-container"
import InfiniteScrollPagination from "./InfiniteScrollPagination"
import LoadingFailed from "./LoadingFailed"
import MobileCategoriesFilter from "./mobile-categories-filter"
import MobileFilterableAttributes from "./mobile-filterable-attributes"
import MobileSortFilter from "./mobile-sort-filter"
import NoResult from "./NoResult"
import NotFoundMessage from "./NotFound"
import ProductCard, { ProductCardSkeleton } from "./product-card"
import ProductSort from "./product-sort"
import ProductListContainer, {
  ProductContainerType
} from "./ProductListContainer"
import BrandsFilterSection from "./products/BrandsFilterSection"

interface ProductListProps {
  needCategoryFilterSection?: boolean
  hasTitle?: boolean
  isMobileView: boolean
  args: IndexProductInput
  sellerId?: number
  hasFilter?: boolean
  isSellerPanel?: boolean
  limitPage?: number
  hasSearch?: boolean
  setCategoriesCount?: (_?: any) => void
  containerType?: ProductContainerType
}

export const checkLimitPageByCondition = (condition: boolean, result: any[]) =>
  condition ? result.length + 1 : undefined

const ProductList = ({
  needCategoryFilterSection = false,
  hasTitle = true,
  isMobileView,
  args,
  sellerId,
  setCategoriesCount,
  limitPage,
  hasFilter = true,
  isSellerPanel,
  hasSearch = false,
  containerType = ProductContainerType.LARGE_LIST
}: ProductListProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { push } = useRouter()
  const [query, setQuery] = useDebouncedState<string>("", 500)
  const [queryTemp, setQueryTemp] = useState<string>("")

  const [sort, setSort] = useState<ProductSortablesEnum>(undefined)
  const [filterAttributes, setFilterAttributes] = useState<FilterAttribute[]>(
    args.attributes || []
  )

  const [categoryIdsFilter, setCategoryIdsFilter] = useState<
    (typeof args)["categoryIds"]
  >(args.categoryIds || [])

  const {
    categoriesFilterVisibilityAtom,
    sortFilterVisibilityAtom,
    filtersVisibilityAtom
  } = useContext(PublicContext)
  const setCategoriesFilterVisibility = useSetAtom(
    categoriesFilterVisibilityAtom
  )
  const setSortFilterVisibility = useSetAtom(sortFilterVisibilityAtom)
  const setFiltersVisibility = useSetAtom(filtersVisibilityAtom)
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
  // const brandName = searchParams.get("brandName")
  // const sellerName = searchParams.get("sellerName")
  const getFilterableAttributesQuery = useGetAllFilterableAttributesBasicsQuery(
    graphqlRequestClientWithoutToken,
    {
      filterableAttributesInput: {
        categoryId:
          !!args.categoryIds && args.categoryIds.length === 1
            ? args.categoryIds[0]
            : 0
      }
    },
    {
      enabled: !!args.categoryIds && args.categoryIds.length === 1
    }
  )

  const allProductsQuery = useInfiniteQuery<GetAllProductsQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        ...args,
        categoryIds: categoryIdsFilter,
        brandId: args.brandId ? args.brandId : selectedBrand,
        query,
        page: args.page || 1,
        attributes: filterAttributes,
        orderBy: sort
      }
    ],
    ({ pageParam = 1 }) => {
      return getAllProductsQueryFn({
        ...args,
        categoryIds: categoryIdsFilter,

        brandId: args.brandId ? args.brandId : selectedBrand,
        query,
        page: pageParam,
        attributes: filterAttributes,
        orderBy: sort
      })
    },
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return limitPage
          ? checkLimitPageByCondition(
              lastPage.products.currentPage <= limitPage,
              allPages
            )
          : checkLimitPageByCondition(
              lastPage.products.currentPage < lastPage.products.lastPage,
              allPages
            )
      }
    }
  )

  useEffect(() => {
    if (setCategoriesCount) {
      setCategoriesCount &&
        setCategoriesCount(allProductsQuery.data?.pages[0].products.total)
    }
  }, [allProductsQuery.data?.pages, setCategoriesCount])

  // if (allProductsQuery.isLoading) return <Loading />
  if (allProductsQuery.error) {
    if (
      (allProductsQuery?.error as ClientError)?.response?.errors?.at(0)
        ?.extensions.status === 404
    ) {
      return notFound()
    }
    return <LoadingFailed />
  }

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

  // if (!allProductsQuery.data) return <NoResult entity="product" />

  const onFilterAttributesChanged = ({
    status,
    id,
    value
  }: FilterAttribute & { status: boolean | "indeterminate" }) => {
    setFilterAttributes((values) => {
      let tmp = values
      if (status === true) {
        tmp = [
          ...tmp,
          {
            id,
            value
          }
        ]
      } else if (status === false) {
        tmp = tmp.filter(
          (item) => `${item.id}+${item.value}` !== `${id}+${value}`
        )
      }

      const params = new URLSearchParams(searchParams as any)
      const paramsKeys = params.keys()
      for (const key of paramsKeys) {
        if (key.includes("attributes[")) {
          params.delete(key)
        }
      }
      tmp.forEach((attribute) => {
        params.append(`attributes[${attribute.id}]`, attribute.value)
      })
      push(pathname + "?" + params.toString())

      return tmp
    })
  }

  const onCategoryIdsFilterChanged = ({
    status,
    value
  }: { value: InputMaybe<number> } & { status: boolean | "indeterminate" }) => {
    setCategoryIdsFilter((values) => {
      let tmp: InputMaybe<number[]> = values || []
      if (status === true) {
        tmp = Array.isArray(tmp)
          ? ([...tmp, value] as InputMaybe<number[]>)
          : ([value] as InputMaybe<number[]>)
      } else if (status === false) {
        tmp = tmp.filter((item) => item !== value)
      }

      const params = new URLSearchParams(searchParams as any)
      const paramsKeys = params.keys()
      for (const key of paramsKeys) {
        if (key.includes("categoryId") || key.includes("attributes[")) {
          params.delete(key)
        }
      }

      setFilterAttributes([])

      tmp &&
        tmp
          .filter((item, pos) => {
            return tmp && tmp.indexOf(item) == pos
          })
          .forEach((item) => {
            item && params.append(`categoryId`, `${item}`)
          })
      push(pathname + "?" + params.toString())

      return tmp
    })
  }

  const removeAllFilters = () => {
    const params = new URLSearchParams(searchParams as any)
    const paramsKeys = params.keys()
    for (const key of paramsKeys) {
      if (key.includes("categoryId") || key.includes("attributes[")) {
        params.delete(key)
      }
    }

    setFilterAttributes([])
    setCategoryIdsFilter(null)

    push(pathname + "?" + params.toString())
  }

  const DesktopSidebar = (
    <FiltersSidebarContainer
      sort={
        <ProductSort
          sort={sort}
          onSortChanged={(sort) => {
            setSort(sort)
            const params = new URLSearchParams(searchParams as any)
            params.set("orderBy", `${sort}`)
            push(pathname + "?" + params.toString())
          }}
        />
      }
      filters={
        <>
          {needCategoryFilterSection && (
            <CategoryFilterSection
              setSelectedCategoryIds={setCategoryIdsFilter}
              selectedCategoryIds={categoryIdsFilter}
            />
          )}

          {!args.brandId && (
            <BrandsFilterSection
              setSelectedBrand={setSelectedBrand}
              selectedBrand={selectedBrand}
            />
          )}

          {/* {sellerId && isMobileView && (
            <BrandOrSellerCategoryFilter
              categoryIdsFilter={categoryIdsFilter}
              onCategoryIdsFilterChanged={onCategoryIdsFilterChanged}
              sellerId={sellerId}
            />
          )} */}
          {args.categoryIds &&
            args.categoryIds.length === 1 &&
            args.categoryIds[0] !== 0 &&
            getFilterableAttributesQuery?.data?.filterableAttributes?.filters
              .length > 0 && (
              <FiltersContainer
                selectedCategoryId={args.categoryIds[0]}
                filterAttributes={filterAttributes}
                onFilterAttributesChanged={onFilterAttributesChanged}
              />
            )}
        </>
      }
      /* {hasSearch && (
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
      )} */

      /* {selectedCategoryIds &&
          selectedCategoryIds.length === 1 &&
          !brandId &&
          !sellerId && (
            <CategoryFilter selectedCategoryId={selectedCategoryIds[0]} />
          )} */

      /* {(brandName || sellerName) && (
          <div className="flex w-full items-center justify-between border-b-2 border-b-alpha-200 py-6">
            <span className="font-semibold">
              {brandName ? "برند" : "فروشنده"}
            </span>
            <Button
              noStyle
              className={clsx([
                "flex gap-2 rounded-lg  border border-alpha-300 bg-alpha-100  px-3 py-2 text-sm "
              ])}
              onClick={() => {
                removeBrandOrSellerFilter()
              }}
            >
              {brandName ? brandName : sellerName}
              <XMarkIcon width={16} height={16} />
            </Button>
          </div>
        )} */

      /* {!selectedCategoryIds && !brandId && !sellerId && <VocabularyFilter />} */
    />
  )

  const MobileHeader = (
    <>
      <div className="sticky top-0 z-30 border-b border-b-alpha-300 bg-alpha-white p-4">
        {hasSearch && (
          <div className="relative flex transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
            {queryTemp !== query ? (
              <Loader2 className="h-6 w-6 animate-spin text-alpha-400" />
            ) : (
              <LucideSearch className="h-6 w-6 text-primary" />
            )}
            <Input
              autoFocus
              className="flex h-full
                w-full
                items-center
                gap-2
                rounded-lg
                bg-alpha-100
                px-4
                py-3
                focus:!ring-0 disabled:bg-alpha-100"
              defaultValue={query}
              placeholder="نام کالا | برند | فروشنده | دسته بندی | SKU"
              type="text"
              value={queryTemp}
              onChange={(e) => {
                setQueryTemp(e.target.value)
                setQuery(e.target.value)
              }}
            />
            <Button
              className="rounded-full"
              iconOnly
              size="small"
              variant="ghost"
              onClick={() => {
                setQuery("")
                setQueryTemp("")
              }}
            >
              <LucideX className="icon" />
            </Button>
          </div>
        )}
        <div className="grid grid-cols-2">
          <MobileCategoriesFilter
            categoryId={args.categoryIds}
            brandId={args.brandId}
            sellerId={sellerId}
            categoryIdsFilter={categoryIdsFilter}
            onCategoryFilterChanged={({ status, value }) => {
              onCategoryIdsFilterChanged({ status, value })
              setCategoriesFilterVisibility(false)
            }}
          />
          <MobileSortFilter
            sort={sort}
            onSortChanged={(sort) => {
              setSortFilterVisibility(false)
              setSort(sort)
              const params = new URLSearchParams(searchParams as any)
              params.set("orderBy", `${sort}`)
              push(pathname + "?" + params.toString())
            }}
          />
          <MobileFilterableAttributes
            filterAttributes={filterAttributes}
            selectedCategoryId={args.categoryIds}
            onFilterAttributesChanged={({ status, id, value }) => {
              onFilterAttributesChanged({ status, id, value })
              setFiltersVisibility(false)
            }}
            onRemoveAllFilters={() => {
              removeAllFilters()
              setFiltersVisibility(false)
            }}
          />

          {/* 
        dont use this part of code
        <Button
          onClick={() => setCategoriesFilterVisibility(true)}
          size="small"
          variant="secondary"
          className="rounded-full border border-alpha-200"
        >
          <LucideLayoutGrid className="icon text-alpha" />
          دسته‌بندی‌ها
        </Button> */}
          <Button
            className=" h-full w-full rounded-none !border-l border-alpha-300  py-0 !text-alpha-black"
            size="small"
            variant="ghost"
            onClick={() => setSortFilterVisibility(true)}
          >
            <LucideSortDesc className="icon text-alpha" />
            مرتب‌سازی
          </Button>
          <Button
            // disabled={
            //   !selectedCategoryIds ||
            //   !(selectedCategoryIds.length > 0) ||
            //   !getFilterableAttributesQuery.data ||
            //   !(
            //     getFilterableAttributesQuery.data.filterableAttributes.filters
            //       .length > 0
            //   )
            // }
            className=" h-full w-full rounded-none py-0  !text-alpha-black"
            onClick={() => setFiltersVisibility(true)}
            size="small"
            variant="ghost"
          >
            {filterAttributes.length > 0 && (
              <span className="absolute right-1 top-1 block h-2.5 w-2.5 rounded-full bg-primary-500"></span>
            )}
            <LucideSlidersHorizontal className="icon text-alpha" />
            فیلترها
          </Button>
        </div>
      </div>
      <ListHeader
        listName={"products"}
        secondTitle="product"
        total={allProductsQuery?.data?.pages[0]?.products?.total}
      />
    </>
  )

  const Content =
    allProductsQuery.isLoading && allProductsQuery.isFetching ? (
      <ProductListContainer type={ProductContainerType.PRODUCT_PAGE_LIST}>
        {() => (
          <>
            {[...Array(10)].map((_, index) => (
              <ProductCardSkeleton
                containerType={containerType}
                key={`product-page-skeleton-${index}`}
              />
            ))}
          </>
        )}
      </ProductListContainer>
    ) : !allProductsQuery.data ? (
      <NoResult entity="product" />
    ) : allProductsQuery.data.pages.length ? (
      <ProductListContainer type={ProductContainerType.PRODUCT_PAGE_LIST}>
        {({ selectedItemId, setSelectedItemId }) => (
          <InfiniteScrollPagination
            CardLoader={() => (
              <ProductCardSkeleton containerType={containerType} />
            )}
            infiniteQuery={allProductsQuery}
          >
            {(page, ref) => (
              <>
                {page.products.data.map((product, index) => (
                  <ProductCard
                    containerType={containerType}
                    isSellerPanel={isSellerPanel}
                    key={product?.id}
                    product={product as Product}
                    ref={
                      page.products.data.length - 1 === index ? ref : undefined
                    }
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                  />
                ))}
              </>
            )}
          </InfiniteScrollPagination>
        )}
      </ProductListContainer>
    ) : (
      <NotFoundMessage />
    )

  setSidebar(DesktopSidebar)

  return (
    <DesktopMobileViewOrganizer
      Content={Content}
      DesktopHeader={
        hasTitle && (
          <ListHeader
            listName={"products"}
            secondTitle="product"
            total={allProductsQuery?.data?.pages[0]?.products?.total}
          />
        )
      }
      // DesktopHeader={<></>}
      MobileHeader={hasFilter ? MobileHeader : <></>}
      isMobileView={isMobileView}
    />
  )
}

export default ProductList
