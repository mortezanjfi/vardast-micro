"use client"

import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Table from "@vardast/component/table/Table"
import { ITableProps } from "@vardast/component/table/type"
import useTable from "@vardast/component/table/useTable"
import {
  LineDto,
  MultiTypeOrder,
  useCreatePreOrderMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { getOrderLinesQueryFn } from "@vardast/query/queryFns/orders/getOrderLinesQueryFn"
import { newTimeConvertor } from "@vardast/util/convertToPersianDate"
import useTranslation from "next-translate/useTranslation"

type OrderLinesProps = {
  isMobileView?: boolean
}

const OrderLines = (_: OrderLinesProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const createPreOrderMutation = useCreatePreOrderMutation(
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
    createPreOrderMutation.mutate({
      createPreOrderInput: {}
    })
  }

  const tableProps: ITableProps<LineDto> = useTable({
    model: {
      name: "orders-line",
      container: {
        button: {
          disabled: createPreOrderMutation.isLoading,
          loading: createPreOrderMutation.isLoading,
          onClick: onCreateOrder,
          text: "افزودن سفارش",
          variant: "primary"
        },
        title: "لیست‌ سفارشات"
      },
      paginable: true,
      fetch: {
        api: getOrderLinesQueryFn,
        accessToken: true
      },
      onRow: {
        url: (row) =>
          `${process.env.NEXT_PUBLIC_BIDDING_PATH}orders/${row.original.id}`
      },
      columns: [
        {
          id: "pre_order_uuid",
          header: t("common:entity_code", { entity: t("common:order") }),
          accessorFn: (line) => digitsEnToFa(line.pre_order_uuid)
        },
        {
          header: t("common:entity_name", { entity: t("common:project") }),
          accessorKey: "project_name"
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
          id: "need_date",
          header: t("common:order-needed-time"),
          accessorFn: ({ need_date }) =>
            need_date ? newTimeConvertor(need_date) : "-"
        },
        {
          header: t("common:items"),
          accessorKey: "item_name"
        },
        {
          id: "uom",
          header: t("common:unit"),
          accessorFn: ({ uom }) => digitsEnToFa(uom)
        },
        {
          id: "type",
          header: t("common:type"),
          accessorFn: ({ type }) =>
            type === MultiTypeOrder.Product
              ? "کالا"
              : type === MultiTypeOrder.Service && "خدمات"
        }
      ]
    }
  })

  return <Table {...tableProps} />
}

export default OrderLines
