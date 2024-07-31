"use client"

import { useState } from "react"
import Image from "next/image"
import OrderProductCard from "@vardast/component/desktop/OrderProductCard"
import OrderProductListContainer from "@vardast/component/desktop/OrderProductListContainer"
import NotFoundMessage from "@vardast/component/NotFound"
import { ProductContainerType } from "@vardast/component/ProductListContainer"
import { MultiTypeOrder, useGetBasketQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  ACTION_BUTTON_TYPE,
  CreateOrderLineType
} from "@vardast/type/OrderProductTabs"
import { clsx } from "clsx"

import { IOrderPageSectionProps } from "@/types/type"

const TabOrderProductCardSkeleton = ({
  containerType = ProductContainerType.LARGE_LIST
}: {
  containerType?: ProductContainerType
}) => {
  const [ratio, setRatio] = useState(1 / 1)
  return (
    <div className="relative bg-alpha-white px-6 hover:z-10 sm:py sm:ring-2 sm:!ring-alpha-200 sm:hover:shadow-lg">
      <div className={clsx("flex flex-col border-b py-4")}>
        <div className="flex w-full gap-5">
          <div className="w-full">
            <Image
              src={"/images/frameLess.png"}
              alt="skeleton"
              width={400}
              height={400 / ratio}
              layout="fixed"
              onLoadingComplete={({ naturalWidth, naturalHeight }: any) => {
                setRatio(naturalWidth / naturalHeight)
              }}
              objectFit="contain"
              className="animated-card"
            />
          </div>
        </div>
        {containerType !== ProductContainerType.PHOTO && (
          <div className="sm:col-span1 col-span-2 flex h-full flex-col gap-2">
            <h5 className="animated-card line-clamp-2 h-11 font-semibold"></h5>
            <div className="flex h-8 w-full py-2">
              <div className="animated-card h-full w-8"></div>
            </div>
            <div className="flex h-14  w-full flex-col items-end">
              <div className="flex h-1/2 w-full items-center justify-end gap-x">
                <span className="animated-card h-1/2 w-8 rounded-full p-1 px-1.5 text-center text-sm font-semibold leading-none"></span>
                <span className="animated-card h-1/2 w-8 text-sm line-through"></span>
              </div>
              <div className="flex h-1/2 w-full items-center justify-end">
                <div className="animated-card h-full w-20"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export const OrderProductTabContent = ({
  open,
  onCloseModals
}: IOrderPageSectionProps<CreateOrderLineType>) => {
  const getBasketQuery = useGetBasketQuery(
    graphqlRequestClientWithToken,
    {},
    {
      enabled: open
    }
  )

  return (
    <>
      {getBasketQuery.isLoading && getBasketQuery.isFetching ? (
        <OrderProductListContainer>
          {() => (
            <>
              <TabOrderProductCardSkeleton />
              <TabOrderProductCardSkeleton />
              <TabOrderProductCardSkeleton />
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
                  addProductLine={onCloseModals}
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
