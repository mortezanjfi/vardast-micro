"use client"

import { useContext, useEffect, useState } from "react"
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { useDebouncedState } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import BrandOrSellerCategoryFilter from "@vardast/component/brand-or-seller-category-filter"
import DesktopMobileViewOrganizer from "@vardast/component/DesktopMobileViewOrganizer"
import FiltersContainer from "@vardast/component/filters-container"
import FiltersSidebarContainer from "@vardast/component/filters-sidebar-container"
import InfiniteScrollPagination from "@vardast/component/InfiniteScrollPagination"
import ItemsCount from "@vardast/component/ItemsCount"
import LoadingFailed from "@vardast/component/LoadingFailed"
import MobileCategoriesFilter from "@vardast/component/mobile-categories-filter"
import MobileFilterableAttributes from "@vardast/component/mobile-filterable-attributes"
import MobileSortFilter from "@vardast/component/mobile-sort-filter"
import NoResult from "@vardast/component/NoResult"
import NotFoundMessage from "@vardast/component/NotFound"
import ProductCard, {
  ProductCardSkeleton
} from "@vardast/component/product-card"
import ProductSort from "@vardast/component/product-sort"
import ProductListContainer, {
  ProductContainerType
} from "@vardast/component/ProductListContainer"
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

interface ProductListProps {
  desktopSideBarClass?: string
  isMobileView: boolean
  args: IndexProductInput
  selectedCategoryIds: InputMaybe<number[]> | undefined
  brandId?: number
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
  isMobileView,
  args,
  selectedCategoryIds,
  brandId,
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

  const [sort, setSort] = useState<ProductSortablesEnum>(
    args.orderBy || ProductSortablesEnum.Newest
  )
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

  const brandName = searchParams.get("brandName")
  const sellerName = searchParams.get("sellerName")
  const queryFilterParam = searchParams.get("query")
  const getFilterableAttributesQuery = useGetAllFilterableAttributesBasicsQuery(
    graphqlRequestClientWithoutToken,
    {
      filterableAttributesInput: {
        categoryId:
          !!selectedCategoryIds && selectedCategoryIds.length === 1
            ? selectedCategoryIds[0]
            : 0
      }
    },
    {
      enabled: !!selectedCategoryIds && selectedCategoryIds.length === 1
    }
  )

