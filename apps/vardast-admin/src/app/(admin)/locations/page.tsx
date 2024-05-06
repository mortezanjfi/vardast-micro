import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Countries from "./components/country/Countries"

const LocationsIndex = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.base.location.country.index")) {
    redirect("/admin")
  }

  return <Countries />
}

export default LocationsIndex
