import { UseQueryResult } from "@tanstack/react-query"
import { GetAllProductsQuery, Product } from "@vardast/graphql/generated"

import MobileHomeSection from "@/app/(public)/(purchaser)/(home)/components/MobileHomeSection"
import ProductCard, { ProductCardSkeleton } from "@/app/components/product-card"
import ProductListContainer from "@/app/components/ProductListContainer"

const MobileHomeNewestProducts = ({
  allProductsQuery
}: {
  allProductsQuery: UseQueryResult<GetAllProductsQuery, unknown>
}) => {
  return (
    <MobileHomeSection
      viewAllHref="/products"
      bgWhite
      block
      title="جدیدترین کالاها"
    >
      <div className="sm:pt-6">
        <ProductListContainer
          CardLoader={
            allProductsQuery.isLoading
              ? () => <ProductCardSkeleton />
              : undefined
          }
        >
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {allProductsQuery.data?.products?.data
                .slice(0, 12)
                .map((product) => (
                  <ProductCard
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                    key={product?.id}
                    product={product as Product}
                  />
                ))}
            </>
          )}
        </ProductListContainer>
      </div>
    </MobileHomeSection>
  )
}

export default MobileHomeNewestProducts
