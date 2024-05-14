import { UseQueryResult } from "@tanstack/react-query"
import ProductCard, {
  ProductCardSkeleton
} from "@vardast/component/product-card"
import ProductListContainer from "@vardast/component/ProductListContainer"
import { GetAllProductsQuery, Product } from "@vardast/graphql/generated"

import MobileHomeSection from "@/app/(client)/(home)/components/MobileHomeSection"

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
