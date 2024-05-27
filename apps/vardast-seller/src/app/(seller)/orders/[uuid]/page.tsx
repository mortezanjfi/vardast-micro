import { Metadata } from "next"

import OrderDetailIndex from "@/app/(seller)/components/OrderDetailIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "جزییات سفارش"
  }
}

const Page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  return <OrderDetailIndex uuid={uuid} />
}

export default Page
