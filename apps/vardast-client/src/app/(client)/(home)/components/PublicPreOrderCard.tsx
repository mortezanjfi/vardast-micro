import { PreOrderDto, PublicPreOrderDto } from "@vardast/graphql/generated"
import useTranslation from "next-translate/useTranslation"

import OrderPreviewCard from "@/app/(client)/(home)/components/OrderPreviewCard"

type Props = { data: PublicPreOrderDto }

function PublicPreOrderCard({ data }: Props) {
  const { t } = useTranslation()
  return (
    data && (
      <div className="flex flex-col divide-y  px-5 pt-5">
        <span className="pb-5 text-base font-semibold">
          {data.categoryName}
        </span>
        {data.orders.map((order, index) => (
          <OrderPreviewCard key={order.id} order={order as PreOrderDto} />
        ))}
      </div>
    )
  )
}

export default PublicPreOrderCard
