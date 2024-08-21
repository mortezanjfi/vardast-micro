"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import {
  FilterComponentTypeEnum,
  ITableProps,
  Table,
  useTable
} from "@vardast/component/table"
import { BrandModalEnum } from "@vardast/component/type"
import {
  Brand,
  ThreeStateSupervisionStatuses,
  useGetAllCategoriesV2Query,
  useGetAllCitiesQuery
} from "@vardast/graphql/generated"
import { statusesOfAvailability } from "@vardast/lib/AvailabilityStatus"
import { brandSorts } from "@vardast/lib/BrandSort"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { getAllBrandsQueryFn } from "@vardast/query/queryFns/brands/getAllBrandsQueryFn"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { useModals } from "@vardast/ui/modal"
import { checkBooleanByString } from "@vardast/util/checkBooleanByString"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"
import { TypeOf, z } from "zod"

import BrandDeleteModal from "@/app/(admin)/brands/components/BrandDeleteModal"

// import { BrandFileUpload } from "@/app/admin/brands/components/BrandFileUpload"

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="brand" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

const BrandFilterSchema = z.object({
  name: z.string(),
  hasLogoFile: z.string(),
  hasCatalogeFile: z.string(),
  hasPriceList: z.string(),
  hasBannerFile: z.string(),
  sortType: z.string().optional(),
  categoryId: z.string().optional(),
  cityId: z.string().optional()
})
export type FilterFields = TypeOf<typeof BrandFilterSchema>

const Brands = () => {
  const { t } = useTranslation()
  const router = useRouter()
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

  const onAddNewBrand = () => {
    router.push("/brands/new")
  }
  const tableProps: ITableProps<Brand, typeof BrandFilterSchema> = useTable({
    model: {
      name: "brands",
      container: {
        button: {
          onClick: onAddNewBrand,
          text: t("common:add_entity", { entity: t("common:brand") }),
          variant: "primary"
        },
        title: t("common:entity_list", { entity: t("common:brands") })
      },
      paginable: true,
      fetch: {
        api(args) {
          return getAllBrandsQueryFn({
            ...args,
            hasBannerFile:
              args.hasBannerFile && checkBooleanByString(args.hasBannerFile),
            hasLogoFile:
              args.hasLogoFile && checkBooleanByString(args.hasLogoFile),
            hasCatalogeFile:
              args.hasCatalogeFile &&
              checkBooleanByString(args.hasCatalogeFile),
            hasPriceList:
              args.hasPriceList && checkBooleanByString(args.hasPriceList)
          })
        }
      },
      filters: {
        schema: BrandFilterSchema,
        options: [
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "name",
            title: t("common:brand")
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "hasLogoFile",
            title: t("common:logo"),
            options: statusesOfAvailability.map((item) => ({
              key: item.status,
              value: `${item.value.toUpperCase()}`
            }))
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "hasCatalogeFile",
            title: t("common:catalog"),
            options: statusesOfAvailability.map((item) => ({
              key: item.status,
              value: `${item.value.toUpperCase()}`
            }))
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "hasPriceList",
            title: t("common:price_list"),
            options: statusesOfAvailability.map((item) => ({
              key: item.status,
              value: `${item.value.toUpperCase()}`
            }))
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "hasBannerFile",
            title: t("common:banner"),
            options: statusesOfAvailability.map((item) => ({
              key: item.status,
              value: `${item.value.toUpperCase()}`
            }))
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
                  src={
                    (row?.original?.logoFile?.presignedUrl?.url as string) ??
                    "/images/seller-blank.png"
                  }
                  alt={row?.original?.name}
                  sizes="5vw"
                  fill
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
          accessorFn: (item) => digitsEnToFa(addCommas(item?.sum))
        },
        {
          id: "views",
          header: t("common:entity_count", { entity: t("common:views") }),
          accessorFn: (item) => digitsEnToFa(addCommas(item?.views))
        },
        {
          id: "hasPriceList",
          header: t("common:price_list"),
          cell({ row }) {
            return row?.original?.priceList?.id ? (
              <span className="tag  tag-sm tag-success">{t("common:has")}</span>
            ) : (
              <span className="tag tag-sm tag-danger">
                {t("common:has_not")}
              </span>
            )
          }
        },
        {
          id: "hasCatalogeFile",
          header: t("common:catalog"),
          cell: ({ row }) => {
            return row?.original?.catalog?.id ? (
              <span className="tag tag-sm tag-success">{t("common:has")}</span>
            ) : (
              <span className="tag tag-sm tag-danger">
                {t("common:has_not")}
              </span>
            )
          }
        },
        {
          id: "priceList",
          header: t("common:banner"),
          cell: ({ row }) => {
            return (
              <div className="flex gap-1">
                <span
                  className={clsx(
                    "tag  tag-sm ",
                    row?.original?.bannerMobile?.id
                      ? "tag-success"
                      : "tag-danger"
                  )}
                >
                  {t("common:mobile")}
                </span>
                <span
                  className={clsx(
                    "tag  tag-sm",
                    row?.original?.bannerDesktop?.id
                      ? "tag-success"
                      : "tag-danger"
                  )}
                >
                  {t("common:desktop")}
                </span>
              </div>
            )
          }
        },
        {
          id: "brandStatus",
          header: t("common:status"),
          cell: ({ row }) => {
            return (
              <>
                {row?.original?.status ===
                  ThreeStateSupervisionStatuses.Confirmed && (
                  <span className="">{t("common:confirmed")}</span>
                )}

                {row.original.status ===
                  ThreeStateSupervisionStatuses.Pending && (
                  <span className="">{t("common:pending")}</span>
                )}

                {row.original.status ===
                  ThreeStateSupervisionStatuses.Rejected && (
                  <span className="">{t("common:rejected")}</span>
                )}
              </>
            )
          }
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <div className="flex gap-2">
                <Link target="_blank" href={`/brands/${row?.original?.id}`}>
                  <span className="tag cursor-pointer text-blue-500">
                    {t("common:edit")}
                  </span>
                </Link>
                <span
                  className="tag cursor-pointer text-error"
                  onClick={() => {
                    onChangeModals({
                      data: row.original,
                      type: BrandModalEnum.DELETE
                    })
                  }}
                >
                  {t("common:delete")}
                </span>
              </div>
            )
          }
        }
      ]
    },
    dependencies: [
      cities,
      categories,
      cities.data,
      categories.data,
      getAllBrandsQueryFn
    ]
  })

  return (
    <>
      <BrandDeleteModal
        onChangeModals={onChangeModals}
        onCloseModals={onCloseModals}
        modals={modals}
        open={modals?.type === BrandModalEnum.DELETE}
      />
      <Table {...tableProps} />
    </>
  )
}

export default Brands
