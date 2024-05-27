import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import BrandEdit from "@/app/(admin)/brands/components/BrandEdit"

const BrandEditPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.brand.index")) {
    redirect("/")
  }

  return uuid && <BrandEdit uuid={uuid} />
}

export default BrandEditPage
