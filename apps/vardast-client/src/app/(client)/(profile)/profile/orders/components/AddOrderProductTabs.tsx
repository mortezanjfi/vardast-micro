"use client"

import { Dispatch, SetStateAction, useMemo } from "react"

import AddOrderProductOrganizer from "@/app/(client)/(profile)/profile/orders/components/AddOrderProductOrganizer"
import OrderManualTabContent from "@/app/(client)/(profile)/profile/orders/components/OrderManualTabContent"
import { OrderProductTabContent } from "@/app/(client)/(profile)/profile/orders/components/OrderProductTabContent"
import UploadTabContent from "@/app/(client)/(profile)/profile/orders/components/UploadTabContent"
import { TabTitleWithExtraData } from "@/app/(public)/components/BrandOrSellerProfile"

export type AddOrderProductTab = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}

type AddOrderProductTabsProps = {
  setProductIds: Dispatch<SetStateAction<number[]>>
}

const AddOrderProductTabs = ({ setProductIds }: AddOrderProductTabsProps) => {
  const tabs: AddOrderProductTab[] = useMemo(
    () => [
      {
        value: "انتخاب از سبد کالا",
        title: <TabTitleWithExtraData title="انتخاب از سبد کالا" />,
        Content: () => <OrderProductTabContent setProductIds={setProductIds} />
      },
      {
        value: "افزودن دستی کالا",
        title: <TabTitleWithExtraData title="افزودن دستی کالا" />,
        Content: () => <OrderManualTabContent />
      },
      {
        value: "سفارش از طریق آپلود فایل",
        title: <TabTitleWithExtraData title="سفارش از طریق آپلود فایل" />,
        Content: () => <UploadTabContent />
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return <AddOrderProductOrganizer tabs={tabs} isMobileView={false} />
}

export default AddOrderProductTabs
