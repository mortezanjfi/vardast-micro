"use client"

import { useMemo, useState } from "react"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { ITableProps, Table, useTable } from "@vardast/component/table"
import {
  Line,
  OfferOrder,
  OrderOfferStatuses,
  useCreateOrderOfferMutation,
  useFindPreOrderByIdQuery,
  useUpdateOrderOfferMutation
} from "@vardast/graphql/generated"
import { axiosDownLoad } from "@vardast/query/queryClients/axiosApis"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { DateObject } from "react-multi-date-picker"

import { PaymentMethodEnumFa, PreOrderStatesFa } from "@/app/(bid)/constants"
import AddSellerModal from "@/app/(bid)/orders/[uuid]/components/AddSellerModal"
import OfferModal from "@/app/(bid)/orders/[uuid]/components/OfferModal"
import OrderInfoModal from "@/app/(bid)/orders/[uuid]/components/OrderInfoModal"
import OrderProductsTabsModal from "@/app/(bid)/orders/[uuid]/components/tabs/OrderProductsTabsModal"
import DetailsCard from "@/app/(bid)/orders/components/DetailsCard"
import { IOrderPageProps, OrderModalEnum } from "@/app/(bid)/types/type"

const OrderPage = ({ uuid }: IOrderPageProps) => {
  const [loading, setLoading] = useState(null)
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()
  const { data: session } = useSession()

  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const createOrderOfferMutation = useCreateOrderOfferMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: (data) => {
        if (data?.createOrderOffer?.id) {
          findPreOrderByIdQuery.refetch()
          onChangeModals({
            type: OrderModalEnum.SELLER,
            data: data?.createOrderOffer?.id
          })
        }
      }
    }
  )

  const updateOrderOfferMutation = useUpdateOrderOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: () => {
        setLoading(null)
      },
      onSuccess: () => {
        setLoading(null)
        findPreOrderByIdQuery.refetch()
      }
    }
  )

  const orderInfo = useMemo(
    () => findPreOrderByIdQuery?.data?.findPreOrderById,
    [findPreOrderByIdQuery?.data]
  )

  const badges = useMemo(
    () => [
      {
        children: `${t("common:entity_code", { entity: t("common:order") })} ${digitsEnToFa(orderInfo?.uuid || "-")}`
      },
      {
        children: PreOrderStatesFa[orderInfo?.status]?.name_fa,
        variant: PreOrderStatesFa[orderInfo?.status]?.variant
      }
    ],
    [orderInfo]
  )

  const items = useMemo(() => {
    return [
      {
        item: {
          //  نام پروژه
          key: t("common:entity_name", { entity: t("common:project") }),
          value: orderInfo?.project?.name
        }
      },
      {
        item: {
          // آدرس پروژه
          key: t("common:project-address"),
          value: orderInfo?.project?.address[0]?.address?.address
        }
      },
      {
        item: {
          //  دسته بندی
          key: t("common:entity_name", { entity: t("common:category") }),
          value: orderInfo?.category?.title
        }
      },
      {
        item: {
          //  زمان ثبت سفارش
          key: t("common:submission-time"),
          value: orderInfo?.request_date
            ? digitsEnToFa(
                new Date(orderInfo?.request_date).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric"
                })
              )
            : ""
        }
      },
      {
        item: {
          // زمان نیاز
          key: t("common:order-needed-time"),
          value: orderInfo?.need_date
            ? digitsEnToFa(
                new DateObject(new Date(orderInfo?.need_date))
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
        }
      },
      {
        item: {
          //  زمان شروع مناقصه
          key: t("common:bid-start-time"),
          value: orderInfo?.bid_start
            ? digitsEnToFa(
                new Date(orderInfo?.bid_start).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric"
                })
              )
            : ""
        }
      },
      {
        item: {
          //  زمان پایان مناقصه
          key: t("common:bid-end-time"),
          value: orderInfo?.bid_end
            ? digitsEnToFa(
                new Date(orderInfo?.bid_end).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric"
                })
              )
            : ""
        }
      },
      {
        item: {
          //  کارشناس خرید
          key: t("common:entity_name", { entity: t("common:expert_name") }),
          value: orderInfo?.expert_name
        }
      },
      {
        item: {
          //  نام درخواست کننده
          key: t("common:entity_name", { entity: t("common:applicant_name") }),
          value: orderInfo?.applicant_name
        }
      },

      {
        item: {
          // تحویل گیرنده
          key: t("common:transferee"),
          value: orderInfo?.project?.address[0]?.address?.delivery_name
        }
      },
      {
        item: {
          // شماره تماس تحویل گیرنده
          key: t("common:transferee-number"),
          value: orderInfo?.project?.address[0]?.address?.delivery_contact
        }
      },
      {
        item: {
          //  آد رس
          key: t("common:shipping-address"),
          value: orderInfo?.project?.address[0]?.address?.address
        }
      },
      {
        item: {
          // روش پرداخت
          key: t("common:pay-method"),
          value: PaymentMethodEnumFa[orderInfo?.payment_methods]?.name_fa
        }
      },

      {
        item: {
          // توضیحات
          key: t("common:description_entity", { entity: t("common:order") }),
          value: orderInfo?.descriptions
        },
        className: "col-span-full"
      }
    ]
  }, [orderInfo])

  const tableProps: ITableProps<Line> = useTable({
    model: {
      name: "order-lines",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: OrderModalEnum.LINE,
              data: undefined
            }),
          text: t("common:add_new_entity", { entity: t(`common:product`) }),
          type: "button"
        },
        title: t("common:entity_list", { entity: t(`common:products`) })
      },
      fetch: {
        directData: {
          data: findPreOrderByIdQuery?.data?.findPreOrderById.lines,
          directLoading:
            findPreOrderByIdQuery?.isLoading ||
            findPreOrderByIdQuery?.isFetching
        }
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
    },
    dependencies: [findPreOrderByIdQuery]
  })

  const offersTableProps: ITableProps<OfferOrder> = useTable({
    model: {
      name: "order-offers",
      container: {
        button: {
          onClick: () =>
            createOrderOfferMutation.mutate({
              createOrderOfferInput: {
                preOrderId: +uuid
              }
            }),
          loading: createOrderOfferMutation.isLoading,
          disabled:
            createOrderOfferMutation.isLoading ||
            !findPreOrderByIdQuery?.data?.findPreOrderById?.lines?.length,
          text: t("common:add_entity", { entity: t("common:offer") }),
          type: "button"
        },
        title: t("common:entity_list", { entity: t(`common:offers`) })
      },
      onRow: {
        onClick: (row) =>
          onChangeModals({
            type: OrderModalEnum.OFFER,
            data: row.original.id
          })
      },
      fetch: {
        directData: {
          data: findPreOrderByIdQuery?.data?.findPreOrderById
            .offers as OfferOrder[],
          directLoading:
            findPreOrderByIdQuery?.isLoading ||
            findPreOrderByIdQuery?.isFetching
        }
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
                {row.original.status === OrderOfferStatuses.Invoice ? (
                  <Button
                    variant="link"
                    size="small"
                    onClick={() => {
                      axiosDownLoad({
                        access_token: session?.accessToken,
                        uuid: `${row.original.uuid}`,
                        apiName: "getPreInvoice"
                      })
                    }}
                  >
                    {t("common:pre-invoice")}
                  </Button>
                ) : row.original.status ===
                  OrderOfferStatuses.PaymentSubmited ? (
                  <Button
                    variant="link"
                    size="small"
                    onClick={() => {
                      axiosDownLoad({
                        access_token: session?.accessToken,
                        uuid: `${row.original.uuid}`,
                        apiName: "getInvoice"
                      })
                    }}
                  >
                    {t("common:invoice")}
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    size="small"
                    onClick={() => {
                      setLoading(row.original.id)
                      updateOrderOfferMutation.mutate({
                        updateOrderOfferInput: {
                          id: row.original.id,
                          status: OrderOfferStatuses.Invoice
                        }
                      })
                    }}
                  >
                    {updateOrderOfferMutation.isLoading &&
                    loading === row.original.id
                      ? "در حال ارسال..."
                      : "ارسال پیشنهاد"}
                  </Button>
                )}
              </>
            )
          }
        }
      ]
    },
    dependencies: [findPreOrderByIdQuery, createOrderOfferMutation]
  })

  const sectionProps = {
    uuid,
    onCloseModals,
    modals,
    onChangeModals
  }
  return (
    <>
      <OrderInfoModal
        open={modals?.type === OrderModalEnum.INFO}
        {...sectionProps}
      />
      <OrderProductsTabsModal
        open={modals?.type === OrderModalEnum.LINE}
        {...sectionProps}
      />
      <AddSellerModal
        open={modals?.type === OrderModalEnum.SELLER}
        {...sectionProps}
      />
      <OfferModal
        open={
          modals?.type === OrderModalEnum.OFFER ||
          modals?.type === OrderModalEnum.ADD_OFFER
        }
        {...sectionProps}
      />
      <DetailsCard
        items={items}
        badges={badges}
        card={{
          title: t("common:order-info"),
          button: {
            onClick: () =>
              onChangeModals({
                type: OrderModalEnum.INFO,
                data: {
                  ...findPreOrderByIdQuery?.data?.findPreOrderById,
                  addressId:
                    findPreOrderByIdQuery?.data?.findPreOrderById?.address?.id,
                  projectId: String(
                    findPreOrderByIdQuery?.data?.findPreOrderById?.project?.id
                  ),
                  categoryId:
                    findPreOrderByIdQuery?.data?.findPreOrderById?.category?.id
                }
              }),
            text: t("common:edit"),
            type: "button"
          }
        }}
      />
      <Table {...tableProps} />
      <Table {...offersTableProps} />
    </>
  )
}

export default OrderPage
