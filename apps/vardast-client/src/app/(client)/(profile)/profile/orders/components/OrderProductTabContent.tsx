"use client"

import { Product, useGetBasketQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import { OrderProductTabContentProps } from "@/app/(client)/(profile)/profile/orders/components/AddOrderProductTabs"
import OrderProductCard, {
  OrderProductCardSkeleton
} from "@/app/(client)/(profile)/profile/orders/components/OrderProductCard"
import OrderProductListContainer from "@/app/(client)/(profile)/profile/orders/components/OrderProductListContainer"
import { NotFoundItems } from "@/app/(client)/favorites/components/FavoritesPageIndex"

export const OrderProductTabContent = ({
  addProductLine,
  form
}: OrderProductTabContentProps) => {
  const getBasketQuery = useGetBasketQuery(graphqlRequestClientWithToken)

  return (
    <>
      {!getBasketQuery.data?.favorites.product.length ? (
        <OrderProductListContainer>
          {() => (
            <>
              <OrderProductCardSkeleton />
              <OrderProductCardSkeleton />
              <OrderProductCardSkeleton />
            </>
          )}
        </OrderProductListContainer>
      ) : getBasketQuery.data?.favorites.product.length ? (
        <OrderProductListContainer>
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {getBasketQuery.data?.favorites.product.map(
                (product) =>
                  product && (
                    <OrderProductCard
                      addProductLine={addProductLine}
                      form={form}
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                      key={product.id}
                      product={product as Product}
                    />
                  )
              )}
            </>
          )}
        </OrderProductListContainer>
      ) : (
        <NotFoundItems text="کالا" />
      )}
    </>
  )
}
