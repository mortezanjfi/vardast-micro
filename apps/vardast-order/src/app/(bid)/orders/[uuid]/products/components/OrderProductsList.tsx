"use client"

import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Table from "@vardast/component/table/Table"
import { ITableProps } from "@vardast/component/table/type"
import useTable from "@vardast/component/table/useTable"
import { Line, PreOrder } from "@vardast/graphql/generated"
import { findPreOrderByIdQueryFn } from "@vardast/query/queryFns/orders/findPreOrderByIdQueryFn"
import useTranslation from "next-translate/useTranslation"

type OrderProductsListProps = {
  uuid: string
}

function OrderProductsList({ uuid }: OrderProductsListProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const tableProps: ITableProps<Line, undefined, { id: number }, PreOrder> =
    useTable({
      model: {
        name: "order-lines",
        container: {
          button: {
            onClick: () =>
              router.push(
                `${process.env.NEXT_PUBLIC_BIDDING_PATH}orders/${uuid}/products`
              ),
            text: t("common:add_new_entity", { entity: t(`common:product`) }),
            type: "button"
          },
          title: t("common:entity_list", { entity: t(`common:products`) })
        },
        fetch: {
          api: findPreOrderByIdQueryFn
        },
        internalArgs: { id: +uuid },
        handleResponse: (response) => {
          return response.lines
        },
        columns: [
          {
            id: "id",
            header: t("common:product_sku"),
            accessorFn: ({ id }) => digitsEnToFa(id || "-")
          },
          {
            id: "item_name",
            header: t("common:entity_name", { entity: t("common:product") }),
            accessorFn: ({ item_name }) => digitsEnToFa(item_name || "-")
          },
          {
            header: t("common:brand"),
            accessorKey: "brand"
          },
          {
            header: t("common:unit"),
            accessorKey: "uom"
          },
          {
            id: "qty",
            header: t("common:value"),
            accessorFn: ({ qty }) => digitsEnToFa(qty || 0)
          },
          {
            id: "attribuite",
            header: t("common:attributes"),
            accessorFn: ({ attribuite }) => attribuite || "-"
          }
        ]
      }
    })

  return <Table {...tableProps} />
}

export default OrderProductsList
