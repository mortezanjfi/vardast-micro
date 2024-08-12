import { UseQueryResult } from "@tanstack/react-query"
import {
  GetPublicOrdersQuery,
  PreOrder,
  PreOrderDto
} from "@vardast/graphql/generated"
import clsx from "clsx"

import ListHeader from "../desktop/ListHeader"
import OrderCard from "./OrderCard"

type Props = {
  publicPreOrders: UseQueryResult<GetPublicOrdersQuery, unknown>
  title: boolean
  categoryId?: string | number
}

function CategoriesPublicOrders({ publicPreOrders, title }: Props) {
  return (
    <div className={clsx(!title && "sm:py-5 ")}>
      {title && (
        <ListHeader
          // total={publicPreOrders?.data?.publicOrders.}
          listName={"orders"}
        />
      )}
      <div className="flex flex-col gap-4  px-6 sm:grid sm:grid-cols-2 sm:gap-6  sm:!px-0 lg:grid-cols-3 2xl:grid-cols-4">
        {publicPreOrders.isFetching || publicPreOrders.isLoading ? (
          <>
            {[...Array(10)].map((_, index) => (
              <div key={index}></div>
            ))}
          </>
        ) : publicPreOrders.data.publicOrders.length ? (
          publicPreOrders.data.publicOrders.map((data) =>
            data.orders.map((order, orderIndex) => (
              <OrderCard
                forHomeCard
                verticalDetails
                key={orderIndex}
                preOrder={order as unknown as PreOrder & PreOrderDto}
              />
            ))
          )
        ) : null}
      </div>
    </div>
  )
}

export default CategoriesPublicOrders
