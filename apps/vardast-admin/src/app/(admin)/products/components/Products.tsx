"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import Pagination from "@vardast/component/Pagination"
import {
  ProductImageStatusEnum,
  ProductPriceStatusEnum,
  useGetAllProductsQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Button } from "@vardast/ui/button"
import { checkBooleanByString } from "@vardast/util/checkBooleanByString"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import { LucidePlus } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { ProductsFilter } from "@/app/(admin)/products/components/ProductsFilter"

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="product" />,
  [ApiCallStatusEnum.DEFAULT]: null
}
const getContentByApiStatus = (
  apiQuery: UseQueryResult<any, unknown>,
  queryLength: boolean
) => {
  if (apiQuery.isLoading) {
    return ApiCallStatusEnum.LOADING
  }
  if (apiQuery.isError) {
    return ApiCallStatusEnum.ERROR
  }
  if (!queryLength || !apiQuery.data) {
    return ApiCallStatusEnum.EMPTY
  }
  return ApiCallStatusEnum.DEFAULT
}
const FilterSchema = z.object({
  query: z.string().optional(),
  categoryIds: z.array(z.number()).optional(),
  brandId: z.number().optional(),
  isActive: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  hasPrice: z.string().nullable().optional(),
  hasDescription: z.string().nullable().optional(),
  hasImage: z.string().nullable().optional()
})
export type FilterFields = TypeOf<typeof FilterSchema>

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
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [productQueryParams, setProductQueryParams] =
    useState<ProductQueryParams>({
      query: "",
      categoryIds: [],
      brandId: null,
      isActive: "",
      sku: null,
      hasPrice: null,
      hasImage: null
    })
  const form = useForm<FilterFields>({
    resolver: zodResolver(FilterSchema)
    // defaultValues: {
    //   categoryIds: [],
    //   isActive: "",
    //   hasPrice: "",
    //   hasDescription: ""
    // }
  })

  const data = useGetAllProductsQuery(
    graphqlRequestClientWithToken,
    {
      indexProductInput: {
        page: currentPage,
        brandId: productQueryParams.brandId,
        query: productQueryParams.query,
        categoryIds: productQueryParams.categoryIds,
        isActive: checkBooleanByString(productQueryParams.isActive as string),
        sku: productQueryParams.sku,
        hasPrice: productQueryParams.hasPrice as ProductPriceStatusEnum,
        hasImage: productQueryParams.hasImage as ProductImageStatusEnum
      }
    },
    {
      queryKey: [
        {
          page: currentPage,
          brandId: productQueryParams.brandId,
          query: productQueryParams.query,
          categoryIds: productQueryParams.categoryIds,
          isActive: checkBooleanByString(productQueryParams.isActive as string),
          sku: productQueryParams.sku,
          hasPrice: productQueryParams.hasPrice as ProductPriceStatusEnum,
          hasImage: productQueryParams.hasImage as ProductImageStatusEnum
        }
      ]
    }
  )

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })
  const productsLength = useMemo(
    () => data.data?.products.data.length,
    [data.data?.products.data.length]
  )
  // if (data) {
  //   console.log(data.data?.products.data.map((item) => item?.))
  // }
  return (
    <>
      <ProductsFilter
        form={form}
        setProductQueryParams={setProductQueryParams}
      />
      <Card className="table-responsive mt-8 rounded">
        <PageHeader
          title={t("common:entity_list", { entity: t("common:product") })}
          titleClasses="text-[14px] font-normal "
          containerClass="items-center"
          titleContainerClasses="border-b-2 border-primary-600 py-2"
        >
          {session?.abilities.includes("gql.products.product.index") && (
            <Link href="/products/new">
              <Button size="medium">
                <LucidePlus size="14.4" />
                افزودن کالای جدید
              </Button>
            </Link>
          )}
        </PageHeader>
        {renderedListStatus[getContentByApiStatus(data, !!productsLength)] || (
          <>
            <table className="table-hover table border-t-0">
              <thead>
                <tr>
                  <th></th>
                  <th>{t("common:product")}</th>
                  <th>{t("common:category")}</th>
                  <th>{t("common:brand")}</th>
                  <th>
                    {t("common:entity_count", { entity: t("common:sellers") })}
                  </th>
                  <th>
                    {t("common:entity_count", { entity: t("common:views") })}
                  </th>
                  <th>{t("common:price")}</th>
                  <th>{t("common:stock")}</th>
                  <th>{t("common:updated")}</th>
                  <th>{t("common:status")}</th>
                  <th>{t("common:operation")}</th>
                </tr>
              </thead>
              <tbody className="overflow-x-auto border-0.5 ">
                {data?.data?.products.data.map(
                  (product) =>
                    product && (
                      <tr key={product.id}>
                        <td>
                          <div className="relative aspect-square h-12 w-12 overflow-hidden rounded">
                            <Image
                              src={
                                (product.images.at(0)?.file.presignedUrl
                                  .url as string) ?? "/images/seller-blank.png"
                              }
                              alt={product.name}
                              sizes="5vw"
                              fill
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1.5">
                            <Link
                              target="_blank"
                              href={`
                               https://vardast.com/product/${product.id}/${product.name}
                            `}
                              className="font-medium text-alpha-800"
                            >
                              {product.name}
                            </Link>
                            {product.techNum && (
                              <span className="text-xs text-alpha-600">
                                کد کالا: {product.techNum}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <Link
                            target="_blank"
                            href={`
                             https://vardast.com/category/${product.category.id}/${product.category.title}
                          `}
                          >
                            {product.category.title}
                          </Link>
                        </td>
                        <td>
                          <Link
                            target="_blank"
                            href={`
                            https://vardast.com/brand/${product.brand.id}/${product.brand.name}
                          `}
                          >
                            {product.brand.name}
                          </Link>
                        </td>
                        <td>-</td>
                        <td>{digitsEnToFa(product.views)}</td>
                        <td>
                          <div className="flex flex-col">
                            <div className="text-success-600">
                              {product.highestPrice ? (
                                <>
                                  <span className="font-medium ">
                                    {digitsEnToFa(
                                      addCommas(
                                        `${product.highestPrice?.amount}`
                                      )
                                    )}
                                  </span>
                                  <span className="text-xs"> تومان</span>
                                </>
                              ) : (
                                "--"
                              )}
                            </div>
                            <div className=" text-error-600">
                              {product.lowestPrice ? (
                                <>
                                  <span className="font-medium">
                                    {digitsEnToFa(
                                      addCommas(
                                        `${product.lowestPrice?.amount}`
                                      )
                                    )}
                                  </span>
                                  <span className="text-xs"> تومان</span>
                                </>
                              ) : (
                                "--"
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>--</span>
                        </td>
                        <td>
                          <span>-</span>
                        </td>
                        <td>
                          {product.isActive ? (
                            <span className="tag tag-dot tag-sm tag-success">
                              {t("common:active")}
                            </span>
                          ) : (
                            <span className="tag tag-dot tag-sm tag-danger">
                              {t("common:inactive")}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              target="_blank"
                              href={`/products/${product.id}`}
                            >
                              <span className="tag cursor-pointer text-blue-500">
                                {t("common:edit")}
                              </span>
                            </Link>
                            <span
                              className="tag cursor-pointer text-error"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              {t("common:delete")}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>

            <Pagination
              total={data?.data?.products.lastPage ?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </>
        )}
      </Card>
    </>
  )
}

export default Products
