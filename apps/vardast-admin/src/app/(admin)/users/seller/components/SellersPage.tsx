"use client"

import Image from "next/image"
import {
  FilterComponentTypeEnum,
  ITableProps,
  Table,
  useTable
} from "@vardast/component/table"
import { SellerModalEnum } from "@vardast/component/type"
import {
  IndexSellerInputSchema,
  Seller,
  SellerType,
  ThreeStateSupervisionStatuses
} from "@vardast/graphql/generated"
import {
  HasEntityEnum,
  SellerTypeFa,
  ThreeStateSupervisionStatusesFa,
  VisibilityFa
} from "@vardast/lib/constants"
import { getAllSellersQueryFn } from "@vardast/query/queryFns/seller/getAllSellersQueryFn"
import { Badge } from "@vardast/ui/badge"
import { useModals } from "@vardast/ui/modal"
import { getEnumValues } from "@vardast/util/getEnumValues"
import { LucideWarehouse } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import SellerModal from "@/app/(admin)/users/seller/[uuid]/components/SellerModal"

const sellerStatus = [...getEnumValues(ThreeStateSupervisionStatuses)]
const sellerType = [...getEnumValues(SellerType)]

const SellerInputSchema = IndexSellerInputSchema()
  .omit({
    page: true,
    perPage: true
  })
  .optional()

type Props = {
  title?: string
}

const SellersPage = ({ title }: Props) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<SellerModalEnum>()

  const tableProps: ITableProps<Seller, typeof SellerInputSchema> = useTable({
    model: {
      name: `sellers`,
      paginable: true,
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: SellerModalEnum.INFO
            }),
          text: t("common:add_entity", { entity: t("common:seller") }),
          variant: "primary"
        },
        title
      },
      filters: {
        schema: SellerInputSchema,
        options: [
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "name",
            title: t("common:name")
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "status",
            title: t("common:status"),
            options: sellerStatus.map((seller) => ({
              key: ThreeStateSupervisionStatusesFa[seller]?.name_fa,
              value: seller.toUpperCase()
            }))
          },

          {
            type: FilterComponentTypeEnum.SELECT,
            name: "type",
            title: t("common:entity_type", { entity: t("common:seller") }),
            options: sellerType.map((seller) => ({
              key: SellerTypeFa[String(seller).toUpperCase()]?.name_fa,
              value: seller.toUpperCase()
            }))
          },
          {
            type: FilterComponentTypeEnum.TOGGLE,
            name: "isPublic",
            title: t("common:visibility"),
            optionsTitle: {
              true: VisibilityFa[HasEntityEnum.TRUE]?.name_fa,
              false: VisibilityFa[HasEntityEnum.FALSE]?.name_fa
            }
          },
          {
            type: FilterComponentTypeEnum.TOGGLE,
            name: "hasLogoFile",
            title: t("common:logo")
          }
        ]
      },
      onRow: {
        url: (row) => `/users/seller/${row?.original?.id}`
      },
      fetch: {
        api: getAllSellersQueryFn,
        options: {
          refetchOnMount: true
        }
      },
      columns: [
        {
          id: "image",
          header: t("common:image"),
          cell: ({ row }) => (
            <div className="relative aspect-square h-6 w-16 overflow-hidden rounded">
              {row?.original?.logoFile ? (
                <Image
                  alt={row?.original?.name}
                  fill
                  sizes="5vw"
                  src={row?.original?.logoFile.presignedUrl.url}
                />
              ) : (
                <LucideWarehouse
                  className="h-5 w-5 text-alpha-400"
                  strokeWidth={1.5}
                />
              )}
            </div>
          )
        },
        {
          id: "name",
          header: t("common:entity_name", { entity: t("common:seller") }),
          accessorKey: "name"
        },
        {
          header: t("common:entity_type", { entity: t("common:seller") }),
          id: "sellerType",
          cell: ({ row }) => (
            <Badge variant={SellerTypeFa[row?.original?.sellerType]?.variant}>
              {SellerTypeFa[row?.original?.sellerType]?.name_fa}
            </Badge>
          )
        },
        {
          header: t("common:entity_status", { entity: t("common:visibility") }),
          id: "isPublic",
          cell: ({ row }) => (
            <Badge
              variant={
                VisibilityFa[`${row?.original?.isPublic}`?.toUpperCase()]
                  ?.variant
              }
            >
              {
                VisibilityFa[`${row?.original?.isPublic}`?.toUpperCase()]
                  ?.name_fa
              }
            </Badge>
          )
        },
        {
          header: t("common:status"),
          id: "status",
          cell: ({ row }) => (
            <Badge
              variant={
                ThreeStateSupervisionStatusesFa[row?.original?.status]?.variant
              }
            >
              {ThreeStateSupervisionStatusesFa[row?.original?.status]?.name_fa}
            </Badge>
          )
        }
      ]
    }
  })

  return (
    <>
      <SellerModal
        modals={modals}
        open={modals?.type === SellerModalEnum.INFO}
        onChangeModals={onChangeModals}
        onCloseModals={onCloseModals}
      />
      <Table {...tableProps} />
    </>
  )
}

export default SellersPage
