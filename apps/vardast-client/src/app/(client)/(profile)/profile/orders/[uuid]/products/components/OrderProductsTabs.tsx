"use client"

import { useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { TabTitleWithExtraData } from "@vardast/component/BrandOrSellerProfile"
import {
  CreateLineInput,
  useCreateLineMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { useForm, UseFormReturn } from "react-hook-form"
import { TypeOf, z } from "zod"

import OrderProductsOrganizer from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsOrganizer"
import { OrderExtraPriceTabContent } from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/tabs/OrderExtraPriceTabContent"
import OrderManualTabContent from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/tabs/OrderManualTabContent"
import { OrderProductTabContent } from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/tabs/OrderProductTabContent"
import UploadTabContent from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/tabs/UploadTabContent"

type OrderProductsTabType = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}

type OrderProductsTabsProps = {
  uuid: string
}

export enum OrderProductsTabsEnum {
  ORDER_PRODUCT_TAB = "ORDER_PRODUCT_TAB",
  ORDER_MANUAL_TAB = "ORDER_MANUAL_TAB",
  UPLOAD_TAB_CONTENT = "UPLOAD_TAB_CONTENT",
  EXTRA_PRICE = "EXTRA_PRICE"
}

export const CreateOrderLineSchema = z.object({
  attribuite: z.string().optional(),
  brand: z.string(),
  descriptions: z.string().optional(),
  item_name: z.string(),
  qty: z.string().optional(),
  uom: z.string(),
  type: z.string().optional()
})

export type CreateOrderLineType = TypeOf<typeof CreateOrderLineSchema> & {
  type?: CreateLineInput["type"]
}

export interface OrderProductTabContentProps {
  addProductLine: (productLine: CreateOrderLineType) => void
  form: UseFormReturn<CreateOrderLineType>
  uuid?: string
}

const OrderProductsTabs = ({ uuid }: OrderProductsTabsProps) => {
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

  const tabs: OrderProductsTabType[] = useMemo(
    () => [
      {
        value: OrderProductsTabsEnum.ORDER_PRODUCT_TAB,
        title: <TabTitleWithExtraData title="انتخاب از سبد کالا" />,
        Content: () => <OrderProductTabContent {...tabProps} />
      },
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
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return <OrderProductsOrganizer tabs={tabs} isMobileView={false} />
}

export default OrderProductsTabs
