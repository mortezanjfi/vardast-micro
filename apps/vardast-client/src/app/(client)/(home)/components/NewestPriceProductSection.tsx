import { UseInfiniteQueryResult } from "@tanstack/react-query"
import { GetAllProductsQuery } from "@vardast/graphql/generated"
import useTranslation from "next-translate/useTranslation"

import MobileHomeSection from "@/app/(client)/(home)/components/MobileHomeSection"
import NewPriceSlider from "@/app/(client)/(home)/components/NewPriceSlider"

type Props = { query: UseInfiniteQueryResult<GetAllProductsQuery, unknown> }

const NewestPriceProductSection = ({ query }: Props) => {
  const { t } = useTranslation()
  const limitPage = 5

  return (
    query?.data?.pages[0].products?.data?.length > 0 && (
      <MobileHomeSection title={t("common:newest-price")}>
        <NewPriceSlider query={query} />
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
      </MobileHomeSection>
    )
  )
}

export default NewestPriceProductSection
