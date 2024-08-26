"use client"

import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  MultiTypeOrder,
  useCreateLineMutation
} from "@vardast/graphql/generated"
import { useSegmentTab } from "@vardast/hook/use-segment-tab"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  CreateOrderLineSchema,
  CreateOrderLineType
} from "@vardast/type/OrderProductTabs"
import { Modal, ModalProps } from "@vardast/ui/modal"
import { SegmentTab, SegmentTabTitle } from "@vardast/ui/segment"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { IOrderPageSectionProps } from "@/app/(layout)/(bid)/types/type"

import { OrderExtraPriceTabContent } from "./OrderExtraPriceTabContent"
import OrderManualTabContent from "./OrderManualTabContent"
import UploadTabContent from "./UploadTabContent"

export enum OrderProductsTabsModalEnum {
  ORDER_PRODUCT_TAB = "ORDER_PRODUCT_TAB",
  ORDER_MANUAL_TAB = "ORDER_MANUAL_TAB",
  UPLOAD_TAB_CONTENT = "UPLOAD_TAB_CONTENT",
  EXTRA_PRICE = "EXTRA_PRICE"
}

const OrderProductsTabsModal = ({
  uuid,
  open,
  basket,
  onCloseModals
}: IOrderPageSectionProps<CreateOrderLineType> & { basket?: boolean }) => {
  const [expenses, setExpenses] = useState<string[]>([])
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const { activeTab, onValueChange } =
    useSegmentTab<OrderProductsTabsModalEnum>({
      defaultValue: basket
        ? OrderProductsTabsModalEnum.ORDER_PRODUCT_TAB
        : OrderProductsTabsModalEnum.ORDER_MANUAL_TAB
    })

  const queryClient = useQueryClient()
  const form = useForm<CreateOrderLineType>({
    resolver: zodResolver(CreateOrderLineSchema)
  })

  const onCloseProductModal = () => {
    form.reset()
    onCloseModals()
    setExpenses([])
  }

  const createLineMutation = useCreateLineMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        onCloseProductModal()
        queryClient.invalidateQueries({
          queryKey: ["FindPreOrderById"]
        })
      }
    }
  )

  const onSubmit = (createLineInput: CreateOrderLineType) => {
    createLineMutation.mutate({
      createLineInput: {
        ...createLineInput,
        qty: createLineInput.qty || "1",
        item_name: createLineInput.item_name,
        preOrderId: +uuid
      }
    })
  }

  z.setErrorMap(zodI18nMap)

  const tabs = useMemo(() => {
    const existingTabs = [
      {
        value: OrderProductsTabsModalEnum.ORDER_MANUAL_TAB,
        title: <SegmentTabTitle title="افزودن دستی کالا" />,
        Content: () => <OrderManualTabContent form={form} />
      },
      {
        value: OrderProductsTabsModalEnum.UPLOAD_TAB_CONTENT,
        title: <SegmentTabTitle title="سفارش از طریق آپلود فایل" />,
        Content: () => (
          <UploadTabContent
            uuid={uuid}
            onSubmit={() => {
              queryClient.invalidateQueries({
                queryKey: ["FindPreOrderById"]
              })
              onCloseProductModal()
            }}
          />
        )
      },
      {
        value: OrderProductsTabsModalEnum.EXTRA_PRICE,
        title: <SegmentTabTitle title="هزینه های جانبی" />,
        Content: () => (
          <OrderExtraPriceTabContent
            expenses={expenses}
            loading={createLineMutation.isLoading}
            setExpenses={setExpenses}
          />
        )
      }
    ]

    return existingTabs
  }, [basket, expenses])

  const onSubmitExtraPrice = (e) => {
    e.preventDefault()
    Promise.all(
      expenses.map((item_name) => {
        onSubmit({
          item_name,
          type: MultiTypeOrder.Service
        })
      })
    )
  }

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseProductModal,
    errors,
    title: t("common:add_new_entity", { entity: t("common:product") }),
    action: (activeTab === OrderProductsTabsModalEnum.ORDER_MANUAL_TAB ||
      activeTab === OrderProductsTabsModalEnum.EXTRA_PRICE) && {
      disabled:
        form.formState.isLoading ||
        form.formState.isSubmitting ||
        createLineMutation.isLoading,
      loading:
        form.formState.isLoading ||
        form.formState.isSubmitting ||
        createLineMutation.isLoading,
      title: t("common:add_entity", { entity: t("common:product") })
    },
    form: {
      formProps: form,
      onSubmit:
        activeTab === OrderProductsTabsModalEnum.EXTRA_PRICE
          ? onSubmitExtraPrice
          : form.handleSubmit(onSubmit)
    }
  }

  return (
    <Modal {...modalProps}>
      <SegmentTab
        activeTab={activeTab}
        tabs={tabs}
        onValueChange={onValueChange}
      />
    </Modal>
  )
}

export default OrderProductsTabsModal
