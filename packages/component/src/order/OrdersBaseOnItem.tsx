"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import {
  MultiTypeOrder,
  OrderOfferStatuses,
  PaymentMethodEnum,
  PreOrder,
  useCreatePreOrderMutation,
  useGetOrderLinesQuery
} from "../../../graphql/src/generated"
import axiosApis, { IServePdf } from "../../../query/src/queryClients/axiosApis"
import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"
import { ApiCallStatusEnum } from "../../../type/src/Enums"
import { newTimeConvertor } from "../../../util/src/convertToPersianDate"
import { getContentByApiStatus } from "../../../util/src/GetContentByApiStatus"
import CardContainer from "../desktop/CardContainer"
import Loading from "../Loading"
import LoadingFailed from "../LoadingFailed"
import NoResult from "../NoResult"
import NotFoundMessage from "../NotFound"
import Pagination from "../table/Pagination"
import OrderDeleteModal from "./OrderDeleteModal"

type OrdersBaseOnItemProps = {
  isAdmin?: boolean
  isMobileView?: boolean
  title?: string
}

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

const OrdersBaseOnItem = ({
  isAdmin,
  isMobileView,
  title
}: OrdersBaseOnItemProps) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [orderToDelete, setOrderToDelete] = useState<PreOrder | null>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const router = useRouter()

  const preOrdersQuery = useGetOrderLinesQuery(
    graphqlRequestClientWithToken,
    {
      indexLineInput: { page: currentPage }
    },
    { queryKey: [{ page: currentPage }] }
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

  const downLoadInvoice = async ({ uuid, access_token }: IServePdf) => {
    const response = await axiosApis.getInvoice({ uuid, access_token })
    const html = response.data
    const blob = new Blob([html], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)

    const newTab = window.open(url, "_blank")
    newTab.focus()
  }

  const onCreateOrder = () => {
    createOrderMutation.mutate({
      createPreOrderInput: {}
    })
  }

  const ordersLength = useMemo(
    () => preOrdersQuery?.data?.Orderlines?.data.length,
    [preOrdersQuery?.data?.Orderlines?.data.length]
  )

  return (
    <div className="flex flex-col gap-7">
      <OrderDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        orderToDelete={orderToDelete}
      />

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
            <div className="overflow-x-scroll">
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
                    <th className="border">{t("common:applicant_name")}</th>
                    <th className="border">{t("common:expert_name")}</th>
                    <th className="border">{t("common:order-needed-time")}</th>
                    <th className="border">{t("common:items")}</th>
                    <th className="border">{t("common:amount")}</th>
                    <th className="border">{t("common:unit")}</th>
                    <th className="border">{t("common:type")}</th>
                  </tr>
                </thead>

                <tbody className="border-collapse border">
                  {preOrdersQuery?.data?.Orderlines?.data.map(
                    (line, index) =>
                      line && (
                        <tr
                          className="cursor-pointer hover:bg-alpha-50"
                          onClick={(e) => {
                            e.preventDefault()
                            router.push(`/profile/orders/${line?.id}`)
                          }}
                          key={line?.id}
                        >
                          <td className="w-4 border">
                            <span>{digitsEnToFa(index + 1)}</span>
                          </td>
                          <td className="border">
                            {line?.pre_order_uuid &&
                              digitsEnToFa(line.pre_order_uuid)}
                          </td>
                          <td className="border">{line.project_name}</td>

                          <td className="border">{line?.applicant_name}</td>
                          <td className="border">{line?.expert_name}</td>
                          <td className="border">
                            {line?.need_date
                              ? newTimeConvertor(line.need_date)
                              : "-"}
                          </td>
                          <td>{line?.item_name}</td>
                          <td>{line?.qty && digitsEnToFa(line?.qty)}</td>
                          <td>{line?.uom && digitsEnToFa(line?.uom)}</td>
                          <td className="border">
                            {line?.type === MultiTypeOrder.Product
                              ? "کالا"
                              : line?.type === MultiTypeOrder.Service &&
                                "خدمات"}
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              total={preOrdersQuery?.data?.Orderlines.lastPage ?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </>
        )}
      </CardContainer>
      {preOrdersQuery.isFetching && preOrdersQuery.isLoading ? (
        <div className="flex h-full items-center justify-center pt-6">
          <Loading hideMessage />
        </div>
      ) : (
        <NotFoundMessage text="سفارشی" />
      )}
    </div>
  )
}

export default OrdersBaseOnItem
