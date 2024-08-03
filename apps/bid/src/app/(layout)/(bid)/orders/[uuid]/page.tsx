import { Metadata } from "next"

import OrderPage from "@/app/(layout)/(bid)/orders/[uuid]/components/OrderPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تایید سفارش"
  }
}
export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  return <OrderPage uuid={uuid} />
}
