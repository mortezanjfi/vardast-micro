"use client"

import { PropsWithChildren, ReactNode } from "react"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"

import Link from "../Link"

export interface IMobileHomeSectionContainer {
  title?: string | ReactNode
  viewAllHref?: string
  bgWhite?: boolean
  customButton?: {
    onClick: (_?: any) => void
    title: string
  }
}

const MobileHomeSectionContainer: React.FC<
  PropsWithChildren<IMobileHomeSectionContainer>
> = ({ title = "", viewAllHref, bgWhite = false, customButton, children }) => {
  return (
    <div
      className={clsx(
        "flex flex-col pt-8 md:pt-4",
        bgWhite && "bg-alpha-white"
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-6 pb-8 pt-0 sm:pb-4 md:px-0">
          {typeof title === "string" ? (
            <h3 className={`font-medium md:text-xl`}>{title}</h3>
          ) : (
            title
          )}
          {customButton ? (
            <Button
              className="md:text-md flex items-center gap-x-0.5 text-sm font-semibold !text-primary"
              variant="link"
              onClick={customButton.onClick}
            >
              {customButton.title}
              <ChevronLeftIcon className="h-4 w-4 text-primary" />
            </Button>
          ) : (
            viewAllHref && (
              <Link
                className="md:text-md flex items-center gap-x-0.5 text-sm font-semibold text-primary"
                href={viewAllHref}
              >
                مشاهده همه
                <ChevronLeftIcon className="h-4 w-4 text-primary" />
              </Link>
            )
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default MobileHomeSectionContainer
