"use client"

import { UseQueryResult } from "@tanstack/react-query"
import ProductCard, {
  ProductCardSkeleton
} from "@vardast/component/product-card"
import ProductListContainer from "@vardast/component/ProductListContainer"
import {
  GetUserFavoriteProductsQuery,
  Product
} from "@vardast/graphql/generated"
import { Session } from "next-auth"

import { NotFoundItems } from "@/app/(client)/profile/favorites/components/FavoritesPageIndex"

type ProductsTabContentProps = {
  productQuery: UseQueryResult<GetUserFavoriteProductsQuery, unknown>
  session: Session | null
}

export const ProductsTabContent = ({
  productQuery
}: ProductsTabContentProps) => {
  return (
    <>
      {productQuery.isFetching && productQuery.isLoading ? (
        <ProductListContainer>
          {() => (
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          )}
        </ProductListContainer>
      ) : productQuery.data?.favorites?.product?.length ? (
        <ProductListContainer>
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {productQuery.data?.favorites.product.map(
                (product) =>
                  product && (
                    <ProductCard
                      key={product.id}
                      product={product as Product}
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                    />
                  )
              )}
            </>
          )}
        </ProductListContainer>
      ) : (
        <NotFoundItems text="کالا" />
      )}
    </>
  )
}
