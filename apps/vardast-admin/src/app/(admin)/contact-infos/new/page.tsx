import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import ContactInfoForm from "@vardast/component/desktop/ContactInfoForm"
import { ContactInfoRelatedTypes } from "@vardast/graphql/generated"
import { getServerSession } from "next-auth"

type CreateContactInfoPageProps = {
  params: { slug: Array<string | number> }
  searchParams: { [key: string]: string | string[] | undefined }
}

const CreateContactInfoPage = async ({
  searchParams: { id, type, fallback }
}: CreateContactInfoPageProps) => {
  if (!id || !type || !fallback) {
    redirect(fallback ? fallback[0] : "/contact-infos")
  }

  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.users.contact_info.index")) {
    redirect("/")
  }

  return (
    <ContactInfoForm
      relatedId={+id}
      relatedType={type as keyof typeof ContactInfoRelatedTypes}
      fallback={fallback as string}
    />
  )
}

export default CreateContactInfoPage
