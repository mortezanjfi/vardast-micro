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
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { ApiCallStatusEnum } from "../../../type/src/Enums"
import { checkBooleanByString } from "../../../util/src/checkBooleanByString"
import { getContentByApiStatus } from "../../../util/src/GetContentByApiStatus"
import CardContainer from "../desktop/CardContainer"
import OrderCard, { PreOrderStatesFa } from "../desktop/OrderCart"
import Link from "../Link"
import Loading from "../Loading"
import LoadingFailed from "../LoadingFailed"
import NoResult from "../NoResult"
import NotFoundMessage from "../NotFound"
import Pagination from "../table/Pagination"
import OrderDeleteModal from "./OrderDeleteModal"
import { OrdersFilter } from "./OrdersFilter"

type OrdersPageProps = {
  isAdmin?: boolean
  isMobileView?: boolean
  title: string
}
export const OrdersFilterSchema = z.object({
  status: z.string().optional(),
  hasFile: z.string().optional(),
  projectName: z.string().optional(),
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

const OrdersPage = ({ isAdmin, isMobileView, title }: OrdersPageProps) => {
  const { t } = useTranslation()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [orderToDelete, setOrderToDelete] = useState<PreOrder | null>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const router = useRouter()
  const [ordersQueryParams, setOrdersQueryParams] = useState<OrdersFilterType>(
    {}
  )

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
        projectName: ordersQueryParams.projectName,
        hasFile: checkBooleanByString(ordersQueryParams.hasFile)
      }
    },
    {
      queryKey: [
        {
          page: currentPage,
          customerName: ordersQueryParams.customerName,
          status: ordersQueryParams.status as PreOrderStates,
          projectName: ordersQueryParams.projectName,
          hasFile: checkBooleanByString(ordersQueryParams.hasFile)
        }
      ]
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
      {isAdmin && (
        <OrdersFilter setOrdersQueryParams={setOrdersQueryParams} form={form} />
      )}
      <OrderDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        orderToDelete={orderToDelete}
      />
      {/* {!isMobileView && !isAdmin && <PageTitle title={title} />}
      {!isMobileView && !isAdmin && (
        <PageHeader
          pageHeaderClasses="border-b py-5 !mb-0"
          title={"سفارش خود را ثبت کنید و بهترین قیمت را از وردست بخواهید."}
          titleClasses="text-[14px] font-normal"
          containerClass="items-center"
        >
          <Button
            disabled={createOrderMutation.isLoading || preOrdersQuery.isLoading}
            loading={createOrderMutation.isLoading}
            onClick={onCreateOrder}
            variant="primary"
            size="medium"
          >
            {t("common:add_new_entity", {
              entity: t("common:order")
            })}
          </Button>
        </PageHeader>
      )} */}
      {!isMobileView ? (
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
                    <th className="border">{t("common:purchaser-name")}</th>
                    <th className="border">
                      {t("common:entity_name", {
                        entity: t("common:project")
                      })}
                    </th>
                    <th className="border">{t("common:submition-time")}</th>
                    <th className="border">{t("common:order-expire-time")}</th>
                    <th className="border">{t("common:file")}</th>
                    <th className="border">{t("common:status")}</th>
                    <th className="border">{t("common:person-in-charge")}</th>
                    <th className="border">{t("common:operation")}</th>
                  </tr>
                </thead>

                <tbody className="border-collapse border">
                  {preOrdersQuery?.data?.preOrders?.data?.map(
                    (preOrder, index) =>
                      preOrder && (
                        <tr key={preOrder?.id}>
                          <td className="w-4 border">
                            <span>{digitsEnToFa(index + 1)}</span>
                          </td>
                          <td className="border">
                            {digitsEnToFa(preOrder?.uuid)}
                          </td>
                          <td className="border">{preOrder?.user?.fullName}</td>
                          <td className="border">{preOrder?.project?.name}</td>
                          <td className="border">
                            {digitsEnToFa(
                              new Date(
                                preOrder?.request_date
                              ).toLocaleDateString("fa-IR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                              })
                            )}
                          </td>
                          <td className="border">
                            {digitsEnToFa(
                              new Date(
                                preOrder?.expire_time
                              ).toLocaleDateString("fa-IR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                              })
                            )}
                          </td>
                          <td className="border">
                            {preOrder?.files.length > 0 ? (
                              <span className="tag  tag-sm tag-success">
                                {t("common:has")}
                              </span>
                            ) : (
                              <span className="tag tag-sm tag-danger">
                                {t("common:has_not")}
                              </span>
                            )}
                          </td>
                          <td className="border">
                            <span
                              className={clsx(
                                "tag",
                                PreOrderStatesFa[preOrder?.status]?.className
                              )}
                            >
                              {
                                PreOrderStatesFa[preOrder?.status]
                                  ?.name_fa_admin
                              }
                            </span>
                          </td>
                          <td className="border">
                            {preOrder?.pickUpUser?.fullName}
                          </td>
                          <td className="border">
                            {preOrder.status !== PreOrderStates.Closed && (
                              <>
                                <Link
                                  href={`/profile/orders/${preOrder?.id}/info`}
                                >
                                  <span className="tag cursor-pointer text-blue-500">
                                    {t("common:edit")}
                                  </span>
                                </Link>
                                /
                              </>
                            )}
                            <Link
                              href={`/profile/orders/${preOrder?.id}/offers`}
                            >
                              <span className="tag cursor-pointer text-error">
                                {t("common:offers")}
                              </span>
                            </Link>
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
      ) : preOrdersQuery.isFetching && preOrdersQuery.isLoading ? (
        <div className="flex h-full items-center justify-center pt-6">
          <Loading hideMessage />
        </div>
      ) : preOrdersQuery.data?.preOrders?.data.length > 0 ? (
        <>
          {preOrdersQuery?.data?.preOrders?.data.map((preOrder, index) => (
            <OrderCard
              key={index}
              preOrder={preOrder as PreOrder}
              setOrderToDelete={setOrderToDelete}
              setDeleteModalOpen={setDeleteModalOpen}
            />
          ))}
          {preOrdersQuery?.data?.preOrders?.lastPage > 1 && (
            <Pagination
              total={preOrdersQuery?.data?.preOrders?.lastPage ?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          )}
          {isMobileView && (
            <div className="absolute bottom-0 w-full border-y border-alpha-200 bg-alpha-white px-6 py-5">
              <Button
                disabled={
                  createOrderMutation.isLoading || preOrdersQuery.isLoading
                }
                loading={createOrderMutation.isLoading}
                onClick={onCreateOrder}
                variant="primary"
                size="medium"
                className=" mt-auto w-full py-3"
              >
                {t("common:addOrderInfo")}
              </Button>
            </div>
          )}
        </>
      ) : (
        <NotFoundMessage text="سفارشی" />
      )}
      {isMobileView && (
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] flex w-full justify-end md:relative md:bottom-0">
          <Button onClick={onCreateOrder} className="w-full" variant="primary">
            افزودن سفارش
          </Button>
        </div>
      )}
    </div>
  )
}

export default OrdersPage
