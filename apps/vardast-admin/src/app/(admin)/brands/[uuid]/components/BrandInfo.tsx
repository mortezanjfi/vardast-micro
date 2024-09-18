"use client"

import { useMemo } from "react"
import Image from "next/image"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import DetailsCard from "@vardast/component/desktop/DetailsCard"
import { BrandModalEnum } from "@vardast/component/type"
import { DetailsCardPropsType } from "@vardast/component/types/type"
import { Brand } from "@vardast/graphql/generated"
import { ThreeStateSupervisionStatusesFa } from "@vardast/lib/constants"
import { UseModalsReturn } from "@vardast/ui/modal"
import { formatDistanceToNow } from "date-fns"
import { LucideWarehouse } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import BrandModal from "@/app/(admin)/brands/[uuid]/components/BrandModal"

type BrandInfoProps = {
  brand: Brand
  loading?: boolean
  modal: UseModalsReturn<BrandModalEnum>
}

const BrandInfo = ({ brand, loading, modal }: BrandInfoProps) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = modal

  const detailsCardProps: DetailsCardPropsType = useMemo(
    () => ({
      badges: [
        {
          children:
            ThreeStateSupervisionStatusesFa[String(brand?.status).toUpperCase()]
              ?.name_fa,
          variant:
            ThreeStateSupervisionStatusesFa[String(brand?.status).toUpperCase()]
              ?.variant
        }
      ],
      items: [
        {
          item: {
            value: brand?.name
          },
          className: "font-bold text-lg col-span-full"
        },
        {
          item: {
            value: (
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {brand?.logoFile ? (
                  <Image
                    alt="..."
                    className="object-contain p-3"
                    fill
                    src={brand?.logoFile?.presignedUrl.url}
                  />
                ) : (
                  <LucideWarehouse
                    className="h-8 w-8 text-alpha-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            )
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:entity_name", { entity: t("common:category") }),
            value: brand?.category?.title
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:slug"),
            value: brand?.slug
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:submitted_date"),
            value: brand?.createdAt
              ? digitsEnToFa(
                  formatDistanceToNow(new Date(brand?.createdAt).getTime(), {
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
            value: brand?.rating
          },
          className: "col-span-full"
        },

        {
          item: {
            key: t("common:views"),
            value: brand?.views
          },
          className: "col-span-full"
        }
      ],
      card: {
        title: t("common:entity_info", { entity: t("common:brand") }),
        button: {
          onClick: () => {
            onChangeModals({
              type: BrandModalEnum.INFO,
              data: brand
            })
          },
          disabled: loading,
          text: t("common:edit_entity", {
            entity: t("common:entity_info", { entity: t("common:brand") })
          }),
          type: "button"
        }
      }
    }),
    [brand]
  )

  return (
    <>
      <BrandModal
        modals={modals}
        open={modals?.type === BrandModalEnum.INFO}
        onCloseModals={onCloseModals}
      />
      <DetailsCard {...detailsCardProps} />
    </>
  )
}

export default BrandInfo
