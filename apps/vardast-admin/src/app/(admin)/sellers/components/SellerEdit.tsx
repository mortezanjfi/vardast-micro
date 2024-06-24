"use client"

import { notFound } from "next/navigation"
import AddressesTab from "@vardast/component/legal/address-Info/AddressesTab"
import ContactInfosTab from "@vardast/component/legal/ContactInfosTab"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import PageTitle from "@vardast/component/project/PageTitle"
import {
  Address,
  ContactInfo,
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

type Props = {
  title: string
  uuid: string
}

const SellerEdit = ({ title, uuid }: Props) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const data = useGetSellerQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    {
      staleTime: 1000
    }
  )

  if (data?.isLoading) return <Loading />
  if (data?.error) return <LoadingFailed />
  if (!data?.data) notFound()

  return (
    <div className="flex h-full w-full flex-col gap-9 py-6 md:py-0">
      <PageTitle backButtonUrl="/sellers" title={title} />
      <Tabs defaultValue="information">
        <TabsList>
          <TabsTrigger value="information">
            {t("common:information")}
          </TabsTrigger>
          {data?.data?.seller &&
            session?.abilities?.includes("gql.users.address.index") && (
              <TabsTrigger value="addresses">
                {t("common:addresses")}
              </TabsTrigger>
            )}
          {data?.data?.seller &&
            session?.abilities?.includes("gql.users.contact_info.index") && (
              <TabsTrigger value="contactInfos">
                {t("common:contactInfos")}
              </TabsTrigger>
            )}
          {data?.data?.seller &&
            session?.abilities?.includes(
              "gql.products.seller_representative.index"
            ) && (
              <TabsTrigger value="members">{t("common:members")}</TabsTrigger>
            )}
        </TabsList>
        <TabsContent value="information">
          <SellerForm seller={data?.data?.seller as Seller} />
        </TabsContent>
        {data?.data?.seller &&
          session?.abilities?.includes("gql.users.address.index") && (
            <TabsContent value="addresses">
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
            <TabsContent value="contactInfos">
              <ContactInfosTab
                data={data}
                relatedType="Seller"
                relatedId={data?.data?.seller.id}
                contactInfos={data?.data?.seller.contacts as ContactInfo[]}
              />
            </TabsContent>
          )}
        {data?.data?.seller &&
          session?.abilities?.includes(
            "gql.products.seller_representative.index"
          ) && (
            <TabsContent value="members">
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
