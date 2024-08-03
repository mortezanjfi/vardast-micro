import Image from "next/image"
import OrderCard from "@vardast/component/category/OrderCard"
import {
  PreOrder,
  PreOrderDto,
  PublicPreOrderDto
} from "@vardast/graphql/generated"

type Props = { data: PublicPreOrderDto }

function PublicPreOrderCard({ data }: Props) {
  return (
    data && (
      <div className="flex flex-col md:px-5 md:pt-1">
        <div className="flex items-center gap-2 border-b pb-1">
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
          <span className="h-full  text-base font-semibold">
            {data.categoryName}
          </span>
        </div>
        <OrderCard
          forHomeCard
          preOrder={data as unknown as PreOrder & PreOrderDto}
          verticalDetails
        />
      </div>
    )
  )
}

export default PublicPreOrderCard
