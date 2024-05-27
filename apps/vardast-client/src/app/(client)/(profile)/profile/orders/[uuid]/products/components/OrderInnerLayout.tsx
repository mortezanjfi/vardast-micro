"use client"

import { PropsWithChildren } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { FindPreOrderByIdQuery } from "@vardast/graphql/generated"

import OrderInfoCard from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderInfoCard"

export interface IOrderProductsInnerLayout extends PropsWithChildren {
  uuid: string
  isMobileView: boolean
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
}

const OrderProductsInnerLayout: React.FC<IOrderProductsInnerLayout> = ({
  children,
  isMobileView,
  findPreOrderByIdQuery,
  uuid
}) => {
  return (
    <div className="hide-scrollbar flex flex-col-reverse gap-x-9 gap-y-1 overflow-y-auto p-0.5 2xl:grid 2xl:grid-cols-4">
      <div className="col-span-3">{children}</div>
      <OrderInfoCard
        isMobileView={isMobileView}
        findPreOrderByIdQuery={findPreOrderByIdQuery}
        uuid={uuid}
      />
    </div>
  )
}

export default OrderProductsInnerLayout
