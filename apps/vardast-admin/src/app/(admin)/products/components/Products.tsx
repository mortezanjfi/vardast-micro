"use client"

import { useState } from "react"
import Image from "next/image"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import {
  FilterComponentTypeEnum,
  ITableProps,
  Table,
  useTable
} from "@vardast/component/table"
import { ProductModalEnum } from "@vardast/component/type"
import {
  IndexProductInputSchema,
  Product,
  useGetAllBrandsWithoutPaginationQuery,
  useGetAllCategoriesV2Query
} from "@vardast/graphql/generated"
import {
  imageExistence,
  productPriceOptions
} from "@vardast/lib/AvailabilityStatus"
import { HasEntityEnum, VisibilityFa } from "@vardast/lib/constants"
import { productsSort } from "@vardast/lib/productSort"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/products/getAllProductsQueryFn"
import { Badge } from "@vardast/ui/badge"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

import ProductDeleteModal from "@/app/(admin)/products/components/ProductDeleteModal"

const ProductInputSchema = IndexProductInputSchema()
  .omit({
    page: true,
    perPage: true
  })
  .optional()

type Props = {
  title?: string
}

const Products = ({ title }: Props) => {
  const { t } = useTranslation()
  const [categoryQuery, setCategoryQuery] = useState("")
  const [brandsQuery, setBrandsQuery] = useState("")
  const [modals, onChangeModals, onCloseModals] = useModals<ProductModalEnum>()

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const categories = useGetAllCategoriesV2Query(graphqlRequestClientWithToken, {
    indexCategoryInput: {
      name: categoryQuery
    }
  })

  const brands = useGetAllBrandsWithoutPaginationQuery(
    graphqlRequestClientWithToken,
    {
      indexBrandInput: {
        name: brandsQuery
      }
    }
  )
  const tableProps: ITableProps<Product, typeof ProductInputSchema> = useTable({
    model: {
      name: "products",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: ProductModalEnum.INFO
            }),
          text: t("common:add_entity", { entity: t("common:product") }),
          variant: "primary"
        },
        title
      },
      paginable: true,
      fetch: {
        api: getAllProductsQueryFn
      },
      onRow: {
        url: (row) =>
          `https://vardast.com/product/${row.original.id}/${row.original.name}`
      },
      filters: {
        schema: ProductInputSchema,
        options: [
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "query",
            title: t("common:product_name")
          },
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "sku",
            title: t("common:product_sku")
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "categoryIds",
            title: t("common:category"),
            options: categories?.data?.allCategoriesV2?.map((item) => ({
              key: item.title,
              value: `${item.id}`
            })),
            loading: categories.isLoading,
            setSearch: setCategoryQuery
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "brandId",
            title: t("common:producer"),
            options: brands?.data?.brandsWithoutPagination?.map((item) => ({
              key: item.name,
              value: `${item.id}`
            })),
            loading: brands.isLoading,
            setSearch: setBrandsQuery
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "hasPrice",
            title: t("common:price_list"),
            options: productPriceOptions.map((item) => ({
              key: item.status,
              value: `${item.value.toUpperCase()}`
            }))
          },
          {
            type: FilterComponentTypeEnum.TOGGLE,
            name: "isActive",
            title: t("common:entity_status", {
              entity: t("common:product")
            }),
            optionsTitle: {
              true: VisibilityFa[HasEntityEnum.TRUE]?.name_fa,
              false: VisibilityFa[HasEntityEnum.FALSE]?.name_fa
            }
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "hasImage",
            title: "تصویر محصول",
            options: imageExistence.map((item) => ({
              key: item.status,
              value: `${item.value}`
            }))
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "orderBy",
            title: t("common:sorting"),
            options: productsSort.map((item) => ({
              key: item.status,
              value: `${item.value.toUpperCase()}`
            }))
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
                  alt={row.original.name}
                  fill
                  sizes="5vw"
                  src={
                    row.original.images.at(0)?.file.presignedUrl.url ??
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
          id: "category",
          header: t("common:category"),
          accessorFn: (item) => item.category.title
        },
        {
          id: "brand",
          header: t("common:brand"),
          accessorFn: (item) => item.brand.name
        },
        {
          id: "seller-count",
          header: t("common:entity_count", { entity: t("common:sellers") }),
          accessorFn: (item) => digitsEnToFa(item.offersNum)
        },
        {
          id: "views",
          header: t("common:entity_count", { entity: t("common:views") }),
          accessorFn: (item) => digitsEnToFa(item.views)
        },
        {
          id: "price",
          header: `${t("common:price")} (${t("common:toman")})`,
          cell: ({ row }) => {
            return (
              <div className="flex flex-col items-end gap-1">
                {row?.original?.highestPrice?.amount && (
                  <Badge variant="success">
                    {digitsEnToFa(
                      addCommas(`${row.original?.highestPrice?.amount}`)
                    )}
                  </Badge>
                )}
                {row?.original?.lowestPrice?.amount && (
                  <Badge variant="danger">
                    {digitsEnToFa(
                      addCommas(`${row.original.lowestPrice?.amount}`)
                    )}
                  </Badge>
                )}
              </div>
            )
          }
        },
        {
          id: "last-updated",
          header: t("common:updated"),
          accessorFn: (item) =>
            item.updatedAt ? convertToPersianDate(item.updatedAt) : "--"
        },
        {
          id: "status",
          header: t("common:status"),
          cell: ({ row }) => (
            <Badge variant={row?.original?.isActive ? "success" : "danger"}>
              {row.original.isActive
                ? t("common:active")
                : t("common:inactive")}
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
                    type: ProductModalEnum.DELETE
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
    dependencies: [categoryQuery, brandsQuery, categories.data, brands.data]
  })

  return (
    <>
      <ProductDeleteModal
        modals={modals}
        open={modals?.type === ProductModalEnum.DELETE}
        onChangeModals={onChangeModals}
        onCloseModals={onCloseModals}
      />
      <Table {...tableProps} />
    </>
  )
}

export default Products
