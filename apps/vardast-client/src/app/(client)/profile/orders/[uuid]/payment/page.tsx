"use client"

import { useRouter } from "next/navigation"
import { useFindPreOrderByIdQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

type OrderProductsPageIndexProps = {
  isMobileView: boolean
  uuid: string
}

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

  return <div>پرداخت با موفقیت انجام شد</div>
}

export default OrderProductsPageIndex
