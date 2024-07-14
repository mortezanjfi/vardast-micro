"use client"

import { digitsEnToFa } from "@persian-tools/persian-tools"
import clsx from "clsx"

type DetailsWithTitleProps = {
  className?: string
  textCustomStyle?: string
  title: string
  text: string | number
}

export const DetailsWithTitle = ({
  className,
  title,
  text,
  textCustomStyle
}: DetailsWithTitleProps) => {
  return (
    <div className={clsx("flex items-center gap-2 py-1", className)}>
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-alpha-500" />
        <span className="whitespace-nowrap text-alpha-500">{title}:</span>
      </div>
      <div className="flex gap-1">
        <span className={clsx("whitespace-pre-wrap", textCustomStyle)}>
          {text ? digitsEnToFa(`${text}`) : "-"}
        </span>
      </div>
    </div>
  )
}
