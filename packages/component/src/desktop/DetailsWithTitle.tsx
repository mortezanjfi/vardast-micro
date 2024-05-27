"use client"

import { ListBulletIcon } from "@heroicons/react/24/outline"
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
        <ListBulletIcon className="text-alpha-500" width={6} height={6} />
        <span className="whitespace-nowrap text-alpha-500">{title}:</span>
      </div>
      <span className={clsx("whitespace-pre-wrap", textCustomStyle)}>
        {text ? digitsEnToFa(`${text}`) : "-"}
      </span>
    </div>
  )
}
