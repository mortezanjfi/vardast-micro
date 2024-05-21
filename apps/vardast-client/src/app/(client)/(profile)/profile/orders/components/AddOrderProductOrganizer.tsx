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

import { AddOrderProductTabsEnum } from "@/app/(client)/(profile)/profile/orders/components/AddOrderProductTabs"
import MoreInfo from "@/app/(client)/(profile)/profile/orders/components/MoreInfo"

export type AddOrderProductOrganizerTab = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}

interface IAddOrderProductOrganizer {
  tabs: AddOrderProductOrganizerTab[]
  isMobileView: boolean
}

const AddOrderProductOrganizer = ({
  tabs,
  isMobileView
}: IAddOrderProductOrganizer) => {
  const [openTabName, setOpenTabName] = useQueryState("tab")
  const [activeTab, setActiveTab] = useState<AddOrderProductTabsEnum>(
    AddOrderProductTabsEnum.ORDER_PRODUCT_TAB
  )

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const onTabValueChange = (value: string) => {
    setActiveTab(value as AddOrderProductTabsEnum)
    setOpenTabName(value)
  }

  useEffect(() => {
    setActiveTab((openTabName || tabs[0].value) as AddOrderProductTabsEnum)
  }, [openTabName, tabs])

  return (
    <>
      <div className="bg-alpha-white pt md:pt-0">
        <Segments
          value={activeTab}
          onValueChange={onTabValueChange}
          className="sticky left-0 right-0 top-0 h-full flex-col bg-alpha-white sm:flex md:mt md:w-full"
        >
          <SegmentsList wrap className="border-b pb  md:border-b-2 md:pb-5">
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
      </div>
      <MoreInfo
        tabs={tabs}
        activeTab={activeTab}
        onTabValueChange={onTabValueChange}
      />
    </>
  )
}

export default AddOrderProductOrganizer