  const allProductsQuery = useInfiniteQuery<GetAllProductsQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        ...args,
        query: args.query ?? query,
        page: args.page || 1,
        attributes: filterAttributes,
        orderBy: sort
      }
    ],

    ({ pageParam = 1 }) => {
      return getAllProductsQueryFn({
        ...args,
        query: args.query ?? query,
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

  const removeFilterParamByQueryName = (name: string | string[]) => {
    const params = new URLSearchParams(searchParams as any)
    const paramsKeys = params.keys()
    const paramsToDelete: string[] = []
    for (const key of paramsKeys) {
      if (Array.isArray(name) && name.some((n) => key.includes(n))) {
        paramsToDelete.push(key)
      }
      if (typeof name === "string" && key.includes(name)) {
        paramsToDelete.push(key)
      }
    }
    paramsToDelete.forEach((key) => params.delete(key))
    push(pathname + "?" + params.toString())
  }

  // if (!allProductsQuery.data) notFound()

  const QueryCategoryFilter = () => {
    if (brandName || sellerName || queryFilterParam) {
      return (
        <div className="flex flex-grow flex-wrap items-center justify-start gap-1 md:w-full md:border-b-2 md:border-b-alpha-200 md:py-6">
          {brandName && (
            <Button
              className="rounded-full border border-alpha-200"
              size="small"
              variant="primary"
              onClick={() => {
                removeFilterParamByQueryName(["brandName", "brandId"])
              }}
            >
              {`برند: ${brandName}`}
              <XMarkIcon height={16} width={16} />
            </Button>
          )}
          {sellerName && (
            <Button
              className="rounded-full border border-alpha-200"
              size="small"
              variant="primary"
              onClick={() => {
                removeFilterParamByQueryName(["sellerName", "sellerId"])
              }}
            >
              {`فروشنده: ${sellerName}`}
              <XMarkIcon height={16} width={16} />
            </Button>
          )}
          {queryFilterParam && (
            <Button
              className="rounded-full border border-alpha-200"
              size="small"
              variant="primary"
              onClick={() => {
                removeFilterParamByQueryName("query")
              }}
            >
              {queryFilterParam}
              <XMarkIcon height={16} width={16} />
            </Button>
          )}
        </div>
      )
    }
    return null
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
          {brandId && isMobileView && (
            <BrandOrSellerCategoryFilter
              brandId={brandId}
              categoryIdsFilter={categoryIdsFilter}
              onCategoryIdsFilterChanged={onCategoryIdsFilterChanged}
            />
          )}
          {sellerId && isMobileView && (
            <BrandOrSellerCategoryFilter
              categoryIdsFilter={categoryIdsFilter}
              sellerId={sellerId}
              onCategoryIdsFilterChanged={onCategoryIdsFilterChanged}
            />
          )}
          {selectedCategoryIds &&
            selectedCategoryIds.length === 1 &&
            selectedCategoryIds[0] !== 0 && (
              <FiltersContainer
                filterAttributes={filterAttributes}
                selectedCategoryId={selectedCategoryIds[0]}
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

  const DesktopHeader = (
    <div className="flex items-center justify-between md:pb-8">
      <ProductSort
        sort={sort}
        onSortChanged={(sort) => {
          setSort(sort)
          const params = new URLSearchParams(searchParams as any)
          params.set("orderBy", `${sort}`)
          push(pathname + "?" + params.toString())
        }}
      />
      <ItemsCount
        countItemTitle={"product"}
        itemCount={
          allProductsQuery.data?.pages[0].products.total
            ? (allProductsQuery.data?.pages[0].products.total)
            : 0
        }
      />
    </div>
  )

  const MobileHeader = (
    <div className="sticky top-0 z-50 border-b bg-alpha-white p">
      <div className="flex flex-col gap-y-4">
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
        <div className="flex items-start gap-3">
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
          {selectedCategoryIds &&
            selectedCategoryIds.length > 0 &&
            getFilterableAttributesQuery.data &&
            getFilterableAttributesQuery.data.filterableAttributes.filters
              .length > 0 && (
              <>
                <MobileCategoriesFilter
                  brandId={brandId}
                  categoryId={selectedCategoryIds}
                  categoryIdsFilter={categoryIdsFilter}
                  sellerId={sellerId}
                  onCategoryFilterChanged={({ status, value }) => {
                    onCategoryIdsFilterChanged({ status, value })
                    setCategoriesFilterVisibility(false)
                  }}
                />
                <Button
                  className="rounded-full border border-alpha-200 py-0"
                  size="small"
                  variant="secondary"
                  onClick={() => setFiltersVisibility(true)}
                >
                  {filterAttributes.length > 0 && (
                    <span className="absolute -right-1 -top-1 block h-2.5 w-2.5 rounded-full bg-primary-500"></span>
                  )}
                  <LucideSlidersHorizontal className="icon text-alpha" />
                  فیلترها
                </Button>
                <MobileFilterableAttributes
                  filterAttributes={filterAttributes}
                  selectedCategoryId={selectedCategoryIds}
                  onFilterAttributesChanged={({ status, id, value }) => {
                    onFilterAttributesChanged({ status, id, value })
                    setFiltersVisibility(false)
                  }}
                  onRemoveAllFilters={() => {
                    removeAllFilters()
                    setFiltersVisibility(false)
                  }}
                />
              </>
            )}
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
            className="rounded-full border border-alpha-200 py-0"
            size="small"
            variant="secondary"
            onClick={() => setSortFilterVisibility(true)}
          >
            <LucideSortDesc className="icon text-alpha" />
            مرتب‌سازی
          </Button>
        </div>
        <QueryCategoryFilter />
      </div>
    </div>
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
      DesktopHeader={DesktopHeader}
      MobileHeader={hasFilter ? MobileHeader : <></>}
      isMobileView={isMobileView}
    />
  )
}

export default ProductList
