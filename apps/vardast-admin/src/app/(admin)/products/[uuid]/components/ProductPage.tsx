"use client"

import { useCallback, useMemo } from "react"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Card, { CardProps } from "@vardast/component/Card"
import Dropzone from "@vardast/component/Dropzone"
import { ITableProps, Table, useTable } from "@vardast/component/table"
import { ProductModalEnum } from "@vardast/component/type"
import {
  AttributeValue,
  Image,
  Offer,
  Product,
  ThreeStateSupervisionStatuses,
  useGetProductQuery
} from "@vardast/graphql/generated"
import { ThreeStateSupervisionStatusesFa } from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Badge } from "@vardast/ui/badge"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import { formatDistanceToNow, setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

import OfferDeleteModal from "@/app/(admin)/offers/components/OfferDeleteModal"
import OfferModal from "@/app/(admin)/offers/components/OfferModal"
import AttributeDeleteModal from "@/app/(admin)/products/[uuid]/components/AttributeDeleteModal"
import AttributeModal from "@/app/(admin)/products/[uuid]/components/AttributeModal"
import ProductImagesModal from "@/app/(admin)/products/[uuid]/components/ProductImagesModal"
import ProductInfo from "@/app/(admin)/products/[uuid]/components/ProductInfo"

type Props = { uuid: string }

function ProductPage({ uuid }: Props) {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<ProductModalEnum>()

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const getProductQuery = useGetProductQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    {
      staleTime: 1000
    }
  )

  const publicOffersTableProps: ITableProps<Offer> = useTable({
    model: {
      name: "public-offers",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: ProductModalEnum.PUBLIC_OFFER
            }),
          text: t("common:add_entity", { entity: t("common:offer") }),
          variant: "primary"
        },
        title: t(`common:offers`)
      },
      fetch: {
        directData: {
          data: getProductQuery.data?.product?.publicOffers as Offer[],
          directLoading: getProductQuery.isLoading || getProductQuery.isFetching
        }
      },
      columns: [
        {
          header: t("common:price"),
          id: "lastPublicConsumerPrice",
          accessorFn: ({ lastPublicConsumerPrice }) =>
            digitsEnToFa(`${addCommas(lastPublicConsumerPrice?.amount)}` || "-")
        },
        {
          header: t("common:entity_name", { entity: t("common:seller") }),
          id: "name",
          accessorFn: ({ seller }) => digitsEnToFa(`${seller?.name}` || "-")
        },
        {
          header: t("common:submitted_date"),
          id: "createdAt",
          accessorFn: ({ createdAt }) =>
            digitsEnToFa(
              formatDistanceToNow(new Date(createdAt).getTime(), {
                addSuffix: true
              })
            )
        },
        {
          header: t("common:status"),
          id: "status",
          cell: ({ row }) => (
            <Badge
              variant={
                ThreeStateSupervisionStatuses[row?.original?.status]?.variant
              }
            >
              {ThreeStateSupervisionStatusesFa[row?.original?.status]?.name_fa}
            </Badge>
          )
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                size="small"
                variant="link"
                onClick={() => {
                  onChangeModals({
                    data: row.original,
                    type: ProductModalEnum.PUBLIC_OFFER_DELETE
                  })
                }}
              >
                {t("common:delete")}
              </Button>
            )
          }
        }
      ]
    },
    dependencies: [getProductQuery]
  })

  const attributeValuesTableProps: ITableProps<AttributeValue> = useTable({
    model: {
      name: "attribute-values",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: ProductModalEnum.ATTRIBUTE
            }),
          text: t("common:add_entity", { entity: t("common:attribute") }),
          variant: "primary"
        },
        title: t(`common:attributes`)
      },
      fetch: {
        directData: {
          data: getProductQuery.data?.product
            ?.attributeValues as AttributeValue[],
          directLoading: getProductQuery.isLoading || getProductQuery.isFetching
        }
      },
      columns: [
        {
          header: t("common:attribute"),
          id: "attribute",
          accessorFn: ({ attribute }) => attribute?.name || "-"
        },
        {
          header: t("common:value"),
          id: "value",
          cell: ({ row }) => (
            <span className="whitespace-pre-wrap">
              {`${row?.original?.value} ${row?.original?.attribute?.uom?.name || ""}` ||
                "-"}
            </span>
          )
        },
        {
          id: "sku",
          header: t("common:sku"),
          accessorFn: ({ sku }) => sku || "-"
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                size="small"
                variant="link"
                onClick={() => {
                  onChangeModals({
                    data: row.original,
                    type: ProductModalEnum.ATTRIBUTE_DELETE
                  })
                }}
              >
                {t("common:delete")}
              </Button>
            )
          }
        }
      ]
    },
    dependencies: [getProductQuery]
  })

  const modalProps = useCallback(
    (type: ProductModalEnum) => ({
      onCloseModals,
      onChangeModals,
      modals,
      open: modals?.type === type
    }),
    [modals]
  )

  const imagesCardProps: CardProps = useMemo(
    () => ({
      children: (
        <Dropzone
          existingImages={
            getProductQuery.data?.product &&
            (getProductQuery.data?.product?.images as Image[])
          }
        />
      ),
      title: t("common:images"),
      button: {
        onClick: () => {
          const { id, images } = getProductQuery.data?.product
          onChangeModals({
            type: ProductModalEnum.IMAGE,
            data: {
              productId: id,
              images
            }
          })
        },
        disabled: getProductQuery.isLoading,
        text: t("common:edit_entity", {
          entity: t("common:image")
        }),
        type: "button"
      }
    }),
    [getProductQuery]
  )
  return (
    <>
      <OfferModal {...modalProps(ProductModalEnum.PUBLIC_OFFER)} />
      <OfferDeleteModal {...modalProps(ProductModalEnum.PUBLIC_OFFER_DELETE)} />
      <AttributeModal {...modalProps(ProductModalEnum.ATTRIBUTE)} />
      <AttributeDeleteModal
        {...modalProps(ProductModalEnum.ATTRIBUTE_DELETE)}
      />
      <ProductImagesModal {...modalProps(ProductModalEnum.IMAGE)} />
      <ProductInfo
        product={getProductQuery?.data?.product as Product}
        loading={getProductQuery.isLoading}
        modal={[modals, onChangeModals, onCloseModals]}
      />
      <Table {...attributeValuesTableProps} />
      <Table {...publicOffersTableProps} />
      <Card {...imagesCardProps} />
    </>
  )
}

export default ProductPage
