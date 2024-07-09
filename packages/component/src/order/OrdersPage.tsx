"use client"

import { useMemo } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import {
  OrderOfferStatuses,
  PaymentMethodEnum,
  PreOrder
} from "@vardast/graphql/generated"
import { getAllPreOrdersQueryFn } from "@vardast/query/queryFns/orders/getAllPreOrdersQueryFn"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { DateObject } from "react-multi-date-picker"

import { PreOrderStatesFa } from "../desktop/OrderCart"
import Table from "../table/Table"
import { ITableProps } from "../table/type"
import {
  OrdersFilter,
  OrdersFilterSchema,
  OrdersFilterType
} from "./OrdersFilter"

type OrdersPageProps = {
  isMobileView?: boolean
  filters?: OrdersFilterType
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

const OrdersPage = (_: OrdersPageProps) => {
  const { t } = useTranslation()
  const { data: session } = useSession()

  const tableProps: ITableProps<PreOrder, typeof OrdersFilterSchema> = useMemo(
    () => ({
      accessToken: session?.accessToken,
      handleResponse: (response) => {
        console.log({ response })
      },
      fetchApiData: getAllPreOrdersQueryFn,
      columns: [
        {
          id: "row",
          Header: t("common:row"),
          accessor: (_, index) => digitsEnToFa(index + 1)
        },
        {
          Header: t("common:entity_code", { entity: t("common:order") }),
          accessor: "uuid"
        },
        {
          id: "name",
          Header: t("common:entity_name", { entity: t("common:project") }),
          accessor: (item) => item?.project?.name
        },
        {
          id: "title",
          Header: t("common:category"),
          accessor: (item) => item?.category?.title
        },
        {
          Header: t("common:applicant_name"),
          accessor: "applicant_name"
        },
        {
          Header: t("common:expert_name"),
          accessor: "expert_name"
        },
        {
          id: "request_date",
          Header: t("common:submission-time"),
          accessor: (item) =>
            item?.request_date
              ? digitsEnToFa(
                  new Date(item?.request_date).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric"
                  })
                )
              : "-"
        },
        {
          id: "need_date",
          Header: t("common:order-needed-time"),
          accessor: (item) =>
            item?.need_date
              ? digitsEnToFa(
                  new DateObject(new Date(item?.need_date))
                    .toDate()
                    .toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "numeric",
                      minute: "numeric"
                    })
                )
              : "-"
        },
        {
          id: "status",
          Header: t("common:status"),
          accessor: (item) => PreOrderStatesFa[item?.status]?.name_fa_admin
        }
      ],
      filters: {
        schema: OrdersFilterSchema,
        Component: OrdersFilter
      }
    }),
    [session]
  )

  return (
    <div className="flex flex-col gap-7">
      <Table {...tableProps} />
    </div>
  )
}

export default OrdersPage
