import { Metadata } from "next"

import AddOrderProducts from "@/app/(client)/(profile)/profile/orders/components/AddOrderProducts"

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
    <AddOrderProducts
      uuid={uuid}
      title={(await generateMetadata()).title?.toString() as string}
    />
  )
}

export default ProjectEdit
