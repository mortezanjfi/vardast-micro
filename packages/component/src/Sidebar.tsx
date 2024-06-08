"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { WalletIcon } from "@heroicons/react/24/solid"
import { useClickOutside } from "@mantine/hooks"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import sidebar_options from "@vardast/lib/sidebar_options"
import { LayoutContext } from "@vardast/provider/LayoutProvider"
import { ILayoutDesktopSidebar } from "@vardast/type/layout"
import clsx from "clsx"
import { useAtomValue } from "jotai"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"

import Link from "./Link"
import Navigation from "./Navigation"

const SidebarProfile = ({ session }: { session: Session }) => {
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
            <div className="rounted-lg bg-blue-600 p-2">
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
        </li>
      </ol>
    )
  )
}

const Sidebar = ({ menus_name, profile }: ILayoutDesktopSidebar) => {
  const [mount, setMount] = useState(false)
  const { sidebarAtom } = useContext(LayoutContext)
  const innerComponentSidebar: ReactNode = useAtomValue(sidebarAtom)
  const [open, setOpen] = useState(false)
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
    <aside ref={ref} className={clsx("app-sidebar", open && "open")}>
      <div className="app-sidebar-inner">
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
  )
}

export default Sidebar
