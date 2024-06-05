"use client"

import { useEffect, useState } from "react"
import {
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsListItem
} from "@vardast/ui/segment"
import clsx from "clsx"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import { useQueryState } from "next-usequerystate"

import { OrderProductsTabsEnum } from "@/app/(client)/profile/orders/[uuid]/products/components/OrderProductsTabs"
import MoreInfo from "@/app/(client)/profile/orders/components/MoreInfo"

export type OrderProductsOrganizerTab = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}

interface IOrderProductsOrganizer {
  tabs: OrderProductsOrganizerTab[]
  isMobileView: boolean
}

const OrderProductsOrganizer = ({
  tabs,
  isMobileView
}: IOrderProductsOrganizer) => {
  const [openTabName, setOpenTabName] = useQueryState("tab")
  const [activeTab, setActiveTab] = useState<OrderProductsTabsEnum>(
    OrderProductsTabsEnum.ORDER_PRODUCT_TAB
  )

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const onTabValueChange = (value: string) => {
    setActiveTab(value as OrderProductsTabsEnum)
    setOpenTabName(value)
  }

  useEffect(() => {
    setActiveTab((openTabName || tabs[0]?.value) as OrderProductsTabsEnum)
  }, [openTabName, tabs])

  return (
    <>
      <Segments
        value={activeTab}
        onValueChange={onTabValueChange}
        className="flex w-full flex-col bg-alpha-white"
      >
        <SegmentsList wrap className="!justify-start border-b pb md:py-6">
          {tabs.map(({ title, value }) => (
            <SegmentsListItem
              key={value}
              noStyle
              className={clsx("no-select")}
              value={value}
              style={{
                width:
                  !isMobileView || tabs.length > 3
                    ? "auto"
                    : `${100 / tabs.length}%`
              }}
            >
              <>
                <div
                  className={clsx(
                    "mx-1 cursor-pointer rounded-full border bg-alpha-white px-4 py-2.5 text-sm",
                    value === activeTab
                      ? "border-primary bg-primary text-alpha-white"
                      : "border-alpha-300"
                  )}
                >
                  {title}
                </div>
              </>
            </SegmentsListItem>
          ))}
        </SegmentsList>
        {tabs.map(({ Content, className, ...props }) => (
          <SegmentsContent
            className={clsx("flex-1", className)}
            key={props.value}
            value={props.value}
          >
            <Content />
          </SegmentsContent>
        ))}
      </Segments>
      <MoreInfo
        tabs={tabs}
        activeTab={activeTab}
        onTabValueChange={onTabValueChange}
      />
    </>
  )
}

export default OrderProductsOrganizer
