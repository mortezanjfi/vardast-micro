import { Metadata } from "next"

import OrderProductsPageIndex from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "افزودن کالا به سفارش"
  }
}
const ProjectEdit = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  return (
    <OrderProductsPageIndex
      uuid={uuid}
      title={(await generateMetadata()).title?.toString() as string}
    />
  )
}

export default ProjectEdit
