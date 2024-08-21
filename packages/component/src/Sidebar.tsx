"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useClickOutside } from "@mantine/hooks"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { useRefreshUserMutation, UserType } from "@vardast/graphql/generated"
import { _authentication_profile_wallet } from "@vardast/lib/constants"
import sidebar_options from "@vardast/lib/sidebar_options"
import { LayoutContext } from "@vardast/provider/LayoutProvider"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ILayoutDesktopSidebar } from "@vardast/type/layout"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import { LucideChevronLeft } from "lucide-react"
import { useSession } from "next-auth/react"

import LegalAddConfirmModal from "./admin/legal/LegalAddConfirmModal"
import LegalModal from "./admin/legal/LegalModal"
import DynamicHeroIcon from "./DynamicHeroIcon"
import Link from "./Link"
import Navigation from "./Navigation"
import Progress from "./Progress"
import { LegalModalEnum } from "./type"

export const SidebarProfile = () => {
  const { data: session, update, status } = useSession()
  const [modals, onChangeModals, onCloseModals] = useModals<LegalModalEnum>()

  const refreshUserMutation = useRefreshUserMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: async (data) => {
        await update({ ...session, ...data.refresh })
      }
    }
  )

  const wallet =
    session?.type === UserType.Legal
      ? session?.profile?.legal?.wallet
      : session?.profile?.wallet

  return (
    session?.profile?.status && (
      <>
        <LegalAddConfirmModal
          open={modals?.type === LegalModalEnum.MESSAGE}
          onChangeModals={() => {
            onChangeModals({
              type: LegalModalEnum.ADD,
              data: { cellphone: session?.profile?.cellphone }
            })
          }}
          onCloseModals={onCloseModals}
        />
        <LegalModal
          onCloseModals={(data) => {
            onCloseModals()
            if (data) {
              refreshUserMutation.mutate({
                refreshInput: {
                  accessToken: session?.accessToken,
                  refreshToken: session?.refreshToken,
                  type: UserType.Legal
                }
              })
            }
          }}
          modals={modals}
          open={modals?.type === LegalModalEnum.ADD}
        />
        <section className="app-navigation-section">
          <ol className="app-navigation-section-list">
            <li className="app-navigation-item flex items-center justify-between">
              <div className="w-full p-4">
                <ToggleGroup
                  className="grid grid-cols-2 rounded-md bg-alpha-50 p-1"
                  type="single"
                  value={session?.type}
                  onValueChange={(value: UserType) => {
                    if (value) {
                      if (
                        value === UserType.Legal &&
                        !session?.profile?.legal
                      ) {
                        onChangeModals({
                          type: LegalModalEnum.MESSAGE
                        })
                      } else if (value !== session?.type) {
                        refreshUserMutation.mutate({
                          refreshInput: {
                            accessToken: session?.accessToken,
                            refreshToken: session?.refreshToken,
                            type: value
                          }
                        })
                      }
                    }
                  }}
                  defaultValue={UserType.Real}
                >
                  <ToggleGroupItem
                    disabled={
                      status === "loading" || refreshUserMutation.isLoading
                    }
                    className={clsx(
                      "bg-inherit py-2 text-base text-alpha-500",
                      session?.type === UserType.Real &&
                        "sha !bg-alpha-white !text-alpha-800  shadow-lg"
                    )}
                    value={UserType.Real}
                  >
                    حقیقی
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    disabled={
                      status === "loading" || refreshUserMutation.isLoading
                    }
                    className={clsx(
                      "bg-inherit py-2 text-base text-alpha-500",
                      session?.type === UserType.Legal &&
                        "sha !bg-alpha-white !text-alpha-800 shadow-lg"
                    )}
                    value={UserType.Legal}
                  >
                    حقوقی
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </li>
            <li className="app-navigation-item flex items-center justify-between">
              <span className="not-hover">
                <Link
                  className="app-navigation-item-link"
                  href={"/profile/info"}
                >
                  <span className="flex">
                    <div className="flex flex-1 flex-col gap-y-1">
                      {session?.type === UserType.Real ? (
                        <h4>
                          {" "}
                          {session?.profile?.fullName
                            ? session?.profile?.fullName
                            : "کاربر وردست"}
                        </h4>
                      ) : (
                        <h4>{session?.profile?.legal?.name_company}</h4>
                      )}
                      {/* {session?.profile?.fullName &&
                    session?.profile?.fullName !== "null null" ? (
                      <h4 className="font-semibold">{`${session?.profile?.fullName} (${session?.type === UserType.Legal ? session?.profile?.legal?.name_company ?? " - " : t("common:real")})`}</h4>
                    ) : (
                      "کاربر وردست"
                    )} */}
                      <p className="text-sm font-semibold text-alpha-400">
                        {session?.type === UserType.Real
                          ? digitsEnToFa(session?.profile?.cellphone)
                          : session?.profile?.legal?.position}
                        {/* {session?.profile?.cellphone
                        ? digitsEnToFa(session?.profile?.cellphone)
                        : digitsEnToFa("09123456789")} */}
                      </p>
                    </div>
                    <Button
                      className="app-navigation-item-arrow my-auto"
                      noStyle
                    >
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
      </>
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
