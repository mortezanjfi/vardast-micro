"use client"

import { ListBulletIcon } from "@heroicons/react/24/outline"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { THeroIconName } from "@vardast/type/layout"
import clsx from "clsx"

import DynamicHeroIcon from "../DynamicHeroIcon"

export type DetailsWithTitleProps = {
  className?: string
  textCustomStyle?: string
  item?: {
    key?: string
    value?: string | number | React.ReactNode
    icon?: THeroIconName
  }
}

export const DetailsWithTitle = ({
  className,
  item,
  textCustomStyle
}: DetailsWithTitleProps) => {
  return (
    <div className={clsx("flex items-center gap-2 py-1", className)}>
      {item?.icon && (
        <DynamicHeroIcon
          icon={item.icon}
          className={mergeClasses(
            "icon h-7 w-7 flex-shrink-0 transform rounded-md p-1 text-alpha-500 transition-all"
          )}
          solid={false}
        />
      )}
      {item?.key && (
        <div className="flex items-center gap-2">
          <ListBulletIcon className="text-alpha-500" width={6} height={6} />
          {item?.key && (
            <span className="whitespace-nowrap text-alpha-500">
              {item?.key}:
            </span>
          )}
        </div>
      )}
      <div className="flex gap-1">
        <span className={clsx("whitespace-pre-wrap", textCustomStyle)}>
          {item?.value
            ? typeof item?.value === "string" || typeof item?.value === "number"
              ? digitsEnToFa(item?.value)
              : item?.value
            : "-"}
        </span>
      </div>
    </div>
  )
}
