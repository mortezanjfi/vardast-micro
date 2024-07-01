"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  PreOrderStates,
  useFindPreOrderByIdQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import OrderInfoCard from "../desktop/OrderInfoCard"
import OrderProductsList from "../desktop/OrderProductsList"
import Link from "../Link"
import SellersList from "../offers/SellersList"

type OrderPageProps = {
  isMobileView?: boolean
  uuid: string
  offerId?: string
}

const OrderPage = ({ isMobileView, uuid, offerId }: OrderPageProps) => {
  const router = useRouter()
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  useEffect(() => {
    if (
      findPreOrderByIdQuery?.data?.findPreOrderById.status ===
      PreOrderStates.Closed
    ) {
      router.push(`/profile/orders`)
    }
  }, [])

  return (
    <div className="flex h-full flex-col gap-9">
      <OrderInfoCard findPreOrderByIdQuery={findPreOrderByIdQuery} />
      <OrderProductsList
        button={{
          onClick: () =>
            router.push(
              `/profile/orders/${findPreOrderByIdQuery?.data?.findPreOrderById?.id}/products`
            ),
          text: "افزودن کالا",
          type: "button"
        }}
        isMobileView={isMobileView}
        offerId={offerId}
        findPreOrderByIdQuery={findPreOrderByIdQuery}
      />
      <SellersList
        isClient
        isMobileView={false}
        findPreOrderByIdQuery={findPreOrderByIdQuery}
        uuid={uuid}
      />

      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] grid w-full !grid-cols-2 gap pt-4 md:relative md:bottom-0 md:mt-0 md:flex md:justify-end">
        <Link className="btn btn-md btn-secondary" href="/profile/orders">
          بازگشت به سفارشات
        </Link>
      </div>
    </div>
  )
}

export default OrderPage
