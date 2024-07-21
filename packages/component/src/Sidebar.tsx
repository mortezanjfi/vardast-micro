"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useClickOutside } from "@mantine/hooks"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UserType } from "@vardast/graphql/generated"
import { _authentication_profile_wallet } from "@vardast/lib/constants"
import sidebar_options from "@vardast/lib/sidebar_options"
import { LayoutContext } from "@vardast/provider/LayoutProvider"
import { ILayoutDesktopSidebar } from "@vardast/type/layout"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import { LucideChevronLeft } from "lucide-react"
import { Session } from "next-auth"
import useTranslation from "next-translate/useTranslation"

import DynamicHeroIcon from "./DynamicHeroIcon"
import Link from "./Link"
import Navigation from "./Navigation"
import Progress from "./Progress"

export const SidebarProfile = ({ session }: { session: Session }) => {
  const { t } = useTranslation()
  const wallet =
    session?.type === UserType.Legal
      ? session?.profile?.legal?.wallet
      : session?.profile?.wallet
  return (
    session?.profile?.status && (
      <section className="app-navigation-section">
        <ol className="app-navigation-section-list">
          <li className="app-navigation-item flex items-center justify-between">
            <span className="not-hover">
              <Link className="app-navigation-item-link" href={"/profile/info"}>
                <span className="flex">
                  <div className="flex flex-1 flex-col gap-y-1">
                    {session?.profile?.fullName &&
                    session?.profile?.fullName !== "null null" ? (
                      <h4 className="font-semibold">{`${session?.profile?.fullName} (${session?.type === UserType.Legal ? session?.profile?.legal?.name_company ?? " - " : t("common:real")})`}</h4>
                    ) : (
                      "کاربر وردست"
                    )}
                    <p className="text-sm font-semibold text-alpha-400">
                      {session?.profile?.cellphone
                        ? digitsEnToFa(session?.profile?.cellphone)
                        : digitsEnToFa("09123456789")}
                    </p>
                  </div>
                  <Button className="app-navigation-item-arrow my-auto" noStyle>
                    <LucideChevronLeft className="h-full w-full" />
                  </Button>
                </span>
              </Link>
            </span>
          </li>
          <li className="app-navigation-item flex items-center justify-between">
            <span className="not-hover">
              <div className="app-navigation-item-link">
                <DynamicHeroIcon
                  icon={_authentication_profile_wallet.icon}
                  className={clsx(
                    "icon",
                    _authentication_profile_wallet.background_color,
                    _authentication_profile_wallet.color
                  )}
                />
                <span>
                  {"کیف پول"}
                  <div className="app-navigation-item-arrow flex !w-auto items-center gap-1">
                    <span>{digitsEnToFa(addCommas(wallet || 0))}</span>
                    <span className="text-sm">تومان</span>
                  </div>
                </span>
              </div>
            </span>
          </li>
        </ol>
      </section>
    )
  )
}

const Sidebar = ({
  menus_name,
  profile,
  withHeader
}: ILayoutDesktopSidebar & { withHeader?: boolean }) => {
  const [mount, setMount] = useState(false)
  const { sidebarAtom, sidebarHamburgerAtom } = useContext(LayoutContext)
  const innerComponentSidebar: ReactNode = useAtomValue(sidebarAtom)
  const [open, setOpen] = useAtom(sidebarHamburgerAtom)
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
      <aside
        ref={ref}
        className={clsx(
          "app-sidebar",
          open && "open",
          withHeader && "app-sidebar-has-header"
        )}
      >
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
                  {menus_name && (
                    <Navigation
                      menus={sidebar_options[menus_name]}
                      withLogin
                      withProfile={profile}
                    />
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
