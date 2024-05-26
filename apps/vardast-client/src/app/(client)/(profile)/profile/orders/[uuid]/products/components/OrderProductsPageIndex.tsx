"use client"

import { useRouter } from "next/navigation"
import { useFindPreOrderByIdQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import OrderProductsInnerLayout from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderInnerLayout"
import OrderProductsTabs from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsTabs"

type OrderProductsPageIndexProps = { uuid: string; title: string }

function OrderProductsPageIndex({ title, uuid }: OrderProductsPageIndexProps) {
  const router = useRouter()
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <PageTitle title={title} backButtonUrl="/profile/orders" />
      <OrderProductsInnerLayout
        findPreOrderByIdQuery={findPreOrderByIdQuery}
        isMobileView={false}
        uuid={uuid}
      >
        <div className="flex flex-col gap-2 border-b pb-5">
          <span className=" pb-2 text-lg font-semibold">
            افزودن کالا و هزینه جانبی
          </span>
          <p className="text-sm">
            کالاها و هزینه های جانبی درخواستی خود را از یک یا ترکیبی از روش های
            زیر انتخاب کرده و پس از تایید، قیمت گذاری کنید.
          </p>
        </div>
        <OrderProductsTabs uuid={uuid} />
      </OrderProductsInnerLayout>
    </div>
  )
}

export default OrderProductsPageIndex
