"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import {
  FilterComponentTypeEnum,
  ITableProps,
  Table,
  useTable
} from "@vardast/component/table"
import { BrandModalEnum } from "@vardast/component/type"
import {
  Brand,
  IndexBrandInputSchema,
  ThreeStateSupervisionStatuses,
  useGetAllCategoriesV2Query,
  useGetAllCitiesQuery
} from "@vardast/graphql/generated"
import { brandSorts } from "@vardast/lib/BrandSort"
import {
  HasEntityEnum,
  HasHasNotFa,
  ThreeStateSupervisionStatusesFa
} from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { getAllBrandsQueryFn } from "@vardast/query/queryFns/brands/getAllBrandsQueryFn"
import { Badge } from "@vardast/ui/badge"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import useTranslation from "next-translate/useTranslation"

import BrandModal from "@/app/(admin)/brands/[uuid]/components/BrandModal"
import BrandDeleteModal from "@/app/(admin)/brands/components/BrandDeleteModal"

const BrandInputSchema = IndexBrandInputSchema()
  .omit({
    page: true,
    perPage: true
  })
  .optional()

const BrandsPage = () => {
  const { t } = useTranslation()
  const [cityQuery, setCityQuery] = useState<string>("")
  const [categoryQuery, setCategoryQuery] = useState("")
  const [modals, onChangeModals, onCloseModals] = useModals<BrandModalEnum>()

  const cities = useGetAllCitiesQuery(graphqlRequestClientWithToken, {
    indexCityInput: { name: cityQuery, perPage: 5 }
  })

  const categories = useGetAllCategoriesV2Query(graphqlRequestClientWithToken, {
    indexCategoryInput: {
      name: categoryQuery
    }
  })

  const tableProps: ITableProps<Brand, typeof BrandInputSchema> = useTable({
    model: {
      name: "brands",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: BrandModalEnum.INFO
            }),
          text: t("common:add_entity", { entity: t("common:brand") }),
          variant: "primary"
        },
        title: t(`common:brands`)
      },
      onRow: {
        url: (row) => `/brands/${row?.original?.id}`
      },
      paginable: true,
      fetch: {
        api: getAllBrandsQueryFn
      },
      filters: {
        schema: BrandInputSchema,
        options: [
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "name",
            title: t("common:brand")
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "sortType",
            title: t("common:sorting"),
            options: brandSorts.map((item) => ({
              key: item.status,
              value: `${item.value.toUpperCase()}`
            }))
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "cityId",
            title: t("common:city"),
            options: cities?.data?.cities?.data?.map((item) => ({
              key: item.name,
              value: `${item.id}`
            })),
            loading: cities.isLoading,
            setSearch: setCityQuery
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "categoryId",
            title: t("common:category"),
            options: categories?.data?.allCategoriesV2?.map((item) => ({
              key: item.title,
              value: `${item.id}`
            })),
            loading: categories.isLoading,
            setSearch: setCategoryQuery
          },
          {
            type: FilterComponentTypeEnum.TOGGLE,
            name: "hasLogoFile",
            title: t("common:entity_status", {
              entity: t("common:logo")
            }),
            optionsTitle: {
              true: HasHasNotFa[HasEntityEnum.TRUE]?.name_fa,
              false: HasHasNotFa[HasEntityEnum.FALSE]?.name_fa
            }
          },
          {
            type: FilterComponentTypeEnum.TOGGLE,
            name: "hasCatalogeFile",
            title: t("common:entity_status", {
              entity: t("common:catalog")
            }),
            optionsTitle: {
              true: HasHasNotFa[HasEntityEnum.TRUE]?.name_fa,
              false: HasHasNotFa[HasEntityEnum.FALSE]?.name_fa
            }
          },
          {
            type: FilterComponentTypeEnum.TOGGLE,
            name: "hasPriceList",
            title: t("common:entity_status", {
              entity: t("common:price_list")
            }),
            optionsTitle: {
              true: HasHasNotFa[HasEntityEnum.TRUE]?.name_fa,
              false: HasHasNotFa[HasEntityEnum.FALSE]?.name_fa
            }
          },
          {
            type: FilterComponentTypeEnum.TOGGLE,
            name: "hasBannerFile",
            title: t("common:banner", {
              entity: t("common:banner")
            }),
            optionsTitle: {
              true: HasHasNotFa[HasEntityEnum.TRUE]?.name_fa,
              false: HasHasNotFa[HasEntityEnum.FALSE]?.name_fa
            }
          }
        ]
      },
      columns: [
        {
          id: "image",
          header: t("common:image"),
          cell: ({ row }) => {
            return (
              <div className="relative aspect-square h-12 w-12 overflow-hidden rounded">
                <Image
                  alt={row?.original?.name}
                  fill
                  sizes="5vw"
                  src={
                    row?.original?.logoFile?.presignedUrl?.url ??
                    "/images/seller-blank.png"
                  }
                />
              </div>
            )
          }
        },
        {
          id: "name",
          header: t("common:product"),
          accessorKey: "name"
        },
        {
          id: "productsNum",
          header: t("common:entity_count", { entity: t("common:product") }),
          accessorFn: (item) =>
            item?.sum ? digitsEnToFa(addCommas(item?.sum)) : "-"
        },
        {
          id: "views",
          header: t("common:entity_count", { entity: t("common:views") }),
          accessorFn: (item) =>
            item?.views ? digitsEnToFa(addCommas(item?.views)) : "-"
        },
        {
          id: "hasPriceList",
          header: t("common:price_list"),
          cell({ row }) {
            return (
              <Badge
                variant={row?.original?.priceList?.id ? "success" : "danger"}
              >
                {row?.original?.priceList?.id
                  ? t("common:has")
                  : t("common:has_not")}
              </Badge>
            )
          }
        },
        {
          id: "hasCatalogeFile",
          header: t("common:catalog"),
          cell: ({ row }) => {
            return (
              <Badge
                variant={row?.original?.catalog?.id ? "success" : "danger"}
              >
                {row?.original?.catalog?.id
                  ? t("common:has")
                  : t("common:has_not")}
              </Badge>
            )
          }
        },
        {
          id: "priceList",
          header: t("common:banner"),
          cell: ({ row }) => {
            return (
              <div className="flex gap-1">
                <Badge
                  variant={
                    row?.original?.bannerMobile?.id ? "success" : "danger"
                  }
                >
                  {row?.original?.bannerMobile?.id
                    ? t("common:has")
                    : t("common:has_not")}
                </Badge>
                <Badge
                  variant={
                    row?.original?.bannerDesktop?.id ? "success" : "danger"
                  }
                >
                  {row?.original?.bannerDesktop?.id
                    ? t("common:has")
                    : t("common:has_not")}
                </Badge>
              </div>
            )
          }
        },
        {
          id: "brandStatus",
          header: t("common:status"),
          cell: ({ row }) => {
            return (
              <Badge
                variant={
                  ThreeStateSupervisionStatuses[row?.original?.status]?.variant
                }
              >
                {
                  ThreeStateSupervisionStatusesFa[row?.original?.status]
                    ?.name_fa
                }
              </Badge>
            )
          }
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
                    type: BrandModalEnum.DELETE
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
    dependencies: [cities, categories, cities.data, categories.data]
  })

  const modalProps = useCallback(
    (type: BrandModalEnum) => ({
      onCloseModals,
      onChangeModals,
      modals,
      open: modals?.type === type
    }),
    [modals]
  )

  return (
    <>
      <BrandModal {...modalProps(BrandModalEnum.INFO)} />
      <BrandDeleteModal {...modalProps(BrandModalEnum.DELETE)} />
      <Table {...tableProps} />
    </>
  )
}

export default BrandsPage
