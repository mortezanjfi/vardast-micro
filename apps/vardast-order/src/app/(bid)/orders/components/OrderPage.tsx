"use client"

import { useRouter } from "next/navigation"
import Link from "@vardast/component/Link"

import OrderProductsList from "@/app/(bid)/orders/[uuid]/components/OrderProductsList"
import SellersList from "@/app/(bid)/orders/[uuid]/components/SellersList"
import OrderInfoCard from "@/app/(bid)/orders/components/OrderInfoCard"

type OrderPageProps = {
  isMobileView?: boolean
  uuid: string
}

const OrderPage = ({ uuid }: OrderPageProps) => {
  const router = useRouter()

  return (
    <div className="flex h-full flex-col gap-9">
      <OrderInfoCard uuid={uuid} />
      <OrderProductsList
        uuid={uuid}
        button={{
          onClick: () =>
            router.push(
              `${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders/${uuid}/products`
            ),
          text: "افزودن کالا",
          type: "button"
        }}
      />
      <SellersList uuid={uuid} />

      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] grid w-full !grid-cols-2 gap pt-4 md:relative md:bottom-0 md:mt-0 md:flex md:justify-end">
        <Link
          className="btn btn-md btn-secondary"
          href="${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders"
        >
          بازگشت به سفارشات
        </Link>
      </div>
    </div>
  )
}

export default OrderPage
