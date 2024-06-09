import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderDetailIndex from "@/app/(seller)/components/OrderDetailIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "جزییات سفارش"
  }
}

export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()

  return <OrderDetailIndex isMobileView={isMobileView} uuid={uuid} />
}
