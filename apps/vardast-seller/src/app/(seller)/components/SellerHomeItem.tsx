"use client"

import { useState } from "react"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import Link from "@vardast/component/Link"
import { ISellerMobileAnalyzeProps } from "@vardast/type/Seller"
import clsx from "clsx"

export const SellerHomeItem = ({
  Icon,
  title,
  href,
  id
}: ISellerMobileAnalyzeProps) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)

  return (
    <Link
      onClick={() => {
        href && setSelectedItemId(+id)
      }}
      href={href ?? ""}
      className={clsx(
        "flex cursor-pointer flex-col items-center justify-start gap-y-1 rounded-lg p"
      )}
    >
      <div
        className={clsx(
          "rounded-full border border-alpha-300 bg-alpha-50 p-6",
          selectedItemId === +id ? "border-2 border-secondary" : ""
        )}
      >
        <Icon className={clsx("h-full w-full text-secondary")} />
      </div>
      <p className="text-center text-sm">{title}</p>
    </Link>
  )
}
