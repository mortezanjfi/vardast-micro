import {
  BookmarkIcon,
  CubeIcon,
  HomeIcon,
  Squares2X2Icon,
  UserCircleIcon
} from "@heroicons/react/24/outline"
import {
  ArrowRightStartOnRectangleIcon,
  HomeModernIcon,
  ListBulletIcon,
  PlusCircleIcon,
  BookmarkIcon as SolidBookmarkIcon,
  HomeIcon as SolidHomeIcon,
  Squares2X2Icon as SolidSquares2X2Icon,
  UserCircleIcon as SolidUserCircleIcon
} from "@heroicons/react/24/solid"
import { QueryClientConfig } from "@tanstack/react-query"
import {
  ISellerDesktopAnalyzeProps,
  ISellerMobileAnalyzeProps
} from "@vardast/type/Seller"
import {
  // LucideBookmark,
  LucideGlobe,
  // LucideHome,
  LucideIcon,
  LucideInfo,
  LucideNewspaper,
  LucidePhone,
  LucidePhoneIncoming
  // LucideUserCircle
} from "lucide-react"

import { NavigationType } from "../../type/src/Navigation"

type NavbarItem = {
  href: string
  Icon: LucideIcon
  ActiveIcon: LucideIcon
  title: string
  id: number
}

export const _sidebarMenu: NavigationType[] = [
  {
    items: [
      {
        title: "خانه",
        path: "/admin",
        icon: "home"
      },
      {
        title: "کالاها",
        path: "/admin/products",
        icon: "package",
        abilities: "gql.products.product.index",
        items: [
          {
            title: "تمام کالاها",
            path: "/admin/products",
            icon: "package",
            abilities: "gql.products.product.index"
          },
          {
            title: "پیشنهادات",
            path: "/admin/offers",
            icon: "package",
            abilities: "gql.products.offer.index.mine"
          },
          {
            title: "مشخصه‌ها",
            path: "/admin/attributes",
            icon: "layers",
            abilities: "gql.products.attribute.index"
          },
          {
            title: "برندها",
            path: "/admin/brands",
            icon: "fingerprint",
            abilities: "gql.products.brand.index"
          },
          {
            title: "واحدهای اندازه‌گیری",
            path: "/admin/uoms",
            icon: "ruler",
            abilities: "gql.products.uom.index"
          }
        ]
      },
      {
        title: "فروشندگان",
        path: "/admin/sellers",
        icon: "store",
        abilities: "gql.products.seller.index"
      }
    ]
  },
  {
    title: "مدیریت",
    role: "admin",
    items: [
      {
        title: "دسته‌بندی‌ها",
        path: "/admin/vocabularies",
        icon: "layout-grid",
        abilities: "gql.base.taxonomy.vocabulary.index"
      },
      {
        title: "مناطق جغرافیایی",
        path: "/admin/locations",
        icon: "map",
        abilities: "gql.base.location.country.index"
      },
      {
        title: "کاربران",
        path: "/admin/users",
        icon: "users",
        abilities: "gql.users.user.index"
      }
    ]
  }
]

export const _sellerSidebarMenu: NavigationType[] = [
  {
    items: [
      {
        title: "خانه",
        path: "/seller-panel",
        icon: "home"
      },
      {
        title: "کالا",
        path: "/seller-panel/products",
        icon: "package",
        abilities: "gql.products.product.index",
        items: [
          {
            title: "لیست کالاهای وردست",
            path: "/seller-panel/products/all-products",
            icon: "package",
            abilities: "gql.products.product.index"
          },
          {
            title: "ثبت کالای جدید",
            path: "/seller-panel/products/new",
            icon: "package",
            abilities: "gql.products.product.index"
          },
          {
            title: "مدیریت کالاهای من",
            path: "/seller-panel/products/my-products",
            icon: "package",
            abilities: "gql.products.offer.index.mine"
          }
        ]
      },
      {
        title: "دسته بندی‌های من",
        path: "/seller-panel/categories",
        icon: "layers"
      },
      {
        title: "برندهای من",
        path: "/seller-panel/brands",
        icon: "layers"
      }
    ]
  }
]
export type WithNavigationRouteItem = {
  forceEqual: boolean
  path: string
  dynamicRouteAllow?: boolean
}

