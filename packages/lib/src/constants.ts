import { CubeIcon, Squares2X2Icon } from "@heroicons/react/24/outline"
import {
  ArrowRightStartOnRectangleIcon,
  HomeModernIcon,
  ListBulletIcon,
  PlusCircleIcon
} from "@heroicons/react/24/solid"
import {
  OrderOfferStatuses,
  PaymentMethodEnum,
  PreOrderStates
} from "@vardast/graphql/generated"
import { NavigationItemType } from "@vardast/type/Navigation"
import {
  ISellerDesktopAnalyzeProps,
  ISellerMobileAnalyzeProps
} from "@vardast/type/Seller"
import { BadgeVariantsType } from "@vardast/ui/badge"
import {
  // LucideBookmark,
  LucideGlobe,
  // LucideHome,
  LucideIcon,
  LucidePhoneIncoming
  // LucideUserCircle
} from "lucide-react"

import paths from "./paths"

export const OrderOfferStatusesFa = {
  [OrderOfferStatuses.Closed]: { className: "tag-success", name_fa: "بسته شده" }
}

export const PreOrderStatesFa: Record<
  PreOrderStates,
  { variant: BadgeVariantsType; name_fa_admin: string; name_fa: string }
> = {
  [PreOrderStates.PendingAdmin]: {
    variant: "info",
    name_fa_admin: "در انتظار تایید ادمین",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingInfo]: {
    variant: "info",
    name_fa_admin: "در انتظار دریافت اطلاعات",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingOffer]: {
    variant: "info",
    name_fa_admin: "در انتظار پیشنهاد قیمت",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingProduct]: {
    variant: "info",
    name_fa_admin: "در انتظار افزودن کالا",
    name_fa: "جاری"
  },
  [PreOrderStates.VerifyFile]: {
    variant: "info",
    name_fa_admin: "در انتظار تایید فایل",
    name_fa: "جاری"
  },
  [PreOrderStates.Closed]: {
    variant: "success",
    name_fa_admin: "خریداری شده",
    name_fa: "خریداری شده"
  },
  [PreOrderStates.Completed]: {
    variant: "default",
    name_fa_admin: "خریداری نشده",
    name_fa: "خریداری نشده"
  },
  [PreOrderStates.PendingPayment]: {
    variant: "warning",
    name_fa: "در انتظار پرداخت",
    name_fa_admin: "در انتظار پرداخت"
  },
  [PreOrderStates.Rejected]: {
    variant: "danger",
    name_fa: "رد شده",
    name_fa_admin: "رد شده"
  }
}

export const PaymentMethodEnumFa = {
  [PaymentMethodEnum.Cash]: {
    className: "",
    name_fa: "نقدی"
  },
  [PaymentMethodEnum.Credit]: {
    className: "",
    name_fa: "غیر نقدی"
  }
}

export type NavbarItem = {
  href: string
  Icon: LucideIcon
  ActiveIcon: LucideIcon
  title: string
  id: number
}

export type WithNavigationRouteItem = {
  forceEqual: boolean
  path: string
  dynamicRouteAllow?: boolean
}

export const _authentication_signin_sidebarMenu: NavigationItemType = {
  title: "ورود به حساب کاربری",
  icon: "ArrowLeftEndOnRectangleIcon",
  path: paths.signin,
  background_color: "bg-green-500",
  color: "text-white"
}

export const _authentication_signout_sidebarMenu: NavigationItemType = {
  title: "خروج از حساب کاربری",
  icon: "ArrowLeftStartOnRectangleIcon",
  path: "/auth/signout",
  background_color: "bg-red-500",
  color: "text-white"
}
export const _authentication_profile_sidebarMenu: NavigationItemType = {
  title: "اطلاعات حساب کاربری",
  icon: "UserIcon",
  path: "/profile/info",
  background_color: "bg-green-500",
  color: "text-white"
}

export const _authentication_profile_wallet: NavigationItemType = {
  title: "کیف پول",
  icon: "WalletIcon",
  background_color: "bg-blue-600",
  color: "text-white"
}

export const _about_items = [
  { Icon: LucideGlobe, href: "https://blog.vardast.com", title: "بلاگ" },

  // { Icon: LucideMail, href: "" },

  { Icon: LucidePhoneIncoming, href: "tel:+982187132501", title: "شماره تماس" }

  // { Icon: LucideMapPin, href: "" }
]

export const _seller_menu_item: ISellerMobileAnalyzeProps[] = [
  {
    id: "9",
    Icon: CubeIcon,
    title: "مدیریت کالاهای من",
    href: "/products/my-products"
  },
  {
    id: "5",
    Icon: Squares2X2Icon,
    title: "دسته‌بندی‌های من",
    href: "/categories"
  },
  {
    id: "6",
    Icon: HomeModernIcon,
    title: "برند‌های من",
    href: "/brands"
  },
  {
    id: "4",
    Icon: ListBulletIcon,
    title: "افزودن کالا به لیست من",
    href: "/products/all-products"
  },
  {
    id: "7",
    Icon: PlusCircleIcon,
    title: "افزودن کالای جدید در وردست",
    href: "/products/new"
  },
  {
    id: "8",
    Icon: ArrowRightStartOnRectangleIcon,
    title: "خروج از حساب کاربری",
    href: "/auth/signout"
  }
]
export const _seller_card_Items: ISellerDesktopAnalyzeProps[] = [
  {
    title: "مدیریت کالا",
    Icon: CubeIcon,
    listItems: [
      {
        listText: "لیست کالاهای وردست",
        href: "/products/all-products",
        id: "10/3"
      },
      {
        listText: "ثبت کالای جدید",
        href: "/products/new",
        id: "10/2"
      },
      {
        listText: "مدیریت کالاهای من",
        href: "/products/my-products",
        id: "10/1"
      }
    ],
    id: "10"
  },
  {
    title: "دسته بندی و برند",
    Icon: Squares2X2Icon,
    listItems: [
      {
        listText: "دسته بندی‌های من",
        href: "/categories",
        id: "11/1"
      },
      {
        listText: "برندهای من",
        href: "/brands",
        id: "11/2"
      }
    ],
    id: "11"
  }
]
