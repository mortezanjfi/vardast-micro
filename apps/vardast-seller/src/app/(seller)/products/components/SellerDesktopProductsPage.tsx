"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import logoHorizontal from "@vardast/asset/logo-horizontal-v2-persian-light-bg.svg"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import Pagination from "@vardast/component/Pagination"
import {
  useCreateOfferMutation,
  useGetAllProductsQuery
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClient from "@vardast/query/queryClients/graphqlRequestClient"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Button } from "@vardast/ui/button"
import { checkSellerRedirectUrl } from "@vardast/util/checkSellerRedirectUrl"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { ProductsFilter } from "@/app/(seller)/products/components/ProductsFilter"

type Props = {}
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

export const SellerDesktopProductsPage = ({}: Props) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loadingBtn, setLoadingBtn] = useState<number>()

  const form = useForm<ProductNameSearchFilter>({
    resolver: zodResolver(filterSchema),
    defaultValues: { query: "" }
  })
  const { data: session } = useSession()

  const data = useGetAllProductsQuery(
    graphqlRequestClient(session),
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

  const createOfferMutation = useCreateOfferMutation(
    graphqlRequestClient(session),
    {
      onError: () => {
        toast({
          description: t("common:entity_added_error", {
            entity: t("common:offer")
          }),
          duration: 2000,
          variant: "danger"
        })
      },
      onSuccess: () => {
        toast({
          description: "کالای شما با موفقیت اضافه شد",
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  const productsLength = useMemo(
    () => data.data?.products.data.length,
    [data.data?.products.data.length]
  )

  return (
    <>
      <ProductsFilter form={form} isMyProductsPage={false} />
      {renderedListStatus[getContentByApiStatus(data, !!productsLength)] || (
        <Card className="table-responsive">
          <div className="flex flex-col gap-7">
            <div className="flex max-h-16 justify-between px-7 py-5">
              <div className="flex gap-1">
                <span className=" text-nowrap">نتایج جستجو در </span>
                <Image
                  src={logoHorizontal}
                  alt={`وردست`}
                  className="w-auto object-contain"
                />
              </div>
              <div className="flex gap-2">
                <span>تعداد نتایج:</span>
                <span className="text-secondary">{`${digitsEnToFa(
                  addCommas(data.data?.products.total as number)
                )} کالا`}</span>
              </div>
            </div>
            <table className="table-hover table">
              <thead>
                <tr>
                  <th>{t("common:title")}</th>
                  <th>{t("common:unit")}</th>
                  <th>{t("common:price")}</th>
                  {/* <th>{t("common:updated")}</th> */}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.data?.products.data.map(
                  (product) =>
                    product && (
                      <tr key={product.id}>
                        <td className="flex gap-2">
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
                          <div className="flex flex-col">
                            <Link
                              prefetch={false}
                              href={checkSellerRedirectUrl(
                                `/product/${product.id}/${product.name}`
                              )}
                              target="_blank"
                            >
                              {product.name}
                            </Link>
                            <span>{product.sku}</span>
                          </div>
                        </td>
                        <td className="w-[159px] border-r-0.5">
                          <div>{product.uom.name}</div>
                        </td>
                        <td className="w-[159px] border-r-0.5">
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
                        {/* <td className="w-[159px] border-r-0.5"></td> */}
                        <td className="w-[159px] border-r-0.5">
                          {" "}
                          <Button
                            variant="secondary"
                            size="xsmall"
                            type="button"
                            loading={
                              loadingBtn === product.id &&
                              createOfferMutation.isLoading
                            }
                            disabled={createOfferMutation.isLoading}
                            onClick={(e) => {
                              e.stopPropagation()
                              e.nativeEvent.preventDefault()
                              e.nativeEvent.stopImmediatePropagation()
                              setLoadingBtn(product.id)
                              createOfferMutation.mutate({
                                createOfferInput: {
                                  isAvailable: true,
                                  isPublic: true,
                                  productId: product.id
                                }
                              })
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
              total={data?.data?.products.lastPage ?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </div>
        </Card>
      )}
    </>
  )
}
