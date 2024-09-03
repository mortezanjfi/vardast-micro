import { CubeIcon, Squares2X2Icon } from "@heroicons/react/24/outline"
import {
  ArrowRightStartOnRectangleIcon,
  HomeModernIcon,
  ListBulletIcon,
  PlusCircleIcon
} from "@heroicons/react/24/solid"
import {
  ContactInfoTypes,
  LegalStatusEnum,
  MemberRoles,
  MultiStatuses,
  OrderOfferStatuses,
  PaymentMethodEnum,
  PreOrderStates,
  ProductTypesEnum,
  SellerType,
  ThreeStateSupervisionStatuses,
  UserLanguagesEnum,
  UserStatusesEnum
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

type StatusFaType<T extends string> = Record<
  T,
  { variant: BadgeVariantsType; name_fa: string }
>

export enum HasEntityEnum {
  TRUE = "TRUE",
  FALSE = "FALSE"
}

export const OrderOfferStatusesFa = {
  [OrderOfferStatuses.Closed]: { className: "tag-success", name_fa: "بسته شده" }
}

export const PreOrderStatesFa: StatusFaType<PreOrderStates> = {
  [PreOrderStates.PendingAdmin]: {
    variant: "info",
    name_fa: "در انتظار تایید ادمین"
  },
  [PreOrderStates.PendingInfo]: {
    variant: "info",
    name_fa: "در انتظار دریافت اطلاعات"
  },
  [PreOrderStates.PendingOffer]: {
    variant: "info",
    name_fa: "در انتظار پیشنهاد قیمت"
  },
  [PreOrderStates.PendingProduct]: {
    variant: "info",
    name_fa: "در انتظار افزودن کالا"
  },
  [PreOrderStates.VerifyFile]: {
    variant: "info",
    name_fa: "در انتظار تایید فایل"
  },
  [PreOrderStates.Closed]: {
    variant: "success",
    name_fa: "خریداری شده"
  },
  [PreOrderStates.Completed]: {
    variant: "default",
    name_fa: "خریداری نشده"
  },
  [PreOrderStates.PendingPayment]: {
    variant: "warning",
    name_fa: "در انتظار پرداخت"
  },
  [PreOrderStates.Rejected]: {
    variant: "danger",
    name_fa: "رد شده"
  }
}

export const ThreeStateSupervisionStatusesFa: StatusFaType<ThreeStateSupervisionStatuses> =
  {
    [ThreeStateSupervisionStatuses.Confirmed]: {
      variant: "success",
      name_fa: "تایید شده"
    },
    [ThreeStateSupervisionStatuses.Rejected]: {
      variant: "danger",
      name_fa: "رد شده"
    },
    [ThreeStateSupervisionStatuses.Pending]: {
      variant: "warning",
      name_fa: "در انتظار بررسی"
    }
  }
export const ProductTypesEnumFa: StatusFaType<ProductTypesEnum> = {
  [ProductTypesEnum.Physical]: {
    variant: "default",
    name_fa: "فیزیکی"
  },
  [ProductTypesEnum.Digital]: {
    variant: "default",
    name_fa: "دیجیتالی"
  },
  [ProductTypesEnum.Gift]: {
    variant: "default",
    name_fa: "هدیه"
  },
  [ProductTypesEnum.Bundle]: {
    variant: "default",
    name_fa: "شخصی"
  }
}

export const LegalStatusEnumFa: StatusFaType<LegalStatusEnum> = {
  [LegalStatusEnum.Active]: {
    variant: "success",
    name_fa: "فعال"
  },
  [LegalStatusEnum.Deactive]: {
    variant: "danger",
    name_fa: "غیرفعال"
  }
}

export const SellerTypeFa: StatusFaType<SellerType> = {
  [SellerType.Normal]: {
    variant: "default",
    name_fa: "معمولی"
  },
  [SellerType.Online]: {
    variant: "warning",
    name_fa: "آنلاین"
  },
  [SellerType.Offline]: {
    variant: "secondary",
    name_fa: "آفلاین"
  },
  [SellerType.Extended]: {
    variant: "info",
    name_fa: "افزوده شده"
  }
}

export const VisibilityFa: StatusFaType<HasEntityEnum> = {
  [HasEntityEnum.TRUE]: {
    variant: "success",
    name_fa: "قابل رویت"
  },
  [HasEntityEnum.FALSE]: {
    variant: "danger",
    name_fa: "غیر قابل رویت"
  }
}

export const ActiveNotActiveFa: StatusFaType<HasEntityEnum> = {
  [HasEntityEnum.TRUE]: {
    variant: "success",
    name_fa: "فعال"
  },
  [HasEntityEnum.FALSE]: {
    variant: "danger",
    name_fa: "غیر فعال"
  }
}

export const UserStatusesEnumFa: StatusFaType<UserStatusesEnum> = {
  [UserStatusesEnum.Active]: {
    variant: "success",
    name_fa: "فعال"
  },
  [UserStatusesEnum.NotActivated]: {
    variant: "danger",
    name_fa: "غیرفعال"
  },
  [UserStatusesEnum.Banned]: {
    variant: "primary",
    name_fa: "مسدود"
  }
}

export const UserLanguagesEnumFa: StatusFaType<UserLanguagesEnum> = {
  [UserLanguagesEnum.Farsi]: {
    variant: "default",
    name_fa: "فارسی"
  },
  [UserLanguagesEnum.English]: {
    variant: "default",
    name_fa: "انگلیسی"
  }
}

export const MultiStatusesFa: StatusFaType<MultiStatuses> = {
  [MultiStatuses.Confirmed]: {
    variant: "success",
    name_fa: "تایید شده"
  },
  [MultiStatuses.Pending]: {
    variant: "default",
    name_fa: "در انتظار بررسی"
  },
  [MultiStatuses.Rejected]: {
    variant: "danger",
    name_fa: "رد شده"
  }
}

export const ContactInfoTypesFa: StatusFaType<ContactInfoTypes> = {
  [ContactInfoTypes.Fax]: {
    variant: "default",
    name_fa: "فکس"
  },
  [ContactInfoTypes.Mobile]: {
    variant: "default",
    name_fa: "موبایل"
  },
  [ContactInfoTypes.Tel]: {
    variant: "default",
    name_fa: "تلفن ثابت"
  }
}

export const MemberRolesFa: StatusFaType<MemberRoles> = {
  [MemberRoles.Admin]: {
    variant: "secondary",
    name_fa: "ادمین"
  },
  [MemberRoles.Zerolevel]: {
    variant: "default",
    name_fa: "کاربر معمولی"
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
