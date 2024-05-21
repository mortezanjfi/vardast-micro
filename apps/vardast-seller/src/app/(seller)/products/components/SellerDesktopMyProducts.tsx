"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import Card from "@vardast/component/Card"
import { ProductsFilter } from "@vardast/component/desktop/ProductsFilter"
import RemoveProductModal from "@vardast/component/desktop/RemoveProductModal"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NotFoundMessage from "@vardast/component/NotFound"
import {
  GetMyProfileSellerQuery,
  Product,
  ThreeStateSupervisionStatuses,
  useRemoveOfferMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/src/use-toast"
import { getMyProfileSellerQueryFns } from "@vardast/query/queryFns/getMyProfileSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import graphqlRequestClientWithToken from "@vardast/query/src/queryClients/graphqlRequestClientWithToken"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { checkSellerRedirectUrl } from "@vardast/util/checkSellerRedirectUrl"
import { ClientError } from "graphql-request"
import { Session } from "next-auth"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import CreatePriceModal from "@/app/(seller)/products/components/CreatePriceModal"

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NotFoundMessage />,
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

type SellerDesktopMyProductsProps = { session: Session | null }
const filterSchema = z.object({ query: z.string() })

export type ProductNameSearchFilter = TypeOf<typeof filterSchema>

export const SellerDesktopMyProducts = ({
  session
}: SellerDesktopMyProductsProps) => {
  const { t } = useTranslation()

  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<Product>()
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<Product>()
  const [createPriceModalOpen, setCreatePriceModalOpen] =
    useState<boolean>(false)
  const [removeProductModalOpen, setRemoveProductModalOpen] =
    useState<boolean>(false)
  const form = useForm<ProductNameSearchFilter>({
    resolver: zodResolver(filterSchema),
    defaultValues: { query: "" }
  })

  const allProductsQuery = useQuery<GetMyProfileSellerQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER,
      { name: form.getValues("query") }
    ],
    () =>
      getMyProfileSellerQueryFns({
        accessToken: session?.accessToken,
        name: form.watch("query")
      }),
    {
      refetchOnMount: "always"
    }
  )

  const productsLength = useMemo(
    () => allProductsQuery.data?.myProfileSeller.myProduct.length,
    [allProductsQuery.data?.myProfileSeller.myProduct.length]
  )

  const queryClient = useQueryClient()

  const sellerRemoveOfferMutation = useRemoveOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        toast({
          description: (
            errors?.response?.errors?.at(0)?.extensions
              ?.displayErrors as string[]
          )?.map((error) => error),
          duration: 2000,
          variant: "danger"
        })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER]
        })
        setRemoveProductModalOpen(false)
        toast({
          description: "کالا با موفقیت از لیست کالاهای شما حذف شد",
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  return (
    <>
      <RemoveProductModal
        sellerRemoveOfferMutation={sellerRemoveOfferMutation}
        productToDelet={selectedProductForDelete as Product}
        open={removeProductModalOpen}
        onOpenChange={setRemoveProductModalOpen}
      />

      <CreatePriceModal
        open={createPriceModalOpen}
        onOpenChange={setCreatePriceModalOpen}
        product={selectedProductForEdit as Product}
      />

      <ProductsFilter form={form} isMyProductsPage={true} />
      {renderedListStatus[
        getContentByApiStatus(allProductsQuery, !!productsLength)
      ] || (
        <Card className="table-responsive">
          <div className="flex flex-col gap-7">
            <table className="table-hover table">
              <thead>
                {" "}
                <tr>
                  <th>{t("common:title")}</th>
                  <th>{t("common:price")}</th>
                  <th>{t("common:status")}</th>
                  <th>{t("common:my_price")}</th>
                  <th>{t("common:discount_percent")}</th>
                  <th>{t("common:operation")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allProductsQuery.data?.myProfileSeller.myProduct.map(
                  (product) =>
                    product && (
                      <tr key={product.id}>
                        <td className="flex gap-2">
                          <div className="relative aspect-square h-12 w-12 overflow-hidden rounded">
                            <Image
                              src={
                                (product.product.images.at(0)?.file.presignedUrl
                                  .url as string) ?? "/images/seller-blank.png"
                              }
                              alt={product.product.name}
                              sizes="5vw"
                              fill
                            />
                          </div>
                          <div className="flex flex-col">
                            <Link
                              prefetch={false}
                              href={checkSellerRedirectUrl(
                                `/product/${product.product.id}/${product.product.name}`
                              )}
                              target="_blank"
                            >
                              {product.product.name}
                            </Link>
                            <span>{product.product.sku}</span>
                          </div>
                        </td>
                        <td className="w-[159px] border-r-0.5">
                          <div className="flex flex-col">
                            <div className="text-success-600">
                              {product.product.highestPrice ? (
                                <>
                                  <span className="font-medium ">
                                    {digitsEnToFa(
                                      addCommas(
                                        `${product.product.highestPrice?.amount}`
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
                              {product.product.lowestPrice ? (
                                <>
                                  <span className="font-medium">
                                    {digitsEnToFa(
                                      addCommas(
                                        `${product.product.lowestPrice?.amount}`
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
                        <td className="border-r-0.5">
                          {product.product.status ===
                            ThreeStateSupervisionStatuses.Confirmed && (
                            <span className="">{t("common:confirmed")}</span>
                          )}
                          {product.product.status ===
                            ThreeStateSupervisionStatuses.Pending && (
                            <span className="">{t("common:pending")}</span>
                          )}
                          {product.product.status ===
                            ThreeStateSupervisionStatuses.Rejected && (
                            <span className="">{t("common:rejected")}</span>
                          )}
                        </td>
                        <td className="border-r-0.5">
                          {product.product.myPrice ? (
                            <span>
                              {digitsEnToFa(
                                addCommas(product.product.myPrice.amount)
                              )}
                            </span>
                          ) : (
                            "_"
                          )}
                        </td>
                        <td className="border-r-0.5">
                          {product.lastPublicConsumerPrice?.discount?.[0]
                            ?.value ? (
                            <span>
                              {
                                product.lastPublicConsumerPrice.discount?.[0]
                                  ?.value
                              }{" "}
                              &nbsp; %
                            </span>
                          ) : (
                            <span>_</span>
                          )}
                        </td>
                        <td className=" border-r-0.5">
                          <span
                            className="tag cursor-pointer text-blue-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.nativeEvent.preventDefault()
                              e.nativeEvent.stopImmediatePropagation()
                              setSelectedProductForEdit(
                                product.product as Product
                              )
                              setCreatePriceModalOpen(true)
                            }}
                          >
                            {product.lastPublicConsumerPrice?.amount
                              ? t("common:edit")
                              : t("common:add_entity", {
                                  entity: t("common:price")
                                })}
                          </span>

                          <span
                            className="tag cursor-pointer text-error"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.nativeEvent.preventDefault()
                              e.nativeEvent.stopImmediatePropagation()
                              setSelectedProductForDelete(
                                product.product as Product
                              )
                              setRemoveProductModalOpen(true)
                            }}
                          >
                            {t("common:delete")}
                          </span>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
            {/* <Pagination
                total={
                  allProductsQuery.data?.myProfileSeller.myProduct.length ?? 0
                }
                page={currentPage}
                onChange={(page) => {
                  setCurrentPage(page)
                }}
              /> */}
          </div>
        </Card>
      )}
    </>
  )
}
