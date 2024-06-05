import { Metadata } from "next"

import OrderDetailPage from "@/app/(client)/profile/orders/[uuid]/components/OrderDetailPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تایید سفارش"
  }
}
const ProjectEdit = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  return <OrderDetailPage uuid={uuid} />
}

export default ProjectEdit
