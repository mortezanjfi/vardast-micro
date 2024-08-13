import React, { PropsWithChildren, ReactElement } from "react"

import DynamicHeroIcon from "./DynamicHeroIcon"

interface FiltersSidebarContainerProps {
  sort?: ReactElement
  filters?: ReactElement
}

const FiltersSidebarContainer: React.FC<
  PropsWithChildren<FiltersSidebarContainerProps>
> = ({ sort, filters }) => {
  return (
    <div className="flex flex-col divide-y divide-alpha-300 bg-alpha-white px-4 py-4">
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex items-center gap-2">
          <DynamicHeroIcon icon="BarsArrowDownIcon" className="h-7 w-7" solid />
          <span className="text-lg font-medium text-alpha-800">مرتب سازی</span>
        </div>
        {sort}
      </div>
      <div className="flex flex-col gap-6 pt-6">
        {" "}
        <div className=" flex items-center">
          <div className="flex items-center gap-2">
            <DynamicHeroIcon
              icon="AdjustmentsHorizontalIcon"
              className="h-7 w-7"
              solid
            />
            <span className="text-lg font-medium text-alpha-800">فیلترها</span>
          </div>
        </div>
        <div className="flex flex-col">{filters}</div>
      </div>
    </div>
  )
}

export default FiltersSidebarContainer
