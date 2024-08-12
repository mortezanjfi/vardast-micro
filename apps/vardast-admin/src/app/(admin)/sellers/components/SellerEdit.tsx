"use client"

import { useState } from "react"
import { notFound, usePathname, useSearchParams } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import PageTitle from "@vardast/component/page-title"
import {
  Seller,
  SellerRepresentative,
  useGetSellerQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import MembersTab from "@/app/(admin)/sellers/components/MembersTab"
import SellerForm from "@/app/(admin)/sellers/components/SellerForm"

export enum SELLER_EDIT_TAB {
  INFO = "information",
  ADDRESS = "addresses",
  CONTACT = "contactInfos",
  MEMBERS = "members"
}

type Props = {
  title: string
  uuid: string
}

const SellerEdit = ({ title, uuid }: Props) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<SELLER_EDIT_TAB>(
    (searchParams.get("tab") as SELLER_EDIT_TAB) || SELLER_EDIT_TAB.INFO
  )

  const data = useGetSellerQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    {
      staleTime: 1000
    }
  )

  const changeTab = (e: string) => {
    const params = new URLSearchParams(searchParams as any)
    if (params.has("tab")) {
      params.delete("tab")
    }
    params.append("tab", e)
    const newUrl = `${pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)
    setActiveTab(e as SELLER_EDIT_TAB)
  }

  if (data?.isLoading) return <Loading />
  if (data?.error) return <LoadingFailed />
  if (!data?.data) notFound()

  return (
    <div className="flex h-full w-full flex-col gap-9 py-6 md:py-0">
      <PageTitle backButtonUrl="/sellers" title={title} />
      <Tabs
        value={activeTab}
        onValueChange={(e) => changeTab(e)}
        defaultValue={SELLER_EDIT_TAB.INFO}
      >
        <TabsList>
          <TabsTrigger value={SELLER_EDIT_TAB.INFO}>
            {t("common:information")}
          </TabsTrigger>
          {data?.data?.seller &&
            session?.abilities?.includes("gql.users.address.index") && (
              <TabsTrigger value={SELLER_EDIT_TAB.ADDRESS}>
                {t("common:addresses")}
              </TabsTrigger>
            )}
          {data?.data?.seller &&
            session?.abilities?.includes("gql.users.contact_info.index") && (
              <TabsTrigger value={SELLER_EDIT_TAB.CONTACT}>
                {t("common:contactInfos")}
              </TabsTrigger>
            )}
          {data?.data?.seller &&
            session?.abilities?.includes(
              "gql.products.seller_representative.index"
            ) && (
              <TabsTrigger value={SELLER_EDIT_TAB.MEMBERS}>
                {t("common:members")}
              </TabsTrigger>
            )}
        </TabsList>
        <TabsContent value={SELLER_EDIT_TAB.INFO}>
          <SellerForm seller={data?.data?.seller as Seller} />
        </TabsContent>
        {/* {data?.data?.seller &&
          session?.abilities?.includes("gql.users.address.index") && (
            <TabsContent value={SELLER_EDIT_TAB.ADDRESS}>
              <AddressesTab
                data={data}
                relatedType="Seller"
                relatedId={data?.data?.seller.id}
                addresses={data?.data?.seller.addresses as Address[]}
              />
            </TabsContent>
          )}
        {data?.data?.seller &&
          session?.abilities?.includes("gql.users.contact_info.index") && (
            <TabsContent value={SELLER_EDIT_TAB.CONTACT}>
              <ContactInfosTab
                data={data}
                relatedType="Seller"
                relatedId={data?.data?.seller.id}
                contactInfos={data?.data?.seller.contacts as ContactInfo[]}
              />
            </TabsContent>
          )} */}
        {data?.data?.seller &&
          session?.abilities?.includes(
            "gql.products.seller_representative.index"
          ) && (
            <TabsContent value={SELLER_EDIT_TAB.MEMBERS}>
              <MembersTab
                sellerId={data?.data?.seller.id}
                representatives={
                  data?.data?.seller.representatives as SellerRepresentative[]
                }
              />
            </TabsContent>
          )}
      </Tabs>
    </div>
  )
}

export default SellerEdit
