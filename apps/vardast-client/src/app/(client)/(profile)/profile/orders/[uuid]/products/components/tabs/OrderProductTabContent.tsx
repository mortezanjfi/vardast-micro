"use client"

import { MultiTypeOrder, useGetBasketQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import OrderProductCard, {
  ACTION_BUTTON_TYPE,
  OrderProductCardSkeleton
} from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductCard"
import { OrderProductTabContentProps } from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsTabs"
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
              {getBasketQuery.data?.favorites.product.map((product) => (
                <OrderProductCard
                  actionButtonType={ACTION_BUTTON_TYPE.ADD_PRODUCT_ORDER}
                  addProductLine={addProductLine}
                  key={product.id}
                  line={{
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
        <NotFoundItems text="کالا" />
      )}
    </>
  )
}
