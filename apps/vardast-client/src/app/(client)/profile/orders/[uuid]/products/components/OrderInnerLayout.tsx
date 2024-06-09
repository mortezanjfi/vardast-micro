"use client"

import { PropsWithChildren } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { FindPreOrderByIdQuery } from "@vardast/graphql/generated"

import PageTitle from "@/app/(client)/profile/components/PageTitle"
import OrderInfoCard from "@/app/(client)/profile/orders/[uuid]/products/components/OrderInfoCard"

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
    <div className="flex h-full flex-col-reverse justify-end gap-x-9 gap-y-1 p-0.5 2xl:grid 2xl:grid-cols-4">
      <div className="col-span-3 flex h-full flex-col">{children}</div>
      {!isMobileView && (
        <OrderInfoCard
          isMobileView={isMobileView}
          findPreOrderByIdQuery={findPreOrderByIdQuery}
          uuid={uuid}
        />
      )}
      {isMobileView && (
        <div className="flex flex-col pb-5">
          <PageTitle titleClass="text-sm" title={"افزودن کالا"} />
          <p className="text-sm font-normal">
            کالاها و هزینه های جانبی درخواستی خود را از یک یا ترکیبی از روش های
            زیر انتخاب کرده و پس از تایید، قیمت گذاری کنید.
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderProductsInnerLayout
