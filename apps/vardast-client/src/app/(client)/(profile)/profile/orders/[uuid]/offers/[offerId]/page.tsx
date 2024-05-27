import { Metadata } from "next"

import OrderDetailPage from "@/app/(client)/(profile)/profile/orders/[uuid]/components/OrderDetailPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ثبت قیمت"
  }
}
const ProjectEdit = async ({
  params: { offerId, uuid }
}: {
  params: { offerId: string; uuid: string }
}) => {
  // const session = await getServerSession(authOptions)

  // if (!session?.abilities?.includes("gql.products.brand.update")) {
  //   redirect("/admin")
  // }

  return <OrderDetailPage uuid={uuid} offerId={offerId} />
}

export default ProjectEdit
