"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import {
  FilterComponentTypeEnum,
  ITableProps,
  Table,
  useTable
} from "@vardast/component/table"
import { ProductModalEnum } from "@vardast/component/type"
import {
  Product,
  useGetAllBrandsWithoutPaginationQuery,
  useGetAllCategoriesV2Query
} from "@vardast/graphql/generated"
import {
  imageExistence,
  productPriceOptions
} from "@vardast/lib/AvailabilityStatus"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/products/getAllProductsQueryFn"
import { useModals } from "@vardast/ui/modal"
import { checkBooleanByString } from "@vardast/util/checkBooleanByString"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"
import { TypeOf, z } from "zod"

import ProductDeleteModal from "@/app/(admin)/products/components/ProductDeleteModal"

const ProductsFilterSchema = z.object({
  query: z.string().optional(),
  categoryIds: z.string().optional(),
  brandId: z.string().optional(),
  isActive: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  hasPrice: z.string().nullable().optional(),
  // hasDescription: z.string().nullable().optional(),
  hasImage: z.string().nullable().optional()
})
export type FilterFields = TypeOf<typeof ProductsFilterSchema>

export interface ProductQueryParams {
  query: string | undefined
  categoryIds: number[] | undefined // Assuming categoryIds is an array of numbers
  brandId: number | null
  isActive: string | undefined // Assuming isActive is always a string
  sku: string | null // Assuming sku can be a string or null
  hasPrice: string | null
  hasImage: string | null
}

const Products = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [categoryQuery, setCategoryQuery] = useState("")
  const [brandsQuery, setBrandsQuery] = useState("")
  const [modals, onChangeModals, onCloseModals] = useModals<ProductModalEnum>()

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const statusesOfActivation = [
    { status: "فعال", value: "true" },
    {
      status: "غیرفعال",
      value: "false"
    }
  ]
  const onAddProduct = () => {
    router.push("/products/new")
  }

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
  const tableProps: ITableProps<Product, typeof ProductsFilterSchema> =
    useTable({
      model: {
        name: "products",
        container: {
          button: {
            onClick: onAddProduct,
            text: "افزودن کالای جدید",
            variant: "primary"
          },
          title: t("common:entity_list", { entity: t("common:product") })
        },
        paginable: true,
        fetch: {
          api(args) {
            return getAllProductsQueryFn({
              query: args.query,
              brandId: args.brandId,
              sku: args.sku,
              categoryIds: args.categoryIds && [+args.categoryIds],
              hasPrice: args.hasPrice,
              isActive: args.isActive && checkBooleanByString(args.isActive),
              hasImage: args.hasImage
            })
          }
        },
        onRow: {
          url: (row) =>
            `https://vardast.com/product/${row.original.id}/${row.original.name}`
        },
        filters: {
          schema: ProductsFilterSchema,
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
            // {
            //   type: FilterComponentTypeEnum.SELECT,
            //   name: "hasDescription",
            //   title: "معرفی برند",
            //   options: statusesOfAvailability.map((item) => ({
            //     key: item.status,
            //     value: `${item.value.toUpperCase()}`
            //   }))
            // },
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
              type: FilterComponentTypeEnum.SELECT,
              name: "isActive",
              title: t("common:entity_status", {
                entity: t("common:product")
              }),
              options: statusesOfActivation.map((item) => ({
                key: item.status,
                value: `${item.value.toUpperCase()}`
              }))
            },
            {
              type: FilterComponentTypeEnum.SELECT,
              name: "hasImage",
              title: "تصویر محصول",
              options: imageExistence.map((item) => ({
                key: item.status,
                value: `${item.value}`
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
                    src={
                      (row.original.images.at(0)?.file.presignedUrl
                        .url as string) ?? "/images/seller-blank.png"
                    }
                    alt={row.original.name}
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
            header: t("common:price"),
            cell: ({ row }) => {
              return (
                <div className="flex flex-col">
                  <div className="text-success-600">
                    {row.original.highestPrice ? (
                      <>
                        <span className="font-medium ">
                          {digitsEnToFa(
                            addCommas(`${row.original.highestPrice?.amount}`)
                          )}
                        </span>
                        <span className="text-xs"> تومان</span>
                      </>
                    ) : (
                      "--"
                    )}
                  </div>
                  <div className=" text-error-600">
                    {row.original.lowestPrice ? (
                      <>
                        <span className="font-medium">
                          {digitsEnToFa(
                            addCommas(`${row.original.lowestPrice?.amount}`)
                          )}
                        </span>
                        <span className="text-xs"> تومان</span>
                      </>
                    ) : (
                      "--"
                    )}
                  </div>
                </div>
              )
            }
          },
          { id: "stock", header: t("common:stock"), accessorKey: "--" },
          {
            id: "last-updated",
            header: t("common:updated"),
            accessorFn: (item) =>
              item.updatedAt ? convertToPersianDate(item.updatedAt) : "--"
          },
          {
            id: "status",
            header: t("common:status"),
            cell: ({ row }) => {
              return (
                <>
                  {row.original.isActive ? (
                    <span className="tag tag-dot tag-sm tag-success">
                      {t("common:active")}
                    </span>
                  ) : (
                    <span className="tag tag-dot tag-sm tag-danger">
                      {t("common:inactive")}
                    </span>
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
                  <Link
                    target="_blank"
                    href={`/products/${row.original.id}/${row.original.name}`}
                  >
                    <span className="tag cursor-pointer text-blue-500">
                      {t("common:edit")}
                    </span>
                  </Link>
                  <span
                    className="tag cursor-pointer text-error"
                    onClick={() => {
                      onChangeModals({
                        data: row.original,
                        type: ProductModalEnum.DELETE
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
      dependencies: [categoryQuery, brandsQuery, categories.data, brands.data]
    })

  return (
    <>
      <ProductDeleteModal
        onChangeModals={onChangeModals}
        onCloseModals={onCloseModals}
        modals={modals}
        open={modals?.type === ProductModalEnum.DELETE}
      />
      <Table {...tableProps} />
    </>
  )
}

export default Products
