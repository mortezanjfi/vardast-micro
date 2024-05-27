import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import ContactInfoEdit from "@/app/(admin)/contact-infos/components/ContactInfoEdit"

type ContactInfoEditPageProps = {
  params: { uuid: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const ContactInfoEditPage = async ({
  params: { uuid },
  searchParams
}: ContactInfoEditPageProps) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.users.contact_info.index")) {
    redirect("/")
  }

  return (
    uuid && (
      <ContactInfoEdit uuid={uuid} fallback={searchParams.fallback as string} />
    )
  )
}

export default ContactInfoEditPage
