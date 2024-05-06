"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import {
  GetOfferQuery,
  Offer,
  ThreeStateSupervisionStatuses,
  useGetAllOffersQuery
} from "@vardast/graphql/generated"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Button } from "@vardast/ui/button"
import { LucideCheck, LucidePlus, LucideX } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { checkBooleanByString } from "@/app/(admin)/brands/components/Brands"
import Pagination from "@/app/(admin)/components/Pagination"
import OfferDeleteModal from "@/app/(admin)/offers/components/OfferDeleteModal"
import { OffersFilter } from "@/app/(admin)/offers/components/OffersFilter"

export type IGetOffersQueryResult = UseQueryResult<
  GetOfferQuery,
  unknown
> | null
const filterSchema = z.object({
  sellerId: z.number().optional(),
  isPublic: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  isAvailable: z.string().nullable().optional()
})

export type OfferFilterFields = TypeOf<typeof filterSchema>

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="offer" />,
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

export interface OffersQueryParams {
  sellerId: number | null
  isPublic: string | undefined
  status: string | undefined
  isAvailable: string | undefined
}

const Offers = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [offerToDelete, setOfferToDelete] = useState<Offer>()
  const [offersQueryParams, setOffersQueryParams] = useState<OffersQueryParams>(
    {
      sellerId: null,
      isPublic: "",
      status: "",
      isAvailable: ""
    }
  )
  const form = useForm<OfferFilterFields>({
    resolver: zodResolver(filterSchema)
  })

  const queryParams: any = {
    page: currentPage,
    sellerId: offersQueryParams.sellerId,
    isPublic: checkBooleanByString(offersQueryParams.isPublic as string),
    isAvailable: checkBooleanByString(offersQueryParams.isAvailable as string)
  }

  if (offersQueryParams.status) {
    console.log(offersQueryParams.status)

    queryParams.status = offersQueryParams.status
  }

  const data = useGetAllOffersQuery(
    graphqlRequestClientAdmin,
    {
      indexOfferInput: queryParams
    },
    {
      queryKey: [queryParams]
    }
  )

  const offersLength = useMemo(
    () => data.data?.offers.data.length,
    [data.data?.offers.data.length]
  )

  return (
    <>
      <OffersFilter form={form} setOffersQueryParams={setOffersQueryParams} />
      <Card className=" table-responsive mt-8 rounded">
        <PageHeader
          title={t("common:offers_index_title")}
          titleClasses="text-[14px] font-normal "
          containerClass="items-center"
          titleContainerClasses="border-b-2 border-primary-600 py-2"
        >
          {session?.abilities.includes("gql.products.offer.store") && (
            <Link href="/admin/offers/new">
              <Button size="medium">
                <LucidePlus size="14.4" />
                {t("common:add_entity", { entity: t("common:offers") })}
              </Button>
            </Link>
          )}
        </PageHeader>
        <OfferDeleteModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          offerToDelete={offerToDelete as Offer}
        />
        {renderedListStatus[getContentByApiStatus(data, !!offersLength)] || (
          <>
            <table className="table-hover table">
              <thead>
                <tr>
                  <th>{t("common:offer")}</th>
                  <th>{t("common:price")}</th>
                  <th>{t("common:status")}</th>
                  <th>{t("common:visibility")}</th>
                  <th>{t("common:stock")}</th>
                  <th>{t("common:delete")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.offers.data.map(
                  (offer) =>
                    offer && (
                      <tr
                        key={offer.id}
                        onClick={() => router.push(`/admin/offers/${offer.id}`)}
                      >
                        <td>
                          <span className="">
                            <span className="block font-bold">
                              {offer.seller.name}
                            </span>
                            <span className="block">{offer.product.name}</span>
                          </span>
                        </td>
                        <td>
                          {offer.lastPublicConsumerPrice ? (
                            <>
                              <span className="font-medium">
                                {digitsEnToFa(
                                  addCommas(
                                    offer.lastPublicConsumerPrice.amount
                                  )
                                )}
                              </span>{" "}
                              <span className="text-xs">تومان</span>
                            </>
                          ) : (
                            "--"
                          )}
                        </td>
                        <td>
                          {offer.status ===
                            ThreeStateSupervisionStatuses.Pending && (
                            <span className="tag tag-light tag-sm tag-warning">
                              {t("common:pending")}
                            </span>
                          )}
                          {offer.status ===
                            ThreeStateSupervisionStatuses.Confirmed && (
                            <span className="tag tag-light tag-sm tag-success">
                              {t("common:confirmed")}
                            </span>
                          )}
                          {offer.status ===
                            ThreeStateSupervisionStatuses.Rejected && (
                            <span className="tag tag-light tag-sm tag-gray">
                              {t("common:rejected")}
                            </span>
                          )}
                        </td>
                        <td>
                          {offer.isPublic ? (
                            <span className="tag tag-light tag-icon tag-success tag-sm h-8 w-8 rounded-full">
                              <LucideCheck className="icon" />
                            </span>
                          ) : (
                            <span className="tag tag-light tag-icon tag-gray tag-sm h-8 w-8 rounded-full">
                              <LucideX className="icon" />
                            </span>
                          )}
                        </td>
                        <td>
                          {offer.isAvailable ? (
                            <span className="tag tag-light tag-icon tag-success tag-sm h-8 w-8 rounded-full">
                              <LucideCheck className="icon" />
                            </span>
                          ) : (
                            <span className="tag tag-light tag-icon tag-gray tag-sm h-8 w-8 rounded-full">
                              <LucideX className="icon" />
                            </span>
                          )}
                        </td>
                        <td>
                          <Link
                            target="_blank"
                            href={`/admin/offers/${offer.id}`}
                          >
                            <span className="tag cursor-pointer text-blue-500">
                              {" "}
                              {t("common:edit")}
                            </span>
                          </Link>
                          <span
                            className="tag cursor-pointer text-error"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteModalOpen(true)
                              setOfferToDelete(offer as Offer)
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

            <Pagination
              total={data.data?.offers.lastPage as number}
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

export default Offers
