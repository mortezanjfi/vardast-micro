"use client"

import Image from "next/image"
import logo from "@vardast/asset/sign-dark-bg.svg"
import { clsx } from "clsx"

import { usePageLoading } from "./LayoutProvider/use-layout"

type Props = {}

const PageLoadingProvider = (_: Props) => {
  const [loading] = usePageLoading()

  if (loading) {
    return (
      <div className="absolute inset-0 z-[99999999] h-full w-full overflow-hidden">
        {/* <div
          className={clsx(
            "flex h-full w-full items-center justify-center bg-alpha-white bg-opacity-50"
          )}
        >
          <div className="text-center">
            <RefreshCcw
              className={clsx("mx-auto animate-spin text-alpha-400")}
            />
          </div>
        </div> */}
        <div
          className={clsx(
            "flex h-full w-full items-center justify-center bg-alpha bg-opacity-50"
          )}
        >
          <div className="mx-auto aspect-square h-16 w-16 md:h-28 md:w-28">
            <Image
              alt="seller"
              className="h-full w-full object-contain"
              height={50}
              src={logo}
              width={50}
            />
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default PageLoadingProvider
