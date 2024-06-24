"use client"

import {
  Address,
  ContactInfo,
  useGetOneLegalQuery
} from "@vardast/graphql/generated"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/src/tabs"
import AddressesTab from "./address-Info/AddressesTab"
import ContactInfosTab from "./ContactInfosTab"

type Props = { uuid: string }

function LegalEdit({ uuid }: Props) {
  const { t } = useTranslation()
  const { data: session } = useSession()

  const data = useGetOneLegalQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    { refetchOnMount: "always" }
  )

  return (
    <>
      <Tabs
        defaultValue="addresses"
        className="flex h-full w-full flex-col gap-6"
      >
        <TabsList className="grid w-full grid-cols-3 border-b md:flex">
          <TabsTrigger value="addresses">{t("common:addresses")}</TabsTrigger>
          <TabsTrigger value="contactInfos">
            {t("common:contactInfos")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="addresses">
          <AddressesTab
            data={data}
            relatedType="Legal"
            relatedId={data?.data?.findOneLegal?.id}
            addresses={data?.data?.findOneLegal?.addresses as Address[]}
          />
        </TabsContent>
        <TabsContent value="contactInfos">
          <ContactInfosTab
            data={data}
            relatedType="Legal"
            relatedId={data?.data?.findOneLegal?.id}
            contactInfos={data?.data?.findOneLegal?.contacts as ContactInfo[]}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default LegalEdit
