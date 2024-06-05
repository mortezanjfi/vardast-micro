/* eslint-disable no-unused-vars */
"use client"

import { useMemo } from "react"
import Image from "next/image"
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  InformationCircleIcon,
  NewspaperIcon,
  PhoneIcon as PhoneIconOutline,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline"
import { UserCircleIcon } from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import {
  StatusUserAlternatives,
  UserStatusItem
} from "@vardast/component/desktop/DesktopHeader"
import Link from "@vardast/component/Link"
import { ColorEnum } from "@vardast/type/Enums"
import clsx from "clsx"
import { useSession } from "next-auth/react"

enum ProfileIconVariantStatusEnum {
  ACTIVE_WHITE = ColorEnum.ALPHA,
  ACTIVE_ALPHA = ColorEnum.ALPHA,
  SUCCESS = ColorEnum.SUCCESS,
  ERROR = ColorEnum.ERROR,
  WARNING = ColorEnum.WARNING
}

enum ProfileIconVariantTypeEnum {
  BIG = "BIG",
  SMALL = "SMALL"
}

type HeroIcon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined
    titleId?: string | undefined
  } & React.RefAttributes<SVGSVGElement>
>

interface IconProps {
  href: string
  Icon: HeroIcon
  color: ColorEnum
  text: string
  disabled?: boolean
  onClick?: (_?: any) => void
}

interface BigSmallIconProps extends IconProps {
  id: number
  status: ProfileIconVariantStatusEnum
}

const _small_icons: BigSmallIconProps[] = [
  {
    id: 0,
    text: "قوانین و مقررات",
    href: "/privacy",
    Icon: NewspaperIcon,
    color: ColorEnum.ALPHA,
    status: ProfileIconVariantStatusEnum.ACTIVE_ALPHA
  },
  {
    id: 1,
    text: "درباره ما",
    href: "/about",
    Icon: InformationCircleIcon,
    color: ColorEnum.ALPHA,
    status: ProfileIconVariantStatusEnum.ACTIVE_ALPHA
  },
  {
    id: 5,
    text: "تماس با ما",
    href: "/contact",
    Icon: PhoneIconOutline,
    color: ColorEnum.ALPHA,
    status: ProfileIconVariantStatusEnum.ACTIVE_ALPHA
  },
  {
    id: 5,
    text: "سوالات متداول",
    href: "/faq",
    Icon: QuestionMarkCircleIcon,
    color: ColorEnum.ALPHA,
    status: ProfileIconVariantStatusEnum.ACTIVE_ALPHA
  }
]

interface IProfileIconItem extends IconProps {
  variant: {
    type: ProfileIconVariantTypeEnum
    status: ProfileIconVariantStatusEnum
  }
}

const ProfileIconItem = ({
  text,
  href,
  Icon,
  variant,
  disabled,
  onClick
}: IProfileIconItem) => {
  return (
    <Link
      onClick={onClick}
      href={href}
      prefetch={false}
      className="flex w-full items-center justify-start gap-x-4 py-5"
    >
      <div
        className={clsx(
          "flex flex-col items-center justify-center rounded-full"
          // variant.type === ProfileIconVariantTypeEnum.BIG
          //   ? `bg-${ColorEnum[color].toLocaleLowerCase()}-${
          //       disabled ? "100" : "600"
          //     } p-5`
          //   : `bg-${ColorEnum[color].toLocaleLowerCase()}-${
          //       disabled ? "200" : "100"
          //     }`
        )}
      >
        <Icon
          className={clsx(
            variant.type === ProfileIconVariantTypeEnum.BIG
              ? "h-7 w-7 text-alpha-white"
              : `text-${ColorEnum[variant.status].toLocaleLowerCase()}-${
                  disabled ? "400" : "600"
                } h-7 w-7`
          )}
        />
      </div>
      <p
        className={clsx(
          "text-center text-sm font-semibold",
          `text-${ColorEnum[variant.status].toLocaleLowerCase()}-${
            disabled ? "400" : "600"
          }`
        )}
      >
        {text}
      </p>
    </Link>
  )
}

const _small_logout_icons = {
  id: 6,
  text: "خروج از حساب کاربری",
  href: "/auth/signout",
  color: ColorEnum.ERROR,
  Icon: ArrowLeftStartOnRectangleIcon,
  status: ProfileIconVariantStatusEnum.ERROR
}

const _small_signin_icons = {
  id: 5,
  text: "ورود به حساب کاربری",
  href: "/auth/signin/profile",
  Icon: ArrowRightEndOnRectangleIcon,
  color: ColorEnum.SUCCESS,
  status: ProfileIconVariantStatusEnum.SUCCESS
}

const ProfileIndex = () => {
  const { data: session, status } = useSession()

  const profileIcons = useMemo(() => {
    const temp = [..._small_icons]
    if (status !== "loading") {
      if (status === "authenticated") {
        temp.push(_small_logout_icons)
      }
      if (status === "unauthenticated") {
        temp.push(_small_signin_icons)
      }
    }
    return temp
  }, [session, status])

  return (
    <>
      {session?.profile?.status && (
        <div className="flex flex-col gap-y border-b bg-alpha-white px">
          <div className="flex items-center pb">
            <div className="flex flex-1 items-center gap-x-2">
              <UserCircleIcon className="h-16 w-16 text-primary" />
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
            <UserStatusItem
              {...StatusUserAlternatives[session?.profile?.status]}
            />
          </div>
        </div>
      )}

      <div className="bg-alpha-white">
        <Link
          href={process.env.NEXT_PUBLIC_SELLER_VARDAST as string}
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

      <div className="flex w-full flex-col items-start justify-start divide-y bg-alpha-white px-3.5">
        <div className="border-t"></div>
        {profileIcons.map(({ id, status, ...props }) => (
          <ProfileIconItem
            key={id}
            variant={{
              type: ProfileIconVariantTypeEnum.SMALL,
              status
            }}
            {...props}
          />
        ))}
      </div>
    </>
  )
}

export default ProfileIndex
