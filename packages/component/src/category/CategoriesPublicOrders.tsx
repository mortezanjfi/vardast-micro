import { UseQueryResult } from "@tanstack/react-query"
import {
  GetPublicOrdersQuery,
  PreOrder,
  PreOrderDto
} from "@vardast/graphql/generated"

import ListHeader from "../desktop/ListHeader"
import OrderCard from "./OrderCard"

type Props = {
  publicPreOrders: UseQueryResult<GetPublicOrdersQuery, unknown>
  isMobileView: boolean
  categoryId?: string | number
}

function CategoriesPublicOrders({ publicPreOrders, isMobileView }: Props) {
  return (
    <>
      {!isMobileView && (
        <ListHeader
          // total={publicPreOrders?.data?.publicOrders.}
          listName={"orders"}
        />
      )}
      <div className="flex flex-col gap-4 divide-y divide-alpha-300 px-6 sm:grid sm:!px-0 md:grid-cols-2 md:gap-6 md:divide-y-0 lg:grid-cols-3 2xl:grid-cols-4">
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
    </>
  )
}

export default CategoriesPublicOrders
