"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { useClickOutside } from "@mantine/hooks"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UserType } from "@vardast/graphql/generated"
import { _authentication_profile_wallet } from "@vardast/lib/constants"
import sidebar_options from "@vardast/lib/sidebar_options"
import { LayoutContext } from "@vardast/provider/LayoutProvider"
import { ILayoutDesktopSidebar } from "@vardast/type/layout"
import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import { Session } from "next-auth"
import useTranslation from "next-translate/useTranslation"

import DynamicIcon from "./DynamicIcon"
import Link from "./Link"
import { MotionSection } from "./motion/Motion"
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
      <MotionSection
        variants={{
          hidden: { opacity: 0, y: 0, x: 0, scale: 0 },
          enter: { opacity: 1, y: 0, x: 0, scale: 1 },
          exit: { opacity: 0, y: 0, x: 0, scale: 0 } // Add exit variant for completeness
        }}
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: "linear", delay: 0.2 }} // Set the transition to linear with a delay of 0.5 seconds
        className="app-navigation-section"
      >
        <ol className="app-navigation-section-list">
          <li className="app-navigation-item flex items-center justify-between">
            <span className="not-hover">
              <div className="app-navigation-item-link">
                <span className="flex">
                  <div className="flex flex-1 flex-col gap-y-1">
                    {session?.profile?.fullName &&
                    session?.profile?.fullName !== "null null" ? (
                      <h4 className="font-semibold">{`${session?.profile?.fullName} (${session?.type === UserType.Legal ? t("common:legal") : t("common:real")})`}</h4>
                    ) : (
                      "کاربر وردست"
                    )}
                    <p className="text-sm font-semibold text-alpha-400">
                      {session?.profile?.cellphone
                        ? digitsEnToFa(session?.profile?.cellphone)
                        : digitsEnToFa("09123456789")}
                    </p>
                  </div>
                  <Link className="my-auto" href={"/profile/info"}>
                    <PencilSquareIcon height={20} width={20} />
                  </Link>
                </span>
              </div>
            </span>
          </li>
          <li className="app-navigation-item flex items-center justify-between">
            <span className="not-hover">
              <div className="app-navigation-item-link">
                <DynamicIcon
                  name={_authentication_profile_wallet.icon}
                  className={clsx(
                    "icon",
                    _authentication_profile_wallet.background_color
                  )}
                  color={_authentication_profile_wallet.color}
                  strokeWidth={2}
                />
                <span>
                  {"کیف پول"}
                  <div className="app-navigation-item-arrow flex items-center gap-1">
                    <span>{digitsEnToFa(addCommas(wallet || 0))}</span>
                    <span>تومان</span>
                  </div>
                </span>
              </div>
            </span>
          </li>
        </ol>
      </MotionSection>
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
