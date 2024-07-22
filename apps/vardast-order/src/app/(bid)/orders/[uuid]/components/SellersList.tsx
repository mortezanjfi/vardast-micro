"use client"

import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Table from "@vardast/component/table/Table"
import { ITableProps } from "@vardast/component/table/type"
import useTable from "@vardast/component/table/useTable"
import { OfferOrder, PreOrder } from "@vardast/graphql/generated"
import axiosApis, { IServePdf } from "@vardast/query/queryClients/axiosApis"
import { findPreOrderByIdQueryFn } from "@vardast/query/queryFns/orders/findPreOrderByIdQueryFn"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { TypeOf, z } from "zod"

type Props = {
  isMobileView?: boolean
  uuid: string
}

const AddOfferSchema = z.object({
  offerId: z.number()
})

export type ConfirmOffer = TypeOf<typeof AddOfferSchema>
function SellersList({ uuid }: Props) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const token = session?.accessToken || null

  const downLoadPreInvoice = async ({ uuid, access_token }: IServePdf) => {
    const response = await axiosApis.getPreInvoice({ uuid, access_token })
    const html = response.data
    const blob = new Blob([html], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)

    const newTab = window.open(url, "_blank")
    newTab.focus()
  }

  const downLoadInvoice = async ({ uuid, access_token }: IServePdf) => {
    const response = await axiosApis.getInvoice({ uuid, access_token })
    const html = response.data
    const blob = new Blob([html], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)

    const newTab = window.open(url, "_blank")
    newTab.focus()
  }

  const tableProps: ITableProps<
    OfferOrder,
    undefined,
    { id: number },
    PreOrder
  > = useTable({
    model: {
      name: "order-offers",
      container: {
        button: {
          onClick: () => {
            downLoadInvoice({
              uuid,
              access_token: session.accessToken
            })
          },
          text: t("common:add_entity", { entity: t("common:offer") }),
          className: "py-2",
          type: "button"
        },
        title: t("common:entity_list", { entity: t(`common:offers`) })
      },
      onRow: {
        url: (row) =>
          `${process.env.NEXT_PUBLIC_BIDDING_PATH}orders/${row.original.id}`
      },
      fetch: {
        api: findPreOrderByIdQueryFn,
        accessToken: true
      },
      internalArgs: { id: +uuid },
      handleResponse: (response) => {
        return response.offers
      },
      columns: [
        {
          id: "id",
          header: t("common:entity_code", { entity: t("common:price-giver") }),
          accessorFn: ({ id }) => digitsEnToFa(id || "-")
        },
        {
          header: t("common:entity_name", { entity: t("common:price-giver") }),
          accessorKey: "request_name"
        },
        {
          id: "uuid",
          header: t("common:invoice-number"),
          accessorFn: ({ uuid }) => digitsEnToFa(uuid || "-")
        },
        {
          id: "total",
          header: t("common:invoice-total-price"),
          accessorFn: ({ total }) => digitsEnToFa(total ? addCommas(total) : 0)
        },
        {
          id: "created_at",
          header: t("common:offer-submission-time"),
          accessorFn: ({ created_at }) =>
            created_at
              ? digitsEnToFa(
                  new Date(created_at).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                  })
                )
              : ""
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <>
                <span
                  onClick={() => {
                    downLoadPreInvoice({
                      access_token: token,
                      uuid: `${row.original.uuid}`
                    })
                  }}
                  className="tag cursor-pointer text-error"
                >
                  {t("common:pre-invoice")}
                </span>
              </>
            )
          }
        }
      ]
    }
  })

  return <Table {...tableProps} />
}

export default SellersList
