"use client"

import { useMemo, useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { PreOrderStatesFa } from "@vardast/component/desktop/OrderCart"
import Table from "@vardast/component/table/Table"
import {
  FilterComponentTypeEnum,
  ITableProps
} from "@vardast/component/table/type"
import {
  OrderOfferStatuses,
  PaymentMethodEnum,
  PreOrder,
  PreOrderStates,
  useGetAllProjectsQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { getAllPreOrdersQueryFn } from "@vardast/query/queryFns/orders/getAllPreOrdersQueryFn"
import { getEnumValues } from "@vardast/util/getEnumValues"
import useTranslation from "next-translate/useTranslation"
import { DateObject } from "react-multi-date-picker"
import { z } from "zod"

type OrdersPageProps = {
  isMobileView?: boolean
}

const OrdersFilterSchema = z.object({
  status: z.string().optional(),
  customerName: z.string().optional(),
  projectId: z.string().optional()
})

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

const orderStatus = [...getEnumValues(PreOrderStates)]

const OrdersPage = (_: OrdersPageProps) => {
  const [nameOrUuid, setNameOrUuid] = useState("")
  const { t } = useTranslation()

  const myProjectsQuery = useGetAllProjectsQuery(
    graphqlRequestClientWithToken,
    {
      indexProjectInput: {
        nameOrUuid
      }
    }
  )

  const tableProps: ITableProps<PreOrder, typeof OrdersFilterSchema> = useMemo(
    () => ({
      name: "orders",
      paginable: true,
      fetch: {
        api: getAllPreOrdersQueryFn,
        accessToken: true
      },
      onRow: {
        url: (row) =>
          `${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders/${row.original.id}`
      },
      filters: {
        schema: OrdersFilterSchema,
        options: [
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "customerName",
            title: t("common:purchaser-name")
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "status",
            title: t("common:status"),
            options: orderStatus.map((item) => ({
              key: PreOrderStatesFa[item as PreOrderStates]?.name_fa_admin,
              value: item.toUpperCase()
            }))
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "projectId",
            title: t("common:projects"),
            options: myProjectsQuery.data?.projects?.data?.map((item) => ({
              key: item.name,
              value: `${item.id}`
            })),
            loading: myProjectsQuery.isLoading || myProjectsQuery.isFetching,
            setSearch: setNameOrUuid
          }
        ]
      },
      columns: [
        {
          id: "row",
          header: t("common:row"),
          accessorFn: (_, index) => digitsEnToFa(index + 1)
        },
        {
          id: "uuid",
          header: t("common:entity_code", { entity: t("common:order") }),
          accessorFn: ({ uuid }) => digitsEnToFa(uuid)
        },
        {
          id: "name",
          header: t("common:entity_name", { entity: t("common:project") }),
          accessorFn: (item) => item?.project?.name
        },
        {
          id: "title",
          header: t("common:category"),
          accessorFn: (item) => item?.category?.title
        },
        {
          header: t("common:applicant_name"),
          accessorKey: "applicant_name"
        },
        {
          header: t("common:expert_name"),
          accessorKey: "expert_name"
        },
        {
          id: "request_date",
          header: t("common:submission-time"),
          accessorFn: (item) =>
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
          header: t("common:order-needed-time"),
          accessorFn: (item) =>
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
          header: t("common:status"),
          accessorFn: (item) => PreOrderStatesFa[item?.status]?.name_fa_admin
        }
      ]
    }),
    [myProjectsQuery.data, nameOrUuid]
  )

  return (
    <div className="flex flex-col gap-7">
      <Table {...tableProps} />
    </div>
  )
}

export default OrdersPage
