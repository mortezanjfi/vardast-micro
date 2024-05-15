import { Metadata } from "next"

import AddOrderOffer from "@/app/(client)/(profile)/profile/orders/components/AddOrderOffer"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ثبت سفارش جدید"
  }
}
const ProjectEdit = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  // const session = await getServerSession(authOptions)

  // if (!session?.abilities?.includes("gql.products.brand.update")) {
  //   redirect("/admin")
  // }

  return (
    <AddOrderOffer
      uuid={uuid}
      title={(await generateMetadata()).title?.toString() as string}
    />
  )
}

export default ProjectEdit
