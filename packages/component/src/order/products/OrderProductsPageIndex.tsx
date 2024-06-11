"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  PreOrderStates,
  useFindPreOrderByIdQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import Link from "../../Link"
import OrderProductsInnerLayout from "./OrderInnerLayout"
import OrderProductsTabs from "./OrderProductsTabs"

type OrderProductsPageIndexProps = {
  isAdmin?: boolean
  isMobileView: boolean
  uuid: string
}

function OrderProductsPageIndex({
  isAdmin,
  isMobileView,
  uuid
}: OrderProductsPageIndexProps) {
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
      router.push(isAdmin ? `//orders` : `/profile/orders`)
    }
  }, [])

  return (
    <OrderProductsInnerLayout
      findPreOrderByIdQuery={findPreOrderByIdQuery}
      isMobileView={isMobileView}
      uuid={uuid}
    >
      <OrderProductsTabs uuid={uuid} />
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] mt-auto grid w-full !grid-cols-2 gap pt-4 md:relative md:bottom-0 md:mt-0 md:flex md:justify-end">
        <Link
          className="btn btn-md btn-secondary"
          href={isAdmin ? "/orders/" : "/profile/orders/"}
        >
          بازگشت به سفارشات
        </Link>
        <Link
          href={isAdmin ? `/orders/${uuid}` : `/profile/orders/${uuid}`}
          className="btn btn-primary btn-md"
        >
          تایید و ادامه
        </Link>
      </div>
    </OrderProductsInnerLayout>
  )
}

export default OrderProductsPageIndex
