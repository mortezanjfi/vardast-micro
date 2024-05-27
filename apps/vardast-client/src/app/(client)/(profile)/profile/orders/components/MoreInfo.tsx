import { InformationCircleIcon } from "@heroicons/react/24/solid"
import Link from "@vardast/component/Link"
import { clsx } from "clsx"

import { OrderProductsOrganizerTab } from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsOrganizer"
import { OrderProductsTabsEnum } from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsTabs"

type MoreInfoProps = {
  tabs: OrderProductsOrganizerTab[]
  onTabValueChange: (value: string) => void
  activeTab: OrderProductsTabsEnum
}

const MoreInfo = ({ activeTab, tabs, onTabValueChange }: MoreInfoProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-alpha-100 p-6">
      <div className="flex items-center gap-2">
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
          return (
            <Link
              key={index}
              href="#"
              onClick={() => onTabValueChange(tab.value)}
              className={clsx(
                "btn btn-sm btn-outline-blue rounded-full",
                activeTab === tab.value && "bg-info !text-alpha-white"
              )}
            >
              {tab.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MoreInfo
