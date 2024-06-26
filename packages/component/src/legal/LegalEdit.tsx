"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Address,
  ContactInfo,
  useGetOneLegalQuery
} from "@vardast/graphql/generated"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/src/tabs"
import PageTitle from "../project/PageTitle"
import AddressesTab from "./address-Info/AddressesTab"
import ContactInfosTab from "./ContactInfosTab"

type Props = { title: string; uuid: string }

export enum LEGAL_TAB {
  ADDRESS = "addresses",
  CONTACT = "contactInfos"
}

function LegalEdit({ title, uuid }: Props) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<LEGAL_TAB>(
    (searchParams.get("tab") as LEGAL_TAB) || LEGAL_TAB.ADDRESS
  )

  const data = useGetOneLegalQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    { refetchOnMount: "always" }
  )

  const changeTab = (e: string) => {
    const params = new URLSearchParams(searchParams as any)
    if (params.has("tab")) {
      params.delete("tab")
    }
    params.append("tab", e)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)
    setActiveTab(e as LEGAL_TAB)
  }

  return (
    <div className="flex h-full w-full flex-col gap-9 py-6 md:py-0">
      <PageTitle backButtonUrl="/users/legal" title={title} />
      <Tabs
        value={activeTab}
        defaultValue={LEGAL_TAB.ADDRESS}
        onValueChange={(e) => changeTab(e)}
        className="flex h-full w-full flex-col gap-6"
      >
        <TabsList className="grid w-full grid-cols-3 border-b md:flex">
          <TabsTrigger value={LEGAL_TAB.ADDRESS}>
            {t("common:addresses")}
          </TabsTrigger>
          <TabsTrigger value={LEGAL_TAB.CONTACT}>
            {t("common:contactInfos")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={LEGAL_TAB.ADDRESS}>
          <AddressesTab
            data={data}
            relatedType="Legal"
            relatedId={data?.data?.findOneLegal?.id}
            addresses={data?.data?.findOneLegal?.addresses as Address[]}
          />
        </TabsContent>
        <TabsContent value={LEGAL_TAB.CONTACT}>
          <ContactInfosTab
            data={data}
            relatedType="Legal"
            relatedId={data?.data?.findOneLegal?.id}
            contactInfos={data?.data?.findOneLegal?.contacts as ContactInfo[]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LegalEdit
