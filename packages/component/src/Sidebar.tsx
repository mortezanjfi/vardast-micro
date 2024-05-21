"use client"

import { Dispatch, useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline"
import { WalletIcon } from "@heroicons/react/24/solid"
import { useClickOutside } from "@mantine/hooks"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { NavigationType } from "@vardast/type/Navigation"
import clsx from "clsx"
import { SetStateAction } from "jotai"
import { useSession } from "next-auth/react"

import Link from "./Link"
import Navigation from "./Navigation"

type SidebarProps = {
  isUserProfile?: boolean
  open: boolean
  onOpenChanged: Dispatch<SetStateAction<boolean>>
  menus: NavigationType[]
  isAdmin: boolean
}

const Sidebar = ({
  menus,
  open,
  onOpenChanged,
  isAdmin,
  isUserProfile
}: SidebarProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session, status: sessionStatus } = useSession()
  // const [isOpen, setIsOpen] = useState<boolean>(false)
  const productContainerRef = useRef<HTMLAnchorElement>(null)
  const ref = useClickOutside(() => {
    if (open) {
      onOpenChanged(false)
      // setIsOpen(false)
    }
  })

  useEffect(() => {
    onOpenChanged(false)
    // setIsOpen(false)
  }, [onOpenChanged, pathname, searchParams])

  return (
    <>
      {open && (
        <div className="pointer-events-none fixed inset-0 z-50 h-full w-full bg-alpha-800 bg-opacity-40"></div>
      )}
      <div
        ref={ref}
        className={clsx(
          "app-sidebar z-20 overflow-hidden rounded-2xl border bg-alpha-white",
          open ? "open z-50" : ""
        )}
      >
        <div className="app-sidebar-inner">
          {/* <SpacesBar /> */}
          <div className="app-navigation">
            <div
              className={clsx(
                "flex h-full flex-col !gap-0 divide-y-8 divide-alpha-50 px-4 md:px-0"
              )}
            >
              {isUserProfile && session?.profile?.status && (
                <div className="flex flex-col divide-y bg-alpha-white px-6">
                  <div className="flex items-center py-5">
                    <div className="flex flex-1 items-center gap-x-2">
                      {/* {isMobileView && (
                          <UserCircleIcon className="h-16 w-16 text-primary" />
                        )} */}
                      <div className="flex flex-col gap-y-1">
                        {session?.profile?.fullName &&
                        session?.profile?.fullName !== "null null" ? (
                          <h4 className="font-semibold">
                            {session?.profile?.fullName}
                          </h4>
                        ) : (
                          "کاربر وردست"
                        )}
                        <p className="text-sm font-semibold text-alpha-400">
                          {session?.profile?.cellphone
                            ? digitsEnToFa(session?.profile?.cellphone)
                            : digitsEnToFa("09123456789")}
                        </p>
                      </div>
                    </div>
                    <Link prefetch={false} href={"/profile/info"}>
                      <PencilSquareIcon height={20} width={20} />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between py-5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-blue-600 p-2">
                        <WalletIcon
                          width={24}
                          height={24}
                          className="text-alpha-white"
                          color="alpha-white"
                        />
                      </div>
                      <span>کیف پول</span>
                    </div>
                    <div className="text-alph-500 flex items-center gap-1">
                      <span>{digitsEnToFa(addCommas(0))}</span>
                      <span>تومان</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col px-6">
                <div className="app-navigation-container bg-alpha-white">
                  <Navigation menus={menus} />
                </div>{" "}
                <div className="flex flex-col gap-1 border-b px-2">
                  {sessionStatus !== "loading" &&
                    (session ? (
                      <Link
                        prefetch={false}
                        href="/auth/signout"
                        className="btn-ghost btn justify-start !px-0.5 text-start"
                      >
                        <ArrowLeftStartOnRectangleIcon
                          width={24}
                          height={24}
                          className="icon"
                        />
                        خروج از حساب کاربری
                      </Link>
                    ) : (
                      <Link
                        prefetch={false}
                        href="/auth/signin"
                        className="btn-ghost btn justify-start !px-0.5 text-start !text-success"
                      >
                        <ArrowRightEndOnRectangleIcon
                          width={24}
                          height={24}
                          className="icon"
                        />
                        ورود به حساب کاربری
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
