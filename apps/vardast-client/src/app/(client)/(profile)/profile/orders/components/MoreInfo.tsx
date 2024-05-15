import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { InformationCircleIcon } from "@heroicons/react/24/solid"
import { Button } from "@vardast/ui/button"

type MoreInfoProps = {}

const MoreInfo = ({}: MoreInfoProps) => {
  const searchParams = useSearchParams()
  const tabs = [
    "انتخاب از سبد کالا",
    "سفارش از طریق آپلود فایل",
    "افزودن دستی کالا"
  ]

  const [activeTab, setActiveTab] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(searchParams as any)
    const activeTabFromParams = params.get("tab")
    setActiveTab(activeTabFromParams)
  }, [searchParams])

  return (
    <div className="mt-5 py-5">
      <div className="rounded-lg bg-alpha-100 p-6">
        <div className="flex flex-col gap-4 rounded-lg bg-alpha-white p-5">
          <div className="flex gap-2">
            <InformationCircleIcon
              className="text-warning-500"
              width={16}
              height={16}
            />
            <p>لیست سفارش هنوز تکمیل نشده؟</p>
          </div>
          <div>
            <p className="text-alpha-500">
              با استفاده از روش های زیر نیز میتوانید سفارش خود را تکمیل نمایید.
            </p>
          </div>
          <div className="flex gap-2">
            {tabs.map((tab, index) => {
              if (!activeTab && tab !== "انتخاب از سبد کالا") {
                return (
                  <Button
                    key={index}
                    className="rounded-full"
                    variant="outline-blue"
                  >
                    {tab}
                  </Button>
                )
              } else if (activeTab && tab !== activeTab) {
                return (
                  <Button
                    key={index}
                    className="rounded-full"
                    variant="outline-blue"
                  >
                    {tab}
                  </Button>
                )
              } else {
                return null
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoreInfo
