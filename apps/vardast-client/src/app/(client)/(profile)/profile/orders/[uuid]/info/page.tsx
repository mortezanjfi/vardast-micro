import { Metadata } from "next"

import OrderInfoPage from "@/app/(client)/(profile)/profile/orders/[uuid]/info/components/OrderInfoPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ثبت اطلاعات سفارش"
  }
}
const ProjectEdit = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  return (
    <OrderInfoPage
      uuid={uuid}
      title={(await generateMetadata()).title?.toString() as string}
    />
  )
}

export default ProjectEdit
