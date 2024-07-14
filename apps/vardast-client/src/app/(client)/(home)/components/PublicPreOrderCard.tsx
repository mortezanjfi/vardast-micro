import Image from "next/image"
import OrderPreviewCard from "@vardast/component/order/OrderPreviewCard"
import { PreOrderDto, PublicPreOrderDto } from "@vardast/graphql/generated"
import useTranslation from "next-translate/useTranslation"

type Props = { data: PublicPreOrderDto }

function PublicPreOrderCard({ data }: Props) {
  const { t } = useTranslation()
  return (
    data && (
      <div className="flex flex-col divide-y  px-5 pt-1">
        <div className="flex items-center gap-2 pb-1">
          {/* <div className="relative h-14 w-14 overflow-hidden  p-1"> */}
          <Image
            src={
              data?.categoryImage
                ? data?.categoryImage
                : `/images/categories/1.png`
            }
            alt="category"
            width={50}
            height={50}
            sizes="100"
            className="rounded-xl object-cover"
          />
          {/* </div> */}
          <span className="h-full  text-base font-semibold">
            {data.categoryName}
          </span>
        </div>
        {data.orders.map((order, index) => (
          <OrderPreviewCard key={order.id} order={order as PreOrderDto} />
        ))}
      </div>
    )
  )
}

export default PublicPreOrderCard
