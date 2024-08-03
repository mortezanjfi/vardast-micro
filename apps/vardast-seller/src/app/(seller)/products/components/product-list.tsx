"use client"

import { useEffect, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import DesktopMobileViewOrganizer from "@vardast/component/DesktopMobileViewOrganizer"
import NotFoundMessage from "@vardast/component/NotFound"
import { ProductCardSkeleton } from "@vardast/component/product-card"
import ProductListContainer, {
  ProductContainerType
} from "@vardast/component/ProductListContainer"
import {
  GetMyProfileSellerQuery,
  InputMaybe,
  Product,
  SearchSellerRepresentativeInput
} from "@vardast/graphql/generated"
import { getMyProfileSellerQueryFns } from "@vardast/query/queryFns/getMyProfileSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"
import { Input } from "@vardast/ui/input"
import { Loader2, LucideSearch, LucideX } from "lucide-react"
import { Session } from "next-auth"

import ProductCard from "@/app/(seller)/products/components/product-card"

interface ProductListProps {
  isMobileView: boolean
  args: SearchSellerRepresentativeInput
  selectedCategoryIds: InputMaybe<number[]> | undefined
  brandId?: number
  hasSearch?: boolean
  sellerId?: number
  hasFilter?: boolean
  setCategoriesCount?: (_?: any) => void
  containerType?: ProductContainerType
  session?: Session | null
}

export const checkLimitPageByCondition = (condition: boolean, result: any[]) =>
  condition ? result.length + 1 : undefined

const ProductList = ({
  isMobileView,
  args,
  setCategoriesCount,
  hasFilter = true,
  session,
  containerType = ProductContainerType.LARGE_LIST
}: ProductListProps) => {
  const [query, setQuery] = useDebouncedState<string>("", 500)
  const [queryTemp, setQueryTemp] = useState<string>("")

  const allProductsQuery = useQuery<GetMyProfileSellerQuery>(
    [QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER, { ...args, name: query }],
    () =>
      getMyProfileSellerQueryFns({
        accessToken: session?.accessToken,
        name: query
      }),
    {
      refetchOnMount: "always"
    }
  )

  useEffect(() => {
    if (setCategoriesCount) {
      setCategoriesCount &&
        setCategoriesCount(allProductsQuery.data?.myProfileSeller.sum)
    }
  }, [allProductsQuery.data?.myProfileSeller.sum, setCategoriesCount])

  const DesktopHeader = (
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
  )

  const MobileHeader = (
    <div className="sticky top-0 z-50 border-b bg-alpha-white p">
      <div className="flex flex-col gap-y-4">
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
        {/* <div className="flex items-start gap-3">
          <Button
            onClick={() => setSortFilterVisibility(true)}
            size="small"
            variant="secondary"
            className="rounded-full border border-alpha-200"
          >
            <LucideSortDesc className="icon text-alpha" />
            مرتب‌سازی
          </Button>
        </div> */}
      </div>
    </div>
  )

  const Content = (
    <ProductListContainer
      CardLoader={
        allProductsQuery.isLoading
          ? () => <ProductCardSkeleton containerType={containerType} />
          : undefined
      }
      type={containerType}
    >
      {({ selectedItemId, setSelectedItemId }) => (
        <>
          {allProductsQuery.data &&
          allProductsQuery.data.myProfileSeller.myProduct.length ? (
            allProductsQuery.data.myProfileSeller.myProduct.map((offer) => (
              <ProductCard
                selectedItemId={selectedItemId}
                setSelectedItemId={setSelectedItemId}
                containerType={containerType}
                key={offer?.id}
                product={offer?.product as Product}
              />
            ))
          ) : allProductsQuery.isLoading ? (
            <div>loading</div>
          ) : (
            <NotFoundMessage />
          )}
        </>
      )}
    </ProductListContainer>
  )

  return (
    <DesktopMobileViewOrganizer
      isMobileView={isMobileView}
      DesktopHeader={DesktopHeader}
      MobileHeader={hasFilter ? MobileHeader : <></>}
      Content={Content}
    />
  )
}

export default ProductList