export const _withNavigationRoutes: WithNavigationRouteItem[] = [
  {
    forceEqual: false,
    path: "/"
  },
  {
    forceEqual: true,
    path: "/auth"
  },
  {
    forceEqual: false,
    path: "/request-seller"
  },
  {
    forceEqual: false,
    path: "/profile"
  },
  {
    forceEqual: false,
    path: "/privacy"
  },
  {
    forceEqual: false,
    path: "/contact"
  },
  {
    forceEqual: false,
    path: "/about"
  },
  {
    forceEqual: false,
    path: "/faq"
  },
  {
    forceEqual: true,
    path: "/category"
  },
  {
    forceEqual: true,
    path: "/products"
  },
  {
    forceEqual: false,
    path: "/auth/signin"
  },
  {
    forceEqual: false,
    path: "/favorites"
  },
  {
    forceEqual: true,
    path: "/brands"
  },
  {
    forceEqual: true,
    path: "/sellers"
  },
  {
    forceEqual: false,
    path: "/auth/signin"
  },
  {
    forceEqual: false,
    path: "/auth/signup"
  },
  {
    forceEqual: false,
    path: "/auth/reset"
  },
  {
    forceEqual: true,
    path: "/product"
  },
  {
    forceEqual: true,
    path: "/brand"
  },
  {
    forceEqual: true,
    path: "/seller"
  }
]

export const _navbar_items: NavbarItem[] = [
  {
    href: "/",
    Icon: HomeIcon,
    ActiveIcon: SolidHomeIcon,
    title: "خانه",
    id: 0
  },
  {
    href: "/category",
    Icon: Squares2X2Icon,
    ActiveIcon: SolidSquares2X2Icon,
    title: "دسته‌بندی",
    id: 1
  },
  {
    href: "/favorites",
    Icon: BookmarkIcon,
    ActiveIcon: SolidBookmarkIcon,
    title: "علاقه‌مندی",
    id: 2
  },
  {
    href: "/profile",
    Icon: UserCircleIcon,
    ActiveIcon: SolidUserCircleIcon,
    title: "حساب کاربری",
    id: 3
  }
]

export const _about_items = [
  { Icon: LucideGlobe, href: "https://blog.vardast.com", title: "بلاگ" },

  // { Icon: LucideMail, href: "" },

  { Icon: LucidePhoneIncoming, href: "tel:+982187132501", title: "شماره تماس" }

  // { Icon: LucideMapPin, href: "" }
]

export const _profile_items = [
  // {
  //   href: "/faq",
  //   Icon: LucideShieldQuestion,
  //   title: "سوالات متداول",
  //   id: 0
  // },
  {
    href: "/privacy",
    Icon: LucideNewspaper,
    title: "قوانین و مقررات",
    id: 1
  },
  {
    href: "/contact",
    Icon: LucidePhone,
    title: "تماس با ما",
    id: 2
  },
  {
    href: "/about",
    Icon: LucideInfo,
    title: "درباره ما",
    id: 3
  }
]
export const _seller_menu_item: ISellerMobileAnalyzeProps[] = [
  {
    id: "9",
    Icon: CubeIcon,
    title: "مدیریت کالاهای من",
    href: "/seller-panel/products/my-products"
  },
  {
    id: "5",
    Icon: Squares2X2Icon,
    title: "دسته‌بندی‌های من",
    href: "/seller-panel/categories"
  },
  {
    id: "6",
    Icon: HomeModernIcon,
    title: "برند‌های من",
    href: "/seller-panel/brands"
  },
  {
    id: "4",
    Icon: ListBulletIcon,
    title: "افزودن کالا به لیست من",
    href: "/seller-panel/products/all-products"
  },
  {
    id: "7",
    Icon: PlusCircleIcon,
    title: "افزودن کالای جدید در وردست",
    href: "/seller-panel/products/new"
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
        href: "/seller-panel/products/all-products",
        id: "10/3"
      },
      {
        listText: "ثبت کالای جدید",
        href: "/seller-panel/products/new",
        id: "10/2"
      },
      {
        listText: "مدیریت کالاهای من",
        href: "/seller-panel/products/my-products",
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
        href: "/seller-panel/categories",
        id: "11/1"
      },
      {
        listText: "برندهای من",
        href: "/seller-panel/brands",
        id: "11/2"
      }
    ],
    id: "11"
  }
]
