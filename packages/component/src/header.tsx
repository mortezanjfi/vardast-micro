"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import logoHorizontal from "@vardast/asset/logo-horizontal-v1-persian-light-bg.svg"
import logoSign from "@vardast/asset/sign.svg"
import clsx from "clsx"

import Link from "./Link"
import Search from "./Search"

interface HeaderProps {
  isMobileView: boolean
}

const Header = ({ isMobileView }: HeaderProps) => {
  const pathname = usePathname()

  if (pathname.split("/")[1] === "profile" || pathname.split("/")[1] === "") {
    return null
  }

  return (
    <>
      {isMobileView && (
        <div
          aria-hidden="true"
          className="h-[calc(64px+env(safe-area-inset-bottom))]"
        ></div>
      )}
      <div
        className={clsx([
          "flex flex-col gap-4 border-alpha-200 bg-alpha-50 p-4",
          isMobileView
            ? "fixed bottom-0 left-0 z-50 h-[calc(128px+env(safe-area-inset-bottom))] w-full border-t dark:border-alpha-600 dark:bg-alpha-700"
            : "pb-0 md:pb-4 lg:border-b"
        ])}
      >
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/">
            <div className="relative h-8 lg:h-12">
              <Image
                alt={`${process.env.NEXT_PUBLIC_TITLE} - ${process.env.NEXT_PUBLIC_SLOGAN}`}
                className="hidden h-12 w-auto object-contain lg:block"
                loading="lazy"
                src={logoHorizontal}
              />
              <Image
                alt={`${process.env.NEXT_PUBLIC_TITLE} - ${process.env.NEXT_PUBLIC_SLOGAN}`}
                className="h-8 w-auto object-contain lg:hidden"
                loading="lazy"
                src={logoSign}
              />
            </div>
          </Link>
          <div className="flex-1">
            <Search isMobileView={isMobileView} />
          </div>
        </div>
        {!isMobileView && (
          <div className="flex items-start justify-between">
            {/* <Navigation /> */}
            {/* <LocationSelector /> */}
          </div>
        )}
      </div>
    </>
  )
}

export default Header
