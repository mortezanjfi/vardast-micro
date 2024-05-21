"use client"

import { useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { TabTitleWithExtraData } from "@vardast/component/BrandOrSellerProfile"
import { useCreateLineMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { useForm, UseFormReturn } from "react-hook-form"
import { TypeOf, z } from "zod"

import AddOrderProductOrganizer from "@/app/(client)/(profile)/profile/orders/components/AddOrderProductOrganizer"
import OrderManualTabContent from "@/app/(client)/(profile)/profile/orders/components/OrderManualTabContent"
import { OrderProductTabContent } from "@/app/(client)/(profile)/profile/orders/components/OrderProductTabContent"
import UploadTabContent from "@/app/(client)/(profile)/profile/orders/components/UploadTabContent"

export type AddOrderProductTab = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}

type AddOrderProductTabsProps = {
  uuid: string
}

export enum AddOrderProductTabsEnum {
  ORDER_PRODUCT_TAB = "ORDER_PRODUCT_TAB",
  ORDER_MANUAL_TAB = "ORDER_MANUAL_TAB",
  UPLOAD_TAB_CONTENT = "UPLOAD_TAB_CONTENT"
}

export const CreateOrderLineSchema = z.object({
  attribuite: z.string().optional(),
  brand: z.string(),
  descriptions: z.string().optional(),
  item_name: z.string(),
  qty: z.string().optional(),
  uom: z.string()
})

export type CreateOrderLineType = TypeOf<typeof CreateOrderLineSchema>

export interface OrderProductTabContentProps {
  addProductLine: (productLine: CreateOrderLineType) => void
  form: UseFormReturn<CreateOrderLineType>
}

const AddOrderProductTabs = ({ uuid }: AddOrderProductTabsProps) => {
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
          title: "کالا با موفقیت اضافه شد",
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

  const tabs: AddOrderProductTab[] = useMemo(
    () => [
      {
        value: AddOrderProductTabsEnum.ORDER_PRODUCT_TAB,
        title: <TabTitleWithExtraData title="انتخاب از سبد کالا" />,
        Content: () => <OrderProductTabContent {...tabProps} />
      },
      {
        value: AddOrderProductTabsEnum.ORDER_MANUAL_TAB,
        title: <TabTitleWithExtraData title="افزودن دستی کالا" />,
        Content: () => <OrderManualTabContent {...tabProps} />
      },
      {
        value: AddOrderProductTabsEnum.UPLOAD_TAB_CONTENT,
        title: <TabTitleWithExtraData title="سفارش از طریق آپلود فایل" />,
        Content: () => <UploadTabContent {...tabProps} />
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return <AddOrderProductOrganizer tabs={tabs} isMobileView={false} />
}

export default AddOrderProductTabs
