"use client"

import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import PageHeader from "@vardast/component/PageHeader"
import {
  Address,
  ContactInfo,
  Seller,
  SellerRepresentative,
  useGetSellerQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientAdmin from "@vardast/query/queryClients/graphqlRequestClientWhitToken"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import AddressesTab from "@/app/(admin)/components/AddressesTab"
import ContactInfosTab from "@/app/(admin)/components/ContactInfosTab"
import MembersTab from "@/app/(admin)/sellers/components/MembersTab"
import SellerForm from "@/app/(admin)/sellers/components/SellerForm"

type Props = {
  uuid: string
}

const SellerEdit = ({ uuid }: Props) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { isLoading, error, data } = useGetSellerQuery(
    graphqlRequestClientAdmin,
    {
      id: +uuid
    },
    {
      staleTime: 1000
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return (
    <>
      <PageHeader title={data.seller.name}></PageHeader>
      <Tabs defaultValue="information">
        <TabsList>
          <TabsTrigger value="information">
            {t("common:information")}
          </TabsTrigger>
          {data.seller &&
            session?.abilities?.includes("gql.users.address.index") && (
              <TabsTrigger value="addresses">
                {t("common:addresses")}
              </TabsTrigger>
            )}
          {data.seller &&
            session?.abilities?.includes("gql.users.contact_info.index") && (
              <TabsTrigger value="contactInfos">
                {t("common:contactInfos")}
              </TabsTrigger>
            )}
          {data.seller &&
            session?.abilities?.includes(
              "gql.products.seller_representative.index"
            ) && (
              <TabsTrigger value="members">{t("common:members")}</TabsTrigger>
            )}
        </TabsList>
        <TabsContent value="information">
          <SellerForm seller={data.seller as Seller} />
        </TabsContent>
        {data.seller &&
          session?.abilities?.includes("gql.users.address.index") && (
            <TabsContent value="addresses">
              <AddressesTab
                relatedType="Seller"
                relatedId={data.seller.id}
                addresses={data.seller.addresses as Address[]}
              />
            </TabsContent>
          )}
        {data.seller &&
          session?.abilities?.includes("gql.users.contact_info.index") && (
            <TabsContent value="contactInfos">
              <ContactInfosTab
                relatedType="Seller"
                relatedId={data.seller.id}
                contactInfos={data.seller.contacts as ContactInfo[]}
              />
            </TabsContent>
          )}
        {data.seller &&
          session?.abilities?.includes(
            "gql.products.seller_representative.index"
          ) && (
            <TabsContent value="members">
              <MembersTab
                sellerId={data.seller.id}
                representatives={
                  data.seller.representatives as SellerRepresentative[]
                }
              />
            </TabsContent>
          )}
      </Tabs>
    </>
  )
}

export default SellerEdit
