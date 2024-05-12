"use client"

import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import { ContactInfo, useGetContactInfoQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import ContactInfoForm from "@/app/(admin)/contact-infos/components/ContactInfoForm"

type ContactInfoEditProps = {
  uuid: string
  fallback: string
}

const ContactInfoEdit = ({ uuid, fallback }: ContactInfoEditProps) => {
  const { isLoading, error, data } = useGetContactInfoQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return (
    <ContactInfoForm
      passedContactInfo={data.contactInfo as ContactInfo}
      fallback={fallback}
    />
  )
}

export default ContactInfoEdit
