import {
  PreOrderDto,
  useGetPublicOrdersQuery
} from "../../../graphql/src/generated"
import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"
import ListHeader from "../desktop/ListHeader"
import OrderPreviewCard, {
  OrderPreviewCardSkeleton
} from "../order/OrderPreviewCard"

type Props = { isMobileView: boolean; categoryId: string | number }

function CategoriesPublicOrders({ isMobileView, categoryId }: Props) {
  const publicPreOrders = useGetPublicOrdersQuery(
    graphqlRequestClientWithToken,
    {
      indexPublicOrderInput: {
        categoryId: +categoryId,
        number: 15
      }
    }
  )

  return (
    <div className="flex flex-col divide-y px-6 sm:!px-0">
      {!isMobileView && (
        <ListHeader
          // total={publicPreOrders?.data?.publicOrders.}
          listName={"orders"}
        />
      )}
      {publicPreOrders.isFetching || publicPreOrders.isLoading ? (
        <>
          {[...Array(10)].map((_, index) => (
            <OrderPreviewCardSkeleton categoryName={false} key={index} />
          ))}
        </>
      ) : publicPreOrders.data.publicOrders.length ? (
        publicPreOrders.data.publicOrders.map((data, index) =>
          data.orders.map((order, orderIndex) => (
            <OrderPreviewCard key={orderIndex} order={order as PreOrderDto} />
          ))
        )
      ) : null}
    </div>
  )
}

export default CategoriesPublicOrders
