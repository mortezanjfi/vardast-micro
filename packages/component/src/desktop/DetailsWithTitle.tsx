"use client"

import { digitsEnToFa } from "@persian-tools/persian-tools"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import clsx from "clsx"

import { THeroIconName } from "../../../type/src/layout"
import DynamicHeroIcon from "../DynamicHeroIcon"

type DetailsWithTitleProps = {
  dot?: boolean
  icon?: THeroIconName
  className?: string
  textCustomStyle?: string
  title?: string
  text: string | number
  dotColor?: string
}

export const DetailsWithTitle = ({
  dotColor = "bg-alpha-500",
  dot = true,
  icon,
  className,
  title,
  text,
  textCustomStyle
}: DetailsWithTitleProps) => {
  return (
    <div className={clsx("flex items-center gap-2 py-1", className)}>
      {icon && (
        <DynamicHeroIcon
          icon={icon}
          className={mergeClasses(
            "icon h-7 w-7 flex-shrink-0 transform rounded-md p-1 text-alpha-500 transition-all"
          )}
          solid={false}
        />
      )}
      {dot && <div className={clsx("h-1 w-1 rounded-full", dotColor)} />}
      {title && (
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-alpha-500">{title}:</span>
        </div>
      )}
      <div className="flex gap-1">
        <span className={clsx("whitespace-pre-wrap", textCustomStyle)}>
          {text ? digitsEnToFa(`${text}`) : "-"}
        </span>
      </div>
    </div>
  )
}
