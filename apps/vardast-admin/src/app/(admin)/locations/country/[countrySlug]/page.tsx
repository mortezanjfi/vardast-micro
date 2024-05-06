import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Provinces from "@/app/(admin)/locations/components/province/Provinces"

const ProvincesPage = async ({
  params
}: {
  params: { countrySlug: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.base.location.province.index")) {
    redirect("/admin")
  }

  const countrySlug = params.countrySlug as string

  return <Provinces countrySlug={countrySlug} />
}

export default ProvincesPage
