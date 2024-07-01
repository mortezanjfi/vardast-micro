"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import {
  OrderOfferStatuses,
  PaymentMethodEnum,
  PreOrder,
  PreOrderStates,
  useCreatePreOrderMutation,
  useGetAllPreOrdersQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideTrash } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { DateObject } from "react-multi-date-picker"
import { TypeOf, z } from "zod"

import { ApiCallStatusEnum } from "../../../type/src/Enums"
import { checkBooleanByString } from "../../../util/src/checkBooleanByString"
import { getContentByApiStatus } from "../../../util/src/GetContentByApiStatus"
import CardContainer from "../desktop/CardContainer"
import { PreOrderStatesFa } from "../desktop/OrderCart"
import Loading from "../Loading"
import LoadingFailed from "../LoadingFailed"
import NoResult from "../NoResult"
import Pagination from "../table/Pagination"
import OrderDeleteModal from "./OrderDeleteModal"
import { OrdersFilter } from "./OrdersFilter"

type OrdersPageProps = {
  isMobileView?: boolean
  filters?: OrdersFilterType
}

export const OrdersFilterSchema = z.object({
  status: z.string().optional(),
  hasFile: z.string().optional(),
  projectId: z.string().optional(),
  customerName: z.string().optional()
})

export type OrdersFilterType = TypeOf<typeof OrdersFilterSchema>
export const OrderOfferStatusesFa = {
  [OrderOfferStatuses.Closed]: { className: "tag-success", name_fa: "بسته شده" }
}

export const PaymentMethodEnumFa = {
  [PaymentMethodEnum.Cash]: {
    className: "",
    name_fa: "نقدی"
  },
  [PaymentMethodEnum.Credit]: {
    className: "",
    name_fa: "غیر نقدی"
  }
}

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="order" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

const OrdersPage = ({ filters = {} }: OrdersPageProps) => {
  const { t } = useTranslation()
  const [orderToDelete, setOrderToDelete] = useState<PreOrder | null>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const router = useRouter()

  const [ordersQueryParams, setOrdersQueryParams] =
    useState<OrdersFilterType>(filters)

  const form = useForm<OrdersFilterType>({
    resolver: zodResolver(OrdersFilterSchema)
  })

  const preOrdersQuery = useGetAllPreOrdersQuery(
    graphqlRequestClientWithToken,
    {
      indexPreOrderInput: {
        page: currentPage,
        customerName: ordersQueryParams.customerName,
        status: ordersQueryParams.status as PreOrderStates,
        projectId: +ordersQueryParams.projectId,
        hasFile: checkBooleanByString(ordersQueryParams.hasFile)
      }
    },
    {
      queryKey: [
        "GetAllPreOrdersQuery",
        {
          page: currentPage,
          customerName: ordersQueryParams.customerName,
          status: ordersQueryParams.status as PreOrderStates,
          projectId: +ordersQueryParams.projectId,
          hasFile: checkBooleanByString(ordersQueryParams.hasFile)
        }
      ],
      refetchOnMount: "always"
    }
  )

  const createOrderMutation = useCreatePreOrderMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: (data) => {
        if (data.createPreOrder.id) {
          router.push(`/profile/orders/${data.createPreOrder.id}/info`)
        }
      }
    }
  )

  const onCreateOrder = () => {
    createOrderMutation.mutate({
      createPreOrderInput: {}
    })
  }

  const ordersLength = useMemo(
    () => preOrdersQuery?.data?.preOrders?.data?.length,
    [preOrdersQuery?.data?.preOrders?.data?.length]
  )

  return (
    <div className="flex flex-col gap-7">
      <OrderDeleteModal
        open={!!orderToDelete}
        onCloseModal={() => setOrderToDelete(null)}
        orderToDelete={orderToDelete}
      />
      <OrdersFilter setOrdersQueryParams={setOrdersQueryParams} form={form} />
      <CardContainer
        button={{
          disabled: createOrderMutation.isLoading || preOrdersQuery.isLoading,
          loading: createOrderMutation.isLoading,
          onClick: onCreateOrder,
          text: "افزودن سفارش",
          variant: "primary"
        }}
        title="لیست‌ سفارشات"
      >
        {renderedListStatus[
          getContentByApiStatus(preOrdersQuery, !!ordersLength)
        ] || (
          <>
            <table className="table-hover table">
              <thead>
                <tr>
                  <th className="border">{t("common:row")}</th>
                  <th className="border">
                    {t("common:entity_code", { entity: t("common:order") })}
                  </th>
                  <th className="border">
                    {t("common:entity_name", {
                      entity: t("common:project")
                    })}
                  </th>
                  <th>{t("common:category")}</th>
                  <th className="border">{t("common:applicant_name")}</th>
                  <th className="border">{t("common:expert_name")}</th>
                  <th className="border">{t("common:submission-time")}</th>
                  <th className="border">{t("common:order-needed-time")}</th>
                  <th className="border">{t("common:status")}</th>
                  <th className="border">{t("common:operation")}</th>
                </tr>
              </thead>

              <tbody className="border-collapse border">
                {preOrdersQuery?.data?.preOrders?.data?.map(
                  (preOrder, index) =>
                    preOrder && (
                      <tr
                        className="cursor-pointer hover:bg-alpha-50"
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(`/profile/orders/${preOrder?.id}`)
                        }}
                        key={preOrder?.id}
                      >
                        <td className="w-4 border">
                          <span>{digitsEnToFa(index + 1)}</span>
                        </td>
                        <td className="border">
                          {digitsEnToFa(preOrder?.uuid)}
                        </td>
                        <td className="border">{preOrder?.project?.name}</td>
                        <td className="border">{preOrder?.category?.title}</td>
                        <td className="border">{preOrder?.applicant_name}</td>
                        <td className="border">{preOrder?.expert_name}</td>
                        <td className="border">
                          {preOrder?.request_date
                            ? digitsEnToFa(
                                new Date(
                                  preOrder?.request_date
                                ).toLocaleDateString("fa-IR", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "numeric",
                                  minute: "numeric"
                                })
                              )
                            : "-"}
                        </td>
                        <td className="border">
                          {preOrder?.need_date
                            ? digitsEnToFa(
                                new DateObject(new Date(preOrder?.need_date))
                                  .toDate()
                                  .toLocaleDateString("fa-IR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "numeric",
                                    minute: "numeric"
                                  })
                              )
                            : "-"}
                        </td>

                        <td className="border">
                          <span
                            className={clsx(
                              "tag",
                              PreOrderStatesFa[preOrder?.status]?.className
                            )}
                          >
                            {PreOrderStatesFa[preOrder?.status]?.name_fa_admin}
                          </span>
                        </td>
                        <td className="border">
                          <Button
                            variant="danger"
                            iconOnly
                            type="button"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOrderToDelete(preOrder as PreOrder)
                            }}
                          >
                            <LucideTrash className="icon" />
                          </Button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
            <Pagination
              total={preOrdersQuery?.data?.preOrders?.lastPage ?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </>
        )}
      </CardContainer>
    </div>
  )
}

export default OrdersPage
