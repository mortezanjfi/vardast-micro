import { InformationCircleIcon } from "@heroicons/react/24/solid"
import Link from "@vardast/component/Link"
import { clsx } from "clsx"

import { AddOrderProductOrganizerTab } from "@/app/(client)/(profile)/profile/orders/components/AddOrderProductOrganizer"
import { AddOrderProductTabsEnum } from "@/app/(client)/(profile)/profile/orders/components/AddOrderProductTabs"

type MoreInfoProps = {
  tabs: AddOrderProductOrganizerTab[]
  onTabValueChange: (value: string) => void
  activeTab: AddOrderProductTabsEnum
}

const MoreInfo = ({ activeTab, tabs, onTabValueChange }: MoreInfoProps) => {
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
              return (
                <Link
                  key={index}
                  href="#"
                  onClick={() => onTabValueChange(tab.value)}
                  className={clsx(
                    "btn btn-outline-blue rounded-full",
                    activeTab === tab.value && "bg-info-100"
                  )}
                >
                  {tab.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoreInfo
