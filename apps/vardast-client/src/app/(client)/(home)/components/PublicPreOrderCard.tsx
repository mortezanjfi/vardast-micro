import { PreOrderDto, PublicPreOrderDto } from "@vardast/graphql/generated"
import useTranslation from "next-translate/useTranslation"

import OrderPreviewCard from "@/app/(client)/(home)/components/OrderPreviewCard"

type Props = { data: PublicPreOrderDto }

export const PublicPreOrderCardSkeleton = () => {
  return (
    <div className="flex flex-col divide-y border-l px-5">
      <span className="animated-card mb-5 h-5 w-1/2 text-lg font-semibold"></span>
      <div className="flex flex-col gap-3 py-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animated-card h-5 w-52"></span>
          </div>
          <span className="animated-card h-5 w-12"></span>
        </div>
        <span className="animated-card h-5 w-32"></span>
        <span className="animated-card h-5 w-32"></span>
        <span className="animated-card h-5 w-32"></span>
      </div>
      <div className="flex flex-col gap-3 py-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animated-card h-5 w-52"></span>
          </div>
          <span className="animated-card h-5 w-12"></span>
        </div>
        <span className="animated-card h-5 w-32"></span>
        <span className="animated-card h-5 w-32"></span>
        <span className="animated-card h-5 w-32"></span>
      </div>
    </div>
  )
}

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
