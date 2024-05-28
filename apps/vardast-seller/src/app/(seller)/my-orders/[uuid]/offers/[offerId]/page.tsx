import { Metadata } from "next"

import AddSellerInfo from "@/app/(seller)/components/AddSellerInfo"

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
  return <AddSellerInfo uuid={uuid} offerId={offerId} />
}

export default ProjectEdit
