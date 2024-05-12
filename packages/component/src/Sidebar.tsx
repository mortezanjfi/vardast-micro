"use client"

import { Dispatch, Suspense, useEffect, useRef } from "react"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline"
import { WalletIcon } from "@heroicons/react/24/solid"
import { useClickOutside } from "@mantine/hooks"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import logo from "@vardast/asset/logo-horizontal-v2-persian-light-bg.svg"
import { NavigationType } from "@vardast/type/Navigation"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { SetStateAction } from "jotai"
import { signIn, signOut, useSession } from "next-auth/react"

import Link from "./Link"
import Navigation from "./Navigation"
import UserMenu from "./UserMenu"

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
  const { data: session } = useSession()
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
          "app-sidebar bg-alpha-white",
          open ? "open z-50" : "",
          isUserProfile && "z-20 overflow-hidden rounded-2xl border"
        )}
      >
        <div className="app-sidebar-inner">
          {/* <SpacesBar /> */}
          <div className="app-navigation">
            <div
              className={clsx(
                "flex h-full flex-col gap-9 px-4",
                isUserProfile && " !gap-0 divide-y-8 divide-alpha-50 md:px-0",
                isAdmin && "justify-between"
              )}
            >
              {/* <OrganizationMenu /> */}
              {!isAdmin && !isUserProfile && (
                <>
                  <div>
                    <Image src={logo} alt={`وردست`} />
                  </div>
                  <hr />
                </>
              )}
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
                    <Link href={"/profile/info"}>
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
              <div className="flex flex-col px-6 py">
                <div className="app-navigation-container bg-alpha-white">
                  <Navigation menus={menus} />
                </div>{" "}
                {isUserProfile && (
                  <div className="flex flex-col gap-1">
                    {/* <Button
                  onClick={() => toggleTeheme()}
                  variant="ghost"
                  className="justify-start text-start"
                >
                  <>
                    {theme === "dark" ? (
                      <LucideSun className="icon" />
                    ) : (
                      <LucideMoon className="icon" />
                    )}
                    {theme === "dark"
                      ? t("common:switch_dark_mode_off")
                      : t("common:switch_dark_mode_on")}
                  </>
                </Button> */}
                    {session ? (
                      <Button
                        onClick={() =>
                          signOut({
                            callbackUrl:
                              process.env.NEXT_PUBLIC_PROJECT_NAME_FOR ===
                              "seller"
                                ? "/"
                                : "/profile"
                          })
                        }
                        variant="ghost"
                        className="justify-start !px-0.5 text-start"
                      >
                        <>
                          <ArrowLeftStartOnRectangleIcon className="icon" />
                          خروج از حساب کاربری
                        </>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => signIn()}
                        variant="ghost"
                        className="justify-start !px-0.5 text-start !text-success"
                      >
                        <ArrowRightEndOnRectangleIcon className="icon" />
                        ورود به حساب کاربری
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* admin side bar */}
              {isAdmin && (
                <Suspense>
                  <UserMenu />
                </Suspense>
              )}
              {isUserProfile && (
                <div className="bg-alpha-white px-6 pt">
                  <Link
                    href={process.env.NEXT_PUBLIC_SELLER_VARDAST as string}
                    ref={productContainerRef}
                    className={`relative flex flex-shrink-0 transform flex-col items-center justify-center rounded-xl bg-center bg-no-repeat align-middle transition-all duration-1000 ease-out`}
                  >
                    <div className="w-full">
                      <Image
                        src={"/images/be-seller.png"}
                        alt={"be-seller"}
                        width={360}
                        height={120}
                        className="h-full w-full rounded-xl"
                      />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
