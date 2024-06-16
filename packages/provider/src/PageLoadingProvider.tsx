"use client"

import clsx from "clsx"
import { RefreshCcw } from "lucide-react"

import { usePageLoading } from "./LayoutProvider/use-layout"

type Props = {}

const PageLoadingProvider = (_: Props) => {
  const [loading] = usePageLoading()

  if (loading) {
    return (
      <div className="absolute inset-0 z-[99999999] h-screen w-screen">
        <div
          className={clsx(
            "flex h-full w-full items-center justify-center bg-alpha-white bg-opacity-50"
          )}
        >
          <div className="text-center">
            <RefreshCcw
              className={clsx("mx-auto animate-spin text-alpha-400")}
            />
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default PageLoadingProvider
