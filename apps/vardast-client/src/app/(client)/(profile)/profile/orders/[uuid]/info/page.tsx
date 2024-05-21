import { Metadata } from "next"

import UpdateOrderInfoPage from "@/app/(client)/(profile)/profile/orders/[uuid]/info/components/UpdateOrderInfoPage"

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
    <UpdateOrderInfoPage
      uuid={uuid}
      title={(await generateMetadata()).title?.toString() as string}
    />
  )
}

export default ProjectEdit
