import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import OfferEdit from "@/app/(admin)/offers/components/OfferEdit"

const OfferEditPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.offer.update.index")) {
    redirect("/")
  }

  return uuid && <OfferEdit uuid={uuid} />
}

export default OfferEditPage
