"use client"

import OrderProductCard from "@vardast/component/desktop/OrderProductCard"
import OrderProductListContainer from "@vardast/component/desktop/OrderProductListContainer"
import NotFoundMessage from "@vardast/component/NotFound"
import { MultiTypeOrder, useGetBasketQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  ACTION_BUTTON_TYPE,
  OrderProductTabContentProps
} from "@vardast/type/OrderProductTabs"

import { OrderProductCardSkeleton } from "@/app/(client)/profile/orders/components/OrderProductCard"

export const OrderProductTabContent = ({
  addProductLine
}: OrderProductTabContentProps) => {
  const getBasketQuery = useGetBasketQuery(graphqlRequestClientWithToken)

  return (
    <>
      {getBasketQuery.isLoading && getBasketQuery.isFetching ? (
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
          {() => (
            <>
              {getBasketQuery.data?.favorites.product.map((product) => (
                <OrderProductCard
                  actionButtonType={ACTION_BUTTON_TYPE.ADD_PRODUCT_ORDER}
                  addProductLine={addProductLine}
                  key={product.id}
                  line={{
                    id: product.id,
                    item_name: product.name,
                    brand: product.brand.name,
                    uom: product.uom.name,
                    type: MultiTypeOrder.Product
                  }}
                />
              ))}
            </>
          )}
        </OrderProductListContainer>
      ) : (
        <NotFoundMessage text="کالایی به سبد خرید خود" />
      )}
    </>
  )
}
