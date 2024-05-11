"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseQueryResult } from "@tanstack/react-query"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import {
  ThreeStateSupervisionStatuses,
  useGetAllSellersQuery
} from "@vardast/graphql/generated"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Button } from "@vardast/ui/button"
import { LucidePlus, LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import Pagination from "@/app/(admin)/components/Pagination"
import { SellersFilter } from "@/app/(admin)/sellers/components/SellersFilter"

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="seller" />,
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
const filterSchema = z.object({
  name: z.string().optional(),
  brandId: z.number().optional(),
  hasLogo: z.string().nullable().optional()
})
export type SellersFilterFields = TypeOf<typeof filterSchema>
export interface SellersQueryParams {
  name: string | undefined
}
const Sellers = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState<number>(1)
  //state for gathering form field information then set to query key
  const [sellersQueryParams, setSellersQueryParams] =
    useState<SellersQueryParams>({ name: "" })

  const form = useForm<SellersFilterFields>({
    resolver: zodResolver(filterSchema),
    defaultValues: { hasLogo: "" }
  })
  const data = useGetAllSellersQuery(
    graphqlRequestClientAdmin,
    {
      indexSellerInput: {
        page: currentPage,
        name: sellersQueryParams.name
      }
    },
    {
      queryKey: [
        {
          page: currentPage,
          name: sellersQueryParams.name
        }
      ]
    }
  )

  const sellerLength = useMemo(
    () => data.data?.sellers.data.length,
    [data.data?.sellers.data.length]
  )
  if (!data) notFound()

  return (
    <>
      <SellersFilter
        form={form}
        setSellersQueryParams={setSellersQueryParams}
        sellersQueryParams={sellersQueryParams}
      />
      <Card className="table-responsive mt-8 rounded">
        <PageHeader
          title="لیست فروشندگان"
          titleClasses="text-[14px] font-normal "
          containerClass="items-center"
          titleContainerClasses="border-b-2 border-primary-600 py-2"
        >
          {session?.abilities.includes("gql.products.seller.store") && (
            <Link href="/sellers/new">
              <Button size="medium">
                <LucidePlus size="14.4" />

                {t("common:add_entity", {
                  entity: t("common:seller")
                })}
              </Button>
            </Link>
          )}
        </PageHeader>
        {renderedListStatus[getContentByApiStatus(data, !!sellerLength)] || (
          <>
            <table className="table-hover table">
              <thead>
                <tr>
                  {/* <th></th> */}
                  <th>{t("common:seller")}</th>
                  <th>{t("common:producer")}</th>
                  <th>{t("common:status")}</th>
                  <th>{t("common:operation")}</th>
                </tr>
              </thead>
              <tbody className="border-0.5 border-t-0">
                {data?.data?.sellers.data.map(
                  (seller) =>
                    seller && (
                      <tr key={seller.id}>
                        <td className="flex gap-3 border-r-0.5">
                          <div className="relative flex aspect-square h-12 w-12 items-center justify-center overflow-hidden rounded bg-alpha-50">
                            {seller.logoFile ? (
                              <Image
                                src={seller.logoFile.presignedUrl.url}
                                alt={seller.name}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <LucideWarehouse
                                className="h-5 w-5 text-alpha-400"
                                strokeWidth={1.5}
                              />
                            )}
                          </div>
                          <span className="font-medium text-alpha-800">
                            {seller.name}
                          </span>
                        </td>
                        <td className="w-96 border-r-0.5">
                          {seller.brands && seller.brands.length > 0 ? (
                            seller.brands.length > 2 ? (
                              <>
                                {seller.brands.slice(0, 2).map((brand) => (
                                  <span
                                    className="tag tag-gray m-1"
                                    key={brand?.id}
                                  >
                                    {brand?.name}
                                  </span>
                                ))}
                                <span>...</span>
                              </>
                            ) : (
                              seller.brands.map((brand) => (
                                <span
                                  className="tag tag-gray m-1"
                                  key={brand?.id}
                                >
                                  {brand?.name}
                                </span>
                              ))
                            )
                          ) : (
                            <span>-</span>
                          )}
                        </td>

                        <td className=" w-96 border-r-0.5">
                          {seller.status ===
                            ThreeStateSupervisionStatuses.Pending && (
                            <span className="tag tag-light tag-sm tag-warning">
                              {t("common:pending")}
                            </span>
                          )}
                          {seller.status ===
                            ThreeStateSupervisionStatuses.Confirmed && (
                            <span className="tag tag-light tag-sm tag-success">
                              {t("common:confirmed")}
                            </span>
                          )}
                          {seller.status ===
                            ThreeStateSupervisionStatuses.Rejected && (
                            <span className="tag tag-light tag-sm tag-gray">
                              {t("common:rejected")}
                            </span>
                          )}
                        </td>
                        <td className="w-[159px] border-r-0.5">
                          <div className="flex gap-2">
                            {" "}
                            <Link
                              target="_blank"
                              href={`/sellers/${seller.id}`}
                            >
                              <span className="tag cursor-pointer text-blue-500">
                                {" "}
                                {t("common:edit")}
                              </span>
                            </Link>
                            <span
                              className="tag cursor-pointer text-error"
                              // onClick={(e) => {
                              //   e.stopPropagation()
                              //   setDeleteModalOpen(true)
                              //   setBrandToDelete(brand as Brand)
                              // }}
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
              total={data?.data?.sellers?.lastPage ?? 0}
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

export default Sellers
