import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import AddressForm from "@vardast/component/desktop/AddressForm"
import { AddressRelatedTypes } from "@vardast/graphql/generated"
import { getServerSession } from "next-auth"

type CreateAddressPageProps = {
  params: { slug: (string | number)[] }
  searchParams: Record<string, string | string[] | undefined>
}

const CreateAddressPage = async ({
  searchParams: { id, type, fallback }
}: CreateAddressPageProps) => {
  if (!id || !type || !fallback) {
    redirect(fallback ? fallback[0] : "/addresses")
  }

  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.users.address.index")) {
    redirect("/")
  }

  return (
    <AddressForm
      fallback={fallback as string}
      relatedId={+id}
      relatedType={type as keyof typeof AddressRelatedTypes}
    />
  )
}

export default CreateAddressPage
