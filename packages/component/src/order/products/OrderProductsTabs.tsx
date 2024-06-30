"use client"

import { useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useCreateLineMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  CreateOrderLineSchema,
  CreateOrderLineType
} from "@vardast/type/OrderProductTabs"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { TabTitleWithExtraData } from "../../BrandOrSellerProfile"
import OrderProductsOrganizer from "./OrderProductsOrganizer"
import { OrderExtraPriceTabContent } from "./tabs/OrderExtraPriceTabContent"
import OrderManualTabContent from "./tabs/OrderManualTabContent"
import { OrderProductTabContent } from "./tabs/OrderProductTabContent"
import UploadTabContent from "./tabs/UploadTabContent"

type OrderProductsTabType = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}

type OrderProductsTabsProps = {
  uuid: string
  basket?: boolean
}

export enum OrderProductsTabsEnum {
  ORDER_PRODUCT_TAB = "ORDER_PRODUCT_TAB",
  ORDER_MANUAL_TAB = "ORDER_MANUAL_TAB",
  UPLOAD_TAB_CONTENT = "UPLOAD_TAB_CONTENT",
  EXTRA_PRICE = "EXTRA_PRICE"
}

const OrderProductsTabs = ({ uuid, basket }: OrderProductsTabsProps) => {
  const queryClient = useQueryClient()
  const form = useForm<CreateOrderLineType>({
    resolver: zodResolver(CreateOrderLineSchema)
  })

  const createLineMutation = useCreateLineMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        ;(
          errors.response.errors?.at(0)?.extensions.displayErrors as string[]
        ).map((error) =>
          toast({
            description: error,
            duration: 5000,
            variant: "danger"
          })
        )
      },
      onSuccess: () => {
        const clearObject = Object.fromEntries(
          Object.keys(form.getValues()).map((key) => [key, ""])
        )
        form.reset(clearObject)
        queryClient.invalidateQueries({
          queryKey: ["FindPreOrderById"]
        })
        toast({
          title: "آیتم مورد نظر شما با موفقیت به سفارش اضافه شد",
          duration: 5000,
          variant: "success"
        })
      }
    }
  )

  const addProductLine = (createLineInput: CreateOrderLineType) => {
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

  const tabProps = {
    addProductLine,
    uuid,
    form
  }

  const tabs: OrderProductsTabType[] = useMemo(() => {
    const initialTabs = basket
      ? [
          {
            value: OrderProductsTabsEnum.ORDER_PRODUCT_TAB,
            title: <TabTitleWithExtraData title="انتخاب از سبد کالا" />,
            Content: () => <OrderProductTabContent {...tabProps} />
          }
        ]
      : []

    const existingTabs = [
      {
        value: OrderProductsTabsEnum.ORDER_MANUAL_TAB,
        title: <TabTitleWithExtraData title="افزودن دستی کالا" />,
        Content: () => <OrderManualTabContent {...tabProps} />
      },
      {
        value: OrderProductsTabsEnum.UPLOAD_TAB_CONTENT,
        title: <TabTitleWithExtraData title="سفارش از طریق آپلود فایل" />,
        Content: () => <UploadTabContent {...tabProps} />
      },
      {
        value: OrderProductsTabsEnum.EXTRA_PRICE,
        title: <TabTitleWithExtraData title="هزینه های جانبی" />,
        Content: () => <OrderExtraPriceTabContent {...tabProps} />
      }
    ]

    return initialTabs.concat(existingTabs)
  }, [basket, tabProps])

  return <OrderProductsOrganizer tabs={tabs} isMobileView={false} />
}

export default OrderProductsTabs
