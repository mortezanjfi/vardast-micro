"use client"

import { useMemo } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ArrowRightIcon, Bars3Icon } from "@heroicons/react/24/solid"
import logo from "@vardast/asset/logo-horizontal-v2-persian-dark-bg-white.svg"
import { useSetSidebarHamburger } from "@vardast/provider/LayoutProvider/use-layout"
import { ILayoutMobileHeader } from "@vardast/type/layout"
import { Button } from "@vardast/ui/button"
import { clsx } from "clsx"

import Progress from "../Progress"

const MobileHeader = ({
  title,
  back,
  options,
  progress,
  hamburger
}: ILayoutMobileHeader) => {
  const router = useRouter()
  const params = useParams()
  const setSidebarHamburger = useSetSidebarHamburger()

  const slugTitle = useMemo(() => {
    const slug = Object.values(params)?.at(0)
    return slug?.at(-1) && decodeURI(slug?.at(-1))
  }, [router, title])

  const titleColSpan = useMemo(
    () => 9 - (back ? 1 : 0) - (hamburger ? 2 : 0) - (options ? 1 : 0),
    [router, title]
  )

  console.log("second layout header:", { title, slugTitle })

  return (
    <div className="grid h-full grid-cols-9 items-center">
      {progress && (
        <div className="col-span-12">
          <Progress reverseBg />
        </div>
      )}
      {back && (
        <div className="flex h-full flex-col items-center justify-center">
          <Button iconOnly variant={"ghost"} onClick={() => router.back()}>
            <ArrowRightIcon className="h-6 w-6 text-alpha-white" />
          </Button>
        </div>
      )}
      {hamburger && (
        <div className="flex h-full flex-col items-center justify-center">
          <Button
            iconOnly
            variant={"ghost"}
            onClick={() => setSidebarHamburger(true)}
          >
            <Bars3Icon className="h-6 w-6 text-alpha-white" />
          </Button>
        </div>
      )}
      <div className={clsx("h-full py-3.5", `col-span-${titleColSpan}`)}>
        {title && (
          <div className="h-full">
            {title.type === "image" ? (
              <div className="relative mx-auto h-full">
                <Image
                  alt={"vardast"}
                  className="mx-auto h-full w-full object-contain"
                  fill
                  src={title.value ?? logo}
                />
              </div>
            ) : (
              <h2 className="line-clamp-1 text-center !text-lg font-bold text-alpha-white">
                {title?.value ?? slugTitle ?? "وردست"}
              </h2>
            )}
          </div>
        )}
      </div>
      {options && (
        <div className="flex h-full flex-col items-center justify-center py-2"></div>
      )}
    </div>
  )
}

export default MobileHeader
