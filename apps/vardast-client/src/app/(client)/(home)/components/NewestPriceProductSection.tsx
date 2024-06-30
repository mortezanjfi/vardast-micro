import { useInfiniteQuery } from "@tanstack/react-query"
import { checkLimitPageByCondition } from "@vardast/component/product-list"
import {
  GetAllProductsQuery,
  SortDirection,
  SortFieldProduct
} from "@vardast/graphql/generated"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/allProductsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import useTranslation from "next-translate/useTranslation"

import MobileHomeSection from "@/app/(client)/(home)/components/MobileHomeSection"
import NewPriceSlider from "@/app/(client)/(home)/components/NewPriceSlider"

type Props = {}

const NewestPriceProductSection = ({}: Props) => {
  const { t } = useTranslation()
  const limitPage = 5
  const recentProducts = useInfiniteQuery<GetAllProductsQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        page: 1,
        sortField: SortFieldProduct.Price,
        sortDirection: SortDirection.Desc
      }
    ],
    ({ pageParam = 1 }) => {
      return getAllProductsQueryFn({
        page: pageParam
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

  return (
    recentProducts?.data?.pages[0].products?.data?.length > 0 && (
      <MobileHomeSection title={t("common:newest-price")}>
        <div className="container mx-auto flex flex-col gap-7 py-6">
          <NewPriceSlider query={recentProducts} />
          {/* {recentProducts.isLoading || recentProducts.isFetching ? (
            <ProductListContainer type={ProductContainerType.NEW_PRICE_SECTION}>
              {() => (
                <>{[...Array(10).map((index) => <ProductCardSkeleton />)]}</>
              )}
            </ProductListContainer>
          ) : (
            <ProductListContainer type={ProductContainerType.NEW_PRICE_SECTION}>
              {({ selectedItemId, setSelectedItemId }) => (
                <InfiniteScrollPagination
                  CardLoader={() => <ProductCardSkeleton />}
                  infiniteQuery={recentProducts}
                >
                  {(page, ref) => (
                    <>
                      {page.products.data.map((product, index) => (
                        <ProductCard
                          selectedItemId={selectedItemId}
                          setSelectedItemId={setSelectedItemId}
                          ref={
                            page.products.data.length - 1 === index
                              ? ref
                              : undefined
                          }
                          key={product?.id}
                          product={product as Product}
                        />
                      ))}
                    </>
                  )}
                </InfiniteScrollPagination>
              )}
            </ProductListContainer>
          )} */}
        </div>
      </MobileHomeSection>
    )
  )
}

export default NewestPriceProductSection
