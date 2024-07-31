"use client"

import { digitsEnToFa } from "@persian-tools/persian-tools"
import { ITableProps, Table, useTable } from "@vardast/component/table"
import { LineDto, MultiTypeOrder } from "@vardast/graphql/generated"
import { getOrderLinesQueryFn } from "@vardast/query/queryFns/orders/getOrderLinesQueryFn"
import { newTimeConvertor } from "@vardast/util/convertToPersianDate"
import useTranslation from "next-translate/useTranslation"

import { IOrdersTabProps, OrderModalEnum } from "@/types/type"

const Lines = ({ onChangeModals }: IOrdersTabProps) => {
  const { t } = useTranslation()

  const onCreateOrder = () => {
    onChangeModals({
      type: OrderModalEnum.ADD_ORDER
    })
  }

  const tableProps: ITableProps<LineDto> = useTable({
    model: {
      name: "lines",
      container: {
        button: {
          onClick: onCreateOrder,
          text: "افزودن سفارش",
          variant: "primary"
        },
        title: "لیست‌ سفارشات"
      },
      paginable: true,
      fetch: {
        api: getOrderLinesQueryFn
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
          accessorFn: ({ uom }) => digitsEnToFa(uom || "-")
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

export default Lines
