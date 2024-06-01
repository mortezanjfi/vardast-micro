"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "@vardast/component/Loading"
import NotFoundMessage from "@vardast/component/NotFound"
import PageHeader from "@vardast/component/PageHeader"
import Pagination from "@vardast/component/table/Pagination"
import {
  OrderOfferStatuses,
  PaymentMethodEnum,
  PreOrder,
  PreOrderStates,
  useCreatePreOrderMutation,
  usePreOrdersQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import OrderCard from "@/app/(client)/(profile)/profile/orders/components/OrderCart"
import OrderDeleteModal from "@/app/(client)/(profile)/profile/orders/components/OrderDeleteModal"

type OrdersPageProps = { isMobileView?: boolean; title: string }

export const OrderOfferStatusesFa = {
  [OrderOfferStatuses.Closed]: { className: "tag-success", name_fa: "بسته شده" }
}

export const PreOrderStatesFa = {
  [PreOrderStates.Created]: {
    className: "tag-gray",
    name_fa: "ایجاد شده"
  },
  [PreOrderStates.PendingInfo]: {
    className: "tag-info",
    name_fa: "در انتظار تایید اطلاعات"
  },
  [PreOrderStates.PendingLine]: {
    className: "tag-warning",
    name_fa: "در انتظار افزودن کالا"
  },
  [PreOrderStates.Verified]: { className: "tag-primary", name_fa: "تایید شده" },
  [PreOrderStates.Closed]: { className: "tag-success", name_fa: "بسته شده" }
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

const OrdersPage = ({ isMobileView, title }: OrdersPageProps) => {
  const { t } = useTranslation()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [orderToDelete, setOrderToDelete] = useState<PreOrder | null>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const router = useRouter()

  const preOrdersQuery = usePreOrdersQuery(
    graphqlRequestClientWithToken,
    {
      indexPreOrderInput: {
        page: currentPage
      }
    },
    {
      refetchOnMount: "always"
    }
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

  const onCreateOrder = () => {
    createOrderMutation.mutate({
      createPreOrderInput: {}
    })
  }

  return (
    <>
      <OrderDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        orderToDelete={orderToDelete}
      />
      {!isMobileView && <PageTitle title={title} />}
      {!isMobileView && (
        <PageHeader
          pageHeaderClasses="border-b py-5 !mb-0"
          title={"سفارش خود را ثبت کنید و بهترین قیمت را از وردست بخواهید."}
          titleClasses="text-[14px] font-normal"
          containerClass="items-center"
        >
          <Button
            disabled={createOrderMutation.isLoading || preOrdersQuery.isLoading}
            loading={createOrderMutation.isLoading}
            onClick={onCreateOrder}
            variant="primary"
            size="medium"
          >
            {t("common:add_new_entity", {
              entity: t("common:order")
            })}
          </Button>
        </PageHeader>
      )}

      {preOrdersQuery.isFetching && preOrdersQuery.isLoading ? (
        <div className="flex h-full items-center justify-center pt-6">
          <Loading hideMessage />
        </div>
      ) : preOrdersQuery.data?.preOrders?.data.length > 0 ? (
        <>
          {preOrdersQuery.data?.preOrders?.data.map((preOrder, index) => (
            <OrderCard
              key={index}
              preOrder={preOrder as PreOrder}
              setOrderToDelete={setOrderToDelete}
              setDeleteModalOpen={setDeleteModalOpen}
            />
          ))}
          {preOrdersQuery.data?.preOrders?.lastPage > 1 && (
            <Pagination
              total={preOrdersQuery.data?.preOrders.lastPage ?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          )}
          {isMobileView && (
            <div className="absolute bottom-0 w-full border-y border-alpha-200 bg-alpha-white px-6 py-5">
              <Button
                disabled={
                  createOrderMutation.isLoading || preOrdersQuery.isLoading
                }
                loading={createOrderMutation.isLoading}
                onClick={onCreateOrder}
                variant="primary"
                size="medium"
                className=" mt-auto w-full py-3"
              >
                {t("common:addOrderInfo")}
              </Button>
            </div>
          )}
        </>
      ) : (
        <NotFoundMessage text="سفارشی" />
      )}
    </>
  )
}

export default OrdersPage
