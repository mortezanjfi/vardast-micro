"use client"

import Image from "next/image"
import ndpLogo from "@vardast/asset/ndp-logo.svg"
import { LucideChevronsUpDown } from "lucide-react"

type Props = {}

const OrganizationMenu = (_: Props) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 rounded p-1">
        <span className="avatar avatar-sm bg-white p-1">
          <Image alt="..." className="!rounded-none" priority src={ndpLogo} />
        </span>
        <span className="truncate text-sm font-medium text-alpha-800">
          نیک داده پرداز
        </span>
        <span className="mr-auto flex h-8 w-8 items-center justify-center">
          <LucideChevronsUpDown className="h-3 w-3 text-alpha-600" />
        </span>
      </div>
    </div>
  )
}

export default OrganizationMenu
