import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Cities from "@/app/(admin)/locations/components/city/Cities"

const CitiesPage = async ({
  params
}: {
  params: { countrySlug: string; provinceSlug: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.base.location.city.index")) {
    redirect("/")
  }

  const countrySlug = params.countrySlug
  const provinceSlug = params.provinceSlug

  return <Cities countrySlug={countrySlug} provinceSlug={provinceSlug} />
}

export default CitiesPage
