"use client"

import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import {
  FilterComponentTypeEnum,
  ITableProps,
  Table,
  useTable
} from "@vardast/component/table"
import {
  PreOrder,
  PreOrderStates,
  useGetAllProjectsQuery
} from "@vardast/graphql/generated"
import { PreOrderStatesFa } from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { getAllPreOrdersQueryFn } from "@vardast/query/queryFns/orders/getAllPreOrdersQueryFn"
import { Badge } from "@vardast/ui/badge"
import { getEnumValues } from "@vardast/util/getEnumValues"
import useTranslation from "next-translate/useTranslation"
import { DateObject } from "react-multi-date-picker"
import { z } from "zod"

import {
  IOrdersTabProps,
  OrderModalEnum
} from "@/app/(layout)/(bid)/types/type"

const OrdersFilterSchema = z.object({
  status: z.string().optional(),
  customerName: z.string().optional(),
  projectId: z.string().optional()
})

const orderStatus = [...getEnumValues(PreOrderStates)]

const Orders = ({ onChangeModals }: IOrdersTabProps) => {
  const [nameOrUuid, setNameOrUuid] = useState("")

  const { t } = useTranslation()

  const getAllProjectsQuery = useGetAllProjectsQuery(
    graphqlRequestClientWithToken,
    {
      indexProjectInput: {
        nameOrUuid
      }
    }
  )

  const onCreateOrder = () => {
    if (onChangeModals) {
      onChangeModals({
        type: OrderModalEnum.ADD_ORDER
      })
    }
  }

  const tableProps: ITableProps<PreOrder, typeof OrdersFilterSchema> = useTable(
    {
      model: {
        name: "orders",
        container: {
          button: onChangeModals && {
            onClick: onCreateOrder,
            text: "افزودن سفارش",
            variant: "primary"
          },
          title: "لیست‌ سفارشات"
        },
        paginable: true,
        fetch: {
          api: getAllPreOrdersQueryFn
        },
        onRow: {
          url: (row) =>
            `${process.env.NEXT_PUBLIC_BIDDING_PATH}orders/${row.original.id}`
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
              options: getAllProjectsQuery.data?.projects?.data?.map(
                (item) => ({
                  key: item.name,
                  value: `${item.id}`
                })
              ),
              loading:
                getAllProjectsQuery.isLoading || getAllProjectsQuery.isFetching,
              setSearch: setNameOrUuid
            }
          ]
        },
        columns: [
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
            cell: ({ row }) => {
              const renderedValue = PreOrderStatesFa[row?.original?.status]
              return (
                <Badge variant={renderedValue?.variant}>
                  {renderedValue?.name_fa_admin}
                </Badge>
              )
            }
          }
        ]
      },
      dependencies: [getAllProjectsQuery.data, nameOrUuid]
    }
  )

  return <Table {...tableProps} />
}

export default Orders
