"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { UserCircleIcon } from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import logoHorizontal from "@vardast/asset/logo-horizontal-v2-persian-light-bg.svg"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import { UserStatusesEnum } from "@vardast/graphql/generated"
import clsx from "clsx"
import { useSession } from "next-auth/react"

import Search from "@/app/components/search"

type DesktopHeaderProps = {}

export enum ColorEnum {
  // eslint-disable-next-line no-unused-vars
  ERROR = "ERROR",
  // eslint-disable-next-line no-unused-vars
  SUCCESS = "SUCCESS",
  // eslint-disable-next-line no-unused-vars
  BLACK = "BLACK",
  // eslint-disable-next-line no-unused-vars
  WARNING = "WARNING",
  // eslint-disable-next-line no-unused-vars
  ALPHA = "ALPHA",
  // eslint-disable-next-line no-unused-vars
  INFO = "INFO",
  // eslint-disable-next-line no-unused-vars
  RED = "RED"
}

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

const DesktopHeader = (_: DesktopHeaderProps) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  return (
    <header className="sticky right-0 top-0 z-30 border-b bg-alpha-white">
      <div className="container grid grid-cols-12 items-center gap-x-12 px py-7">
        <Link href="/" className="relative col-span-3 flex h-full items-center">
          <Image
            src={logoHorizontal}
            alt={`وردست`}
            className="w-auto object-contain"
            priority
          />
        </Link>
        <div className="col-span-4 h-full">
          <Search isMobileView={false} />
        </div>
        <div className="col-span-5 flex h-full justify-end gap-x">
          {status === "loading" ? (
            <Loading hideMessage />
          ) : (
            <>
              {!!session?.profile ? (
                <>
                  <div className="flex flex-col gap-y bg-alpha-white px-6">
                    <div className="flex items-center gap-x-4">
                      <div className="flex flex-1 items-center gap-x-2">
                        <UserCircleIcon className="h-12 w-12 text-primary" />
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
                    </div>
                  </div>
                  {session?.profile.roles.some(
                    (role) => role?.name === "seller"
                  ) ? (
                    <div className="flex flex-col justify-center">
                      <Link
                        href={process.env.NEXT_PUBLIC_SELLER_VARDAST as string}
                        className="btn btn-primary"
                      >
                        پنل فروش
                      </Link>
                    </div>
                  ) : (
                    session?.profile.roles.some(
                      (role) => role?.name === "admin"
                    ) && (
                      <div className="flex flex-col justify-center">
                        <Link href="/admin" className="btn btn-primary">
                          پنل ادمین
                        </Link>
                      </div>
                    )
                  )}
                  <div className="flex flex-col justify-center">
                    <Link href="/auth/signout" className="btn btn-primary">
                      خروج
                    </Link>
                  </div>
                </>
              ) : (
                <Link
                  href={`/auth/signin${pathname}`}
                  className="btn btn-primary"
                >
                  ورود به حساب کاربری
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default DesktopHeader
