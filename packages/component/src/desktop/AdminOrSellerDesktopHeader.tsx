"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { UserIcon } from "@heroicons/react/24/outline"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import logoHorizontal from "@vardast/asset/logo-horizontal-v2-persian-light-bg.svg"
import { UserStatusesEnum } from "@vardast/graphql/generated"
import paths from "@vardast/lib/paths"
import { ColorEnum } from "@vardast/type/Enums"
import { Avatar, AvatarFallback, AvatarImage } from "@vardast/ui/avatar"
import clsx from "clsx"
import { useSession } from "next-auth/react"

import Link from "../Link"
import Loading from "../Loading"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "../navigation-menu"
import Search from "../Search"

type AdminOrSellerDesktopHeaderProps = {}

export const StatusUserAlternatives = {
  [UserStatusesEnum.NotActivated]: {
    color: ColorEnum.ERROR,
    text: "غیر فعال"
  },
  [UserStatusesEnum.Active]: { color: ColorEnum.SUCCESS, text: "فعال" },
  [UserStatusesEnum.Banned]: { color: ColorEnum.ALPHA, text: "مسدود شده" }
}

export const UserStatusItem = ({
  color,
  text
}: {
  text: string
  color: ColorEnum
}) => {
  return (
    <div
      className={clsx(
        `bg-${color.toLocaleLowerCase()}-100`,
        "rounded-2xl",
        "px-2 py-1"
      )}
    >
      <p className={`text-${color.toLocaleLowerCase()}-600`}>{text}</p>
    </div>
  )
}

const AdminOrSellerDesktopHeader = (_: AdminOrSellerDesktopHeaderProps) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-header border-b bg-alpha-white px-6 sm:px-0">
      <div className="container grid grid-cols-12 grid-rows-2 items-center gap-y py-7 md:grid-rows-1 md:gap-x-12">
        <Link
          className="relative col-span-4 row-start-1 flex h-full items-center md:col-span-3 lg:col-span-3"
          href="/"
          prefetch={false}
        >
          <Image
            alt={`وردست`}
            className="w-auto object-contain lg:h-12"
            priority
            src={logoHorizontal}
          />
        </Link>
        <div className="col-span-12 row-start-2 h-full rounded ring-1 ring-alpha-200 md:col-span-4 md:row-start-1 lg:col-span-6">
          <Search isMobileView={false} />
        </div>
        <div className="col-span-7 col-start-6 row-start-1 grid h-full grid-cols-2 justify-end gap-x-6 md:col-span-5 md:col-start-auto lg:col-span-3">
          {status === "loading" ? (
            <div className="col-span-2 flex h-full items-center justify-center">
              <Loading hideMessage />
            </div>
          ) : (
            <div className="col-span-2 grid grid-cols-4 gap-x md:gap-x-6">
              {status === "authenticated" && !!session?.profile && (
                <div className=""></div>
              )}

              <div></div>
              <div></div>
              {status === "authenticated" && !!session?.profile ? (
                <div className="h-full">
                  <NavigationMenu className="h-full !max-w-full !justify-end">
                    <NavigationMenuList className="flex h-full w-full">
                      <NavigationMenuItem className="flex w-full flex-1 items-center">
                        <UserIcon className="h-8 w-8" />
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className="!px-0"
                          onPointerLeave={(event) => event.preventDefault()}
                          onPointerMove={(event) => event.preventDefault()}
                        ></NavigationMenuTrigger>
                        <NavigationMenuContent
                          onPointerLeave={(event) => event.preventDefault()}
                          onPointerMove={(event) => event.preventDefault()}
                        >
                          <div className="bg-alpha-white py-4">
                            <NavigationMenuLink>
                              <div className="flex items-center gap-2 px-4 py-2">
                                <Avatar className="rounded-full border border-secondary">
                                  <AvatarImage
                                    alt="seller"
                                    src={
                                      session?.profile?.avatarFile
                                        ?.url
                                    }
                                  />

                                  <AvatarFallback>
                                    {session?.profile?.firstName &&
                                      session?.profile?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  {session?.profile?.fullName &&
                                  session?.profile?.fullName !== "null null" ? (
                                    <h4 className="truncate font-semibold">
                                      {session?.profile?.fullName}
                                    </h4>
                                  ) : (
                                    "کاربر وردست"
                                  )}
                                  <p className="text-sm font-semibold text-alpha-400">
                                    {session?.profile?.cellphone
                                      ? digitsEnToFa(
                                          session?.profile?.cellphone
                                        )
                                      : digitsEnToFa("09123456789")}
                                  </p>
                                </div>
                              </div>
                            </NavigationMenuLink>
                            <NavigationMenuLink className="flex w-full justify-start text-nowrap bg-alpha-white px-4 py-2 md:z-50">
                              <Link
                                className="btn !text-error"
                                href="/auth/signout"
                                prefetch={false}
                              >
                                خروج از حساب کاربری
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              ) : (
                <Link
                  className="btn btn-primary col-span-2 flex text-sm font-semibold"
                  href={`${paths.signin}?ru=${pathname}`}
                >
                  ورود
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminOrSellerDesktopHeader
