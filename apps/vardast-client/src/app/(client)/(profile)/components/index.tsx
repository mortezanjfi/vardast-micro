/* eslint-disable no-unused-vars */
"use client"

import { useRef } from "react"
import Image from "next/image"
import {
  InformationCircleIcon,
  NewspaperIcon,
  PencilSquareIcon,
  PhoneIcon as PhoneIconOutline,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline"
import { WalletIcon } from "@heroicons/react/24/solid"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import Navigation from "@vardast/component/Navigation"
import {
  _clientMobileProfileMenu,
  _clientMobileSecondProfileMenu
} from "@vardast/lib/constants"
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
  color,
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

const ProfileIndex = () => {
  const { data: session, status: sessionStatus } = useSession()
  const productContainerRef = useRef<HTMLAnchorElement>(null)

  return (
    <div className="app-navigation flex w-full flex-col divide-y-2 divide-alpha-50 pt-0">
      {/* <div
        className={clsx(
          "flex h-full flex-col !gap-0 divide-y-8 divide-alpha-50"
        )}
      > */}
      {session?.profile?.status && (
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
      <div className="flex flex-col bg-alpha-white px-6">
        <div className="app-navigation-container bg-alpha-white">
          <Navigation menus={_clientMobileProfileMenu} />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="app-navigation-container !border-t-0 bg-alpha-white px-6">
          <Navigation menus={_clientMobileSecondProfileMenu} />
        </div>

        <div className="bg-alpha-white py-5">
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
      </div>
    </div>
  )
}

export default ProfileIndex
