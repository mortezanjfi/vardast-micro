import { UseQueryResult } from "@tanstack/react-query"

import {
  GetPublicOrdersQuery,
  PreOrderDto
} from "../../../graphql/src/generated"
import ListHeader from "../desktop/ListHeader"
import OrderPreviewCard, {
  OrderPreviewCardSkeleton
} from "../order/OrderPreviewCard"

type Props = {
  publicPreOrders: UseQueryResult<GetPublicOrdersQuery, unknown>
  isMobileView: boolean
  categoryId: string | number
}

function CategoriesPublicOrders({
  publicPreOrders,
  isMobileView,
  categoryId
}: Props) {
  return (
    <>
      {!isMobileView && (
        <ListHeader
          // total={publicPreOrders?.data?.publicOrders.}
          listName={"orders"}
        />
      )}
      <div className="flex grid-cols-2 flex-col divide-y px-6 sm:grid sm:!px-0">
        {publicPreOrders.isFetching || publicPreOrders.isLoading ? (
          <>
            {[...Array(10)].map((_, index) => (
              <OrderPreviewCardSkeleton categoryName={false} key={index} />
            ))}
          </>
        ) : publicPreOrders.data.publicOrders.length ? (
          publicPreOrders.data.publicOrders.map((data, index) =>
            data.orders.map((order, orderIndex) => (
              <OrderPreviewCard
                singleCard
                key={orderIndex}
                order={order as PreOrderDto}
              />
            ))
          )
        ) : null}
      </div>
    </>
  )
}

export default CategoriesPublicOrders
