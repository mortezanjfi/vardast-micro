"use client"

import { useMemo } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import DetailsCard from "@vardast/component/desktop/DetailsCard"
import { ProductModalEnum } from "@vardast/component/type"
import { DetailsCardPropsType } from "@vardast/component/types/type"
import { Product } from "@vardast/graphql/generated"
import {
  ActiveNotActiveFa,
  ProductTypesEnumFa,
  ThreeStateSupervisionStatusesFa
} from "@vardast/lib/constants"
import { UseModalsReturn } from "@vardast/ui/modal"
import { formatDistanceToNow } from "date-fns"
import useTranslation from "next-translate/useTranslation"

import ProductModal from "./ProductModal"

type ProductInfoProps = {
  product: Product
  loading?: boolean
  modal: UseModalsReturn<ProductModalEnum>
}

const ProductInfo = ({ product, loading, modal }: ProductInfoProps) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = modal

  const detailsCardProps: DetailsCardPropsType = useMemo(
    () => ({
      badges: [
        {
          children:
            ThreeStateSupervisionStatusesFa[
              String(product?.status).toUpperCase()
            ]?.name_fa,
          variant:
            ThreeStateSupervisionStatusesFa[
              String(product?.status).toUpperCase()
            ]?.variant
        },
        {
          children:
            ActiveNotActiveFa[String(product?.isActive).toUpperCase()]?.name_fa,
          variant:
            ActiveNotActiveFa[String(product?.isActive).toUpperCase()]?.variant
        },
        {
          children: ProductTypesEnumFa[product?.type]?.name_fa,
          variant: ProductTypesEnumFa[product?.type]?.variant
        }
      ],
      items: [
        {
          item: {
            // key: t("common:entity_name", { entity: t("common:product") }),
            value: product?.name
          },
          className: "font-bold text-lg col-span-full"
        },
        {
          item: {
            key: t("common:entity_name", { entity: t("common:brand") }),
            value: product?.brand?.name
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:entity_name", { entity: t("common:category") }),
            value: product?.category?.title
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:uom"),
            value: product?.uom?.name
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:entity_code", { entity: t("common:product") }),
            value: product?.sku
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:slug"),
            value: product?.slug
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:description"),
            value: product?.description
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:title"),
            value: product?.title
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:meta_description"),
            value: product?.metaDescription
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:submitted_date"),
            value: product?.createdAt
              ? digitsEnToFa(
                  formatDistanceToNow(new Date(product?.createdAt).getTime(), {
                    addSuffix: true
                  })
                )
              : "-"
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:rating"),
            value: product?.rating
          },
          className: "col-span-full"
        },

        {
          item: {
            key: t("common:views"),
            value: product?.views
          },
          className: "col-span-full"
        }
      ],
      card: {
        title: t("common:entity_info", { entity: t("common:product") }),
        button: {
          onClick: () => {
            const { uom } = product
            onChangeModals({
              type: ProductModalEnum.INFO,
              data: {
                ...product,
                uomId: uom?.id
              }
            })
          },
          disabled: loading,
          text: t("common:edit_entity", {
            entity: t("common:entity_info", { entity: t("common:product") })
          }),
          type: "button"
        }
      }
    }),
    [product]
  )

  return (
    <>
      <ProductModal
        modals={modals}
        open={modals?.type === ProductModalEnum.INFO}
        onCloseModals={onCloseModals}
      />
      <DetailsCard {...detailsCardProps} />
    </>
  )
}

export default ProductInfo
