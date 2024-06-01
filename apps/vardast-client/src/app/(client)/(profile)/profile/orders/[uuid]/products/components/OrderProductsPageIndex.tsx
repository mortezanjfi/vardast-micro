"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "@vardast/component/Link"
import {
  PreOrderStates,
  useFindPreOrderByIdQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import OrderProductsInnerLayout from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderInnerLayout"
import OrderProductsTabs from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsTabs"

type OrderProductsPageIndexProps = { isMobileView: boolean; uuid: string }

function OrderProductsPageIndex({
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
      router.push(`/profile/orders`)
    }
  }, [])

  return (
    <OrderProductsInnerLayout
      findPreOrderByIdQuery={findPreOrderByIdQuery}
      isMobileView={isMobileView}
      uuid={uuid}
    >
      <OrderProductsTabs uuid={uuid} />
      <div className="mt-auto grid !grid-cols-2 gap pt-4 md:mt-0 md:flex md:justify-end">
        <Link className="btn btn-md btn-secondary" href="/profile/orders/">
          بازگشت به سفارشات
        </Link>
        <Link
          href={`/profile/orders/${uuid}`}
          className="btn btn-primary btn-md"
        >
          تایید و ادامه
        </Link>
      </div>
    </OrderProductsInnerLayout>
  )
}

export default OrderProductsPageIndex
