"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { BookmarkIcon } from "@heroicons/react/24/outline"
import {
  ArrowRightIcon,
  EllipsisVerticalIcon,
  ShareIcon
} from "@heroicons/react/24/solid"
import logo from "@vardast/asset/logo-horizontal-v2-persian-dark-bg-white.svg"
import { toast } from "@vardast/hook/use-toast"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import copy from "copy-to-clipboard"

export interface IModalHeader {
  title?: string
  hasFavorite?: {}
  hasShare?: boolean
  hasLogo?: boolean
  hasBack?: boolean
}

const MobileHeader: React.FC<IModalHeader> = ({
  title,
  hasFavorite,
  hasShare,
  hasLogo,
  hasBack
}) => {
  const router = useRouter()
  const handleOnClick = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          url: window.location.href,
          text: title,
          title: "وردست"
        })
      } catch (err) {
        // toast({
        //   description: `${err}`,
        //   duration: 5000,
        //   variant: "danger"
        // })
      }
    } else {
      copy(window.location.href)
      toast({
        description: "کپی شد!",
        duration: 5000,
        variant: "success"
      })
    }
  }

  return (
    <div
      id="mobile-header-navbar"
      className="fixed left-0 right-0 top-0 z-40 w-full bg-primary px-2"
    >
      <div className="grid h-14 grid-cols-9 items-center">
        <div className="flex h-full flex-col items-center justify-center">
          {hasBack && (
            <Button variant={"ghost"} onClick={() => router.back()} iconOnly>
              <ArrowRightIcon className="h-6 w-6 text-alpha-white" />
            </Button>
          )}
        </div>
        <div className="col-span-7 h-full py-3.5">
          <div className="h-full">
            {hasLogo ? (
              <div className="relative mx-auto h-full">
                <Image
                  src={logo}
                  alt={"vardast"}
                  fill
                  className="mx-auto h-full w-full object-contain"
                />
              </div>
            ) : title ? (
              <h2 className="line-clamp-1 text-center !text-lg font-bold text-alpha-white">
                {/* {title.split("-").join(" ")} */}
                {title}
              </h2>
            ) : (
              <div className="relative mx-auto h-full">
                <Image
                  src={logo}
                  alt={"vardast"}
                  fill
                  className="mx-auto h-full w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex h-full flex-col items-center justify-center py-2">
          {(hasShare || hasFavorite) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  iconOnly
                  block
                  className="!m-0 !h-full !p-0"
                >
                  <EllipsisVerticalIcon className="h-7 w-7 text-alpha-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="!min-w-[10px]">
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault
                  }}
                >
                  <div className="flex flex-col gap-y">
                    {hasFavorite && (
                      <Button
                        id="header-back-button"
                        variant={"ghost"}
                        iconOnly
                      >
                        <BookmarkIcon className="h-6 w-6 text-alpha" />
                      </Button>
                    )}
                    {hasShare && (
                      <Button
                        variant={"ghost"}
                        iconOnly
                        onClick={handleOnClick}
                      >
                        <ShareIcon className="h-6 w-6 text-alpha" />
                      </Button>
                    )}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

export default MobileHeader
