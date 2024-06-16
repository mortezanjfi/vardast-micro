"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { WalletIcon } from "@heroicons/react/24/solid"
import { useClickOutside } from "@mantine/hooks"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UserType } from "@vardast/graphql/generated"
import sidebar_options from "@vardast/lib/sidebar_options"
import { LayoutContext } from "@vardast/provider/LayoutProvider"
import { ILayoutDesktopSidebar } from "@vardast/type/layout"
import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"

import Link from "./Link"
import Navigation from "./Navigation"
import Progress from "./Progress"

export const SidebarProfile = ({ session }: { session: Session }) => {
  const wallet =
    session?.type === UserType.Legal
      ? session?.profile?.legal?.wallet
      : session?.profile?.wallet
  return (
    session?.profile?.status && (
      <ol className="app-navigation-section">
        <li className="app-navigation-item flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            {session?.profile?.fullName &&
            session?.profile?.fullName !== "null null" ? (
              <h4 className="font-semibold">{session?.profile?.fullName}</h4>
            ) : (
              "کاربر وردست"
            )}
            <p className="text-sm font-semibold text-alpha-400">
              {session?.profile?.cellphone
                ? digitsEnToFa(session?.profile?.cellphone)
                : digitsEnToFa("09123456789")}
            </p>
          </div>
          <Link href={"/profile/info"}>
            <PencilSquareIcon height={20} width={20} />
          </Link>
        </li>
        <li className="app-navigation-item flex items-center justify-between">
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
            <span>{digitsEnToFa(addCommas(wallet || 0))}</span>
            <span>تومان</span>
          </div>
        </li>
      </ol>
    )
  )
}

const Sidebar = ({ menus_name, profile }: ILayoutDesktopSidebar) => {
  const [mount, setMount] = useState(false)
  const { sidebarAtom, sidebarHamburgerAtom } = useContext(LayoutContext)
  const innerComponentSidebar: ReactNode = useAtomValue(sidebarAtom)
  const [open, setOpen] = useAtom(sidebarHamburgerAtom)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const ref = useClickOutside(() => {
    if (open) {
      setOpen(false)
    }
  })

  useEffect(() => {
    setOpen(false)
  }, [setOpen, pathname, searchParams])

  useEffect(() => {
    setMount(true)
  }, [])

  return (
    <>
      {open && (
        <div className="pointer-events-none fixed inset-0 z-50 h-full w-full bg-alpha-800 bg-opacity-80"></div>
      )}
      <aside ref={ref} className={clsx("app-sidebar", open && "open")}>
        {/* {open && (
          <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-end">
            <Button
              className="mr-auto"
              variant={"ghost"}
              onClick={() => setOpen(false)}
              iconOnly
            >
              <LucideX className="icon h-6 w-6 text-alpha-black" />
            </Button>
          </div>
        )} */}
        <div className="app-sidebar-inner">
          {open && <Progress />}
          <div className="app-navigation">
            {mount &&
              (innerComponentSidebar ? (
                innerComponentSidebar
              ) : (
                <div className="app-navigation-container">
                  {profile && <SidebarProfile session={session} />}
                  {menus_name && (
                    <Navigation menus={sidebar_options[menus_name]} withLogin />
                  )}
                </div>
              ))}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
