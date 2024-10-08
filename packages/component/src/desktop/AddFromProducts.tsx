"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import logoHorizontal from "@vardast/asset/logo-horizontal-v2-persian-light-bg.svg"
import {
  CreateOfferInput,
  CreateOfferMutation,
  Exact,
  useGetAllProductsQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Button } from "@vardast/ui/button"
import { checkSellerRedirectUrl } from "@vardast/util/checkSellerRedirectUrl"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { ProductsFilter } from "../desktop/ProductsFilter"
import Link from "../Link"
import Loading from "../Loading"
import LoadingFailed from "../LoadingFailed"
import NoResult from "../NoResult"
import Pagination from "../Pagination"

type Props = {
  isAdmin?: boolean
  sellerCreateOfferMutation?: UseMutationResult<
    CreateOfferMutation,
    unknown,
    Exact<{
      createOfferInput: CreateOfferInput
    }>,
    unknown
  >
  adminCreateOfferMutation?: Function
}
const filterSchema = z.object({ query: z.string() })

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="brand" />,
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

export type ProductNameSearchFilter = TypeOf<typeof filterSchema>

export const AddFromProducts = ({
  isAdmin,
  sellerCreateOfferMutation,
  adminCreateOfferMutation
}: Props) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loadingBtn, setLoadingBtn] = useState<number>()

  const form = useForm<ProductNameSearchFilter>({
    resolver: zodResolver(filterSchema),
    defaultValues: { query: "" }
  })

  const data = useGetAllProductsQuery(
    graphqlRequestClientWithToken,
    {
      indexProductInput: {
        page: currentPage,
        query: form.watch("query")
      }
    },
    {
      queryKey: [
        {
          query: form.watch("query"),
          page: currentPage
        }
      ]
    }
  )

  const productsLength = useMemo(
    () => data.data?.products.data.length,
    [data.data?.products.data.length]
  )

  return (
    <div className="flex flex-col gap">
      <ProductsFilter form={form} isAdmin={isAdmin} isMyProductsPage={false} />
      {renderedListStatus[getContentByApiStatus(data, !!productsLength)] || (
        <div
          className={clsx("table-responsive py-5", !isAdmin && "card rounded ")}
        >
          <div className="flex flex-col gap-7">
            {!isAdmin && (
              <div className="flex max-h-16 justify-between px-7 py-5">
                <div className="flex gap-1">
                  <span className=" text-nowrap">نتایج جستجو در </span>
                  <Image
                    alt={`وردست`}
                    className="w-auto object-contain"
                    src={logoHorizontal}
                  />
                </div>
                <div className="flex gap-2">
                  <span>تعداد نتایج:</span>
                  <span className="text-secondary">{`${digitsEnToFa(
                    addCommas(data.data?.products.total)
                  )} کالا`}</span>
                </div>
              </div>
            )}
            <table
              className={clsx(
                "table-hover table border-collapse border",
                isAdmin && "hide-scrollbar h-72 overflow-y-auto"
              )}
            >
              <thead>
                <tr>
                  <th className="border">{t("common:title")}</th>
                  <th className="border">{t("common:unit")}</th>
                  <th className="border">{t("common:price")}</th>
                  {/* <th>{t("common:updated")}</th> */}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.data?.products.data.map(
                  (product) =>
                    product && (
                      <tr key={product.id}>
                        <td className="flex gap-2 border">
                          <div className="relative aspect-square h-12 w-12 overflow-hidden rounded">
                            <Image
                              alt={product.name}
                              fill
                              sizes="5vw"
                              src={
                                (product.images.at(0)?.file.presignedUrl
                                  .url) ?? "/images/seller-blank.png"
                              }
                            />
                          </div>
                          <div className="flex flex-col">
                            <Link
                              href={checkSellerRedirectUrl(
                                `/product/${product.id}/${product.name}`
                              )}
                              prefetch={false}
                              target="_blank"
                            >
                              {product.name}
                            </Link>
                            <span>{product.sku}</span>
                          </div>
                        </td>
                        <td className="w-[159px] border">
                          <div>{product.uom.name}</div>
                        </td>
                        <td className="w-[159px] border">
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
                        {/* column for updated date */}
                        {/* <td className="w-[159px] border"></td> */}
                        <td className="w-[159px] border">
                          {" "}
                          <Button
                            disabled={
                              !isAdmin
                                ? sellerCreateOfferMutation.isLoading
                                : false
                            }
                            loading={
                              loadingBtn === product.id && !isAdmin
                                ? sellerCreateOfferMutation.isLoading
                                : false
                            }
                            size="xsmall"
                            type="button"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.nativeEvent.preventDefault()
                              e.nativeEvent.stopImmediatePropagation()
                              setLoadingBtn(product.id)

                              {
                                isAdmin
                                  ? adminCreateOfferMutation()
                                  : sellerCreateOfferMutation.mutate({
                                      createOfferInput: {
                                        isAvailable: true,
                                        isPublic: true,
                                        productId: product.id
                                      }
                                    })
                              }
                            }}
                          >
                            {t("common:add_entity", {
                              entity: "به کالاهای من"
                            })}
                          </Button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
            <Pagination
              page={currentPage}
              total={data?.data?.products.lastPage ?? 0}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
