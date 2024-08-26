"use client"

import { AddFromProducts } from "@vardast/component/desktop/AddFromProducts"
import {
  IndexProductInput,
  useCreateOfferMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import useTranslation from "next-translate/useTranslation"

import ProductsPage from "@/app/(seller)/products/components/products-page"

type SearchIndexProps = {
  isMobileView: boolean
  slug: (string | number)[]
  args: IndexProductInput
}

const AllProductsIndexPage = ({
  isMobileView,
  slug,
  args
}: SearchIndexProps) => {
  const { t } = useTranslation()

  const sellerCreateOfferMutation = useCreateOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: () => {
        toast({
          description: t("common:entity_added_error", {
            entity: t("common:offer")
          }),
          duration: 2000,
          variant: "danger"
        })
      },
      onSuccess: () => {
        toast({
          description: "کالای شما با موفقیت اضافه شد",
          duration: 2000,
          variant: "success"
        })
      }
    }
  )
  return (
    <>
      {isMobileView ? (
        <ProductsPage
          hasSearch
          isSellerPanel
          slug={slug}
          args={args}
          isMobileView={isMobileView}
        />
      ) : (
        <AddFromProducts
          sellerCreateOfferMutation={sellerCreateOfferMutation}
        />
      )}
    </>
  )
}

export default AllProductsIndexPage
