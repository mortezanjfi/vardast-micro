"use client"

import { Dispatch, SetStateAction, useMemo } from "react"
import { TabTitleWithExtraData } from "@vardast/component/BrandOrSellerProfile"
import { AddFromProducts } from "@vardast/component/desktop/AddFromProducts"
import AddOrderProductOrganizer from "@vardast/component/desktop/AddOrderProductOrganizer"
import OrderManualTabContent from "@vardast/component/desktop/OrderManualTabContent"

export type AddOrderProductTab = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}

type AdminAddOrderProductTabsProps = {
  setProductIds?: Dispatch<SetStateAction<number[]>>
}

const AdminAddOrderProductTabs = ({
  setProductIds
}: AdminAddOrderProductTabsProps) => {
  const adminCreateOfferMutation = () => {
    console.log("admin offer created")
  }
  const tabs: AddOrderProductTab[] = useMemo(
    () => [
      {
        value: "انتخاب از کالا",
        title: <TabTitleWithExtraData title="انتخاب از سبد کالا" />,
        Content: () => (
          <AddFromProducts
            adminCreateOfferMutation={adminCreateOfferMutation}
            isAdmin={true}
          />
        )
      },
      {
        value: "افزودن دستی کالا",
        title: <TabTitleWithExtraData title="افزودن دستی کالا" />,
        Content: () => <OrderManualTabContent />
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return <AddOrderProductOrganizer tabs={tabs} isMobileView={false} />
}

export default AdminAddOrderProductTabs
