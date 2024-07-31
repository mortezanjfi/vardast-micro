"use client"

import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { Modal, ModalProps, useModals } from "@vardast/component/modal"
import Table from "@vardast/component/table/Table"
import { ITableProps } from "@vardast/component/table/type"
import useTable from "@vardast/component/table/useTable"
import {
  AddSellerOrderOffer,
  OfferLine,
  useFindOfferPreOrderByIdQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import { IOrderPageSectionProps, OrderModalEnum } from "@/types/type"
import AddPriceModal from "@/app/(bid)/orders/[uuid]/components/AddPriceModal"

function OfferModal({
  modals,
  open,
  onCloseModals
}: IOrderPageSectionProps<number>) {
  const { t } = useTranslation()
  const [modalsPrice, onChangeModalsPrice, onCloseModalsPrice] =
    useModals<OrderModalEnum>()

  const offersQuery = useFindOfferPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +modals?.data
    },
    {
      enabled: open
    }
  )

  const offersTableProps: ITableProps<OfferLine> = useTable({
    model: {
      name: "order-offer",
      fetch: {
        directData: {
          data: offersQuery.data?.findOfferPreOrderById
            .offerLine as OfferLine[],
          directLoading: offersQuery.isLoading || offersQuery.isFetching
        }
      },
      columns: [
        // {
        //   id: "id",
        //   header: t("common:entity_code", { entity: t("common:price-giver") }),
        //   accessorFn: ({ id }) => digitsEnToFa(id || "-")
        // },
        // {
        //   header: t("common:entity_name", { entity: t("common:price-giver") }),
        //   accessorKey: "request_name"
        // },
        // {
        //   id: "total",
        //   header: t("common:invoice-total-price"),
        //   accessorFn: ({ total_price }) =>
        //     digitsEnToFa(total_price ? addCommas(total_price) : 0)
        // },
        // {
        //   id: "id",
        //   header: t("common:entity_code", { entity: t("common:price-giver") }),
        //   accessorFn: ({ id }) => digitsEnToFa(id || "-")
        // },
        {
          id: "item_name",
          header: t("common:entity_name", { entity: t("common:product") }),
          accessorFn: ({ line }) => line?.item_name
        },
        // {
        //   header: t("common:entity_name", { entity: t("common:price-giver") }),
        //   accessorKey: "request_name"
        // },
        {
          id: "brand",
          header: t("common:brand"),
          accessorFn: ({ line }) => digitsEnToFa(line?.brand || "-")
        },
        {
          id: "unit",
          header: t("common:unit"),
          accessorFn: ({ line }) => digitsEnToFa(line?.uom || "-")
        },
        {
          id: "total",
          header: t("common:value"),
          accessorFn: ({ line }) =>
            digitsEnToFa(addCommas(line?.qty || 0) || "-")
        },
        // {
        //   id: "created_at",
        //   header: t("common:offer-submission-time"),
        //   accessorFn: ({ line }) =>
        //     line?.created_at
        //       ? digitsEnToFa(
        //           new Date(line?.created_at).toLocaleDateString("fa-IR", {
        //             year: "numeric",
        //             month: "2-digit",
        //             day: "2-digit"
        //           })
        //         )
        //       : ""
        // },
        {
          id: "price",
          header: () => (
            <div className="text-center">
              {t("common:price")}
              {" (تومان) "}
            </div>
          ),
          columns: [
            {
              id: "fi_price",
              header: t("common:fi_price"),
              accessorFn: ({ fi_price }) =>
                digitsEnToFa(!!+fi_price ? addCommas(fi_price) : "-")
            },
            {
              id: "tax_price",
              header: t("common:tax_price"),
              accessorFn: ({ tax_price }) =>
                digitsEnToFa(!!+tax_price ? addCommas(tax_price) : "-")
            },
            {
              id: "total_price",
              header: t("common:total_price"),
              accessorFn: ({ total_price }) =>
                digitsEnToFa(!!+total_price ? addCommas(total_price) : "-")
            },
            {
              id: "total_price",
              header: t("common:total_price"),
              accessorFn: ({ total_price }) =>
                digitsEnToFa(!!+total_price ? addCommas(total_price) : "-")
            }
          ]
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                variant="link"
                size="small"
                onClick={() => {
                  onChangeModalsPrice({
                    data: row.original,
                    type: OrderModalEnum.ADD_OFFER
                  })
                }}
              >
                {t("common:add_entity", { entity: t("common:price") })}
              </Button>
            )
          }
        }
        // {
        //   id: "created_at",
        //   header: t("common:offer-submission-time"),
        //   accessorFn: ({  }) =>
        //     created_at
        //       ? digitsEnToFa(
        //           new Date(created_at).toLocaleDateString("fa-IR", {
        //             year: "numeric",
        //             month: "2-digit",
        //             day: "2-digit"
        //           })
        //         )
        //       : ""
        // },
        // {
        //   id: "action",
        //   header: t("common:attributes"),
        //   accessorFn: ({ total, total_fi, total_tax }) =>
        //     `${total} ${total_fi} ${total_tax}`
        // }
      ]
    },
    dependencies: [offersQuery?.data]
  })

  const modalProps: ModalProps<AddSellerOrderOffer> = {
    open,
    size: "lg",
    onOpenChange: onCloseModals,
    title: t("common:details")
  }

  return (
    <>
      <AddPriceModal
        open={modalsPrice?.type === OrderModalEnum.ADD_OFFER}
        modals={modalsPrice}
        onChangeModals={onChangeModalsPrice}
        onCloseModals={onCloseModalsPrice}
      />
      <Modal {...modalProps}>
        <Table {...offersTableProps} />
      </Modal>
    </>
  )
}

export default OfferModal
