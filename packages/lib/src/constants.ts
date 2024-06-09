import {
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
  CubeIcon as SolidCubeIcon,
  HomeIcon as SolidHomeIcon,
  Squares2X2Icon as SolidSquares2X2Icon,
  UserCircleIcon as SolidUserCircleIcon
} from "@heroicons/react/24/solid"
import { NavigationItemType, NavigationType } from "@vardast/type/Navigation"
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

export type NavbarItem = {
  href: string
  Icon: LucideIcon
  ActiveIcon: LucideIcon
  title: string
  id: number
}

export const _clientMobileSecondProfileMenu: NavigationType[] = [
  {
    title: "سایر",
    items: [
      {
        title: "درباره ما",
        icon: "info",
        path: "/about"
      },
      {
        title: "تماس با ما",
        icon: "phone",
        path: "/contact"
      },
      { title: "سوالات متداول", icon: "file-question", path: "/faq" },
      {
        title: "قوانین و مقررات",
        icon: "newspaper",
        path: "/privacy"
      }
    ]
  }
]

export const _clientMobileProfileMenu: NavigationType[] = [
  {
    title: "منوی اصلی",
    items: [
      {
        title: "پروژه ها",
        icon: "folder-open",
        path: "/profile/projects"
      },
      {
        title: "سفارشات",
        icon: "list",
        path: "/profile/orders"
      },
      {
        title: "سبد کالا",
        icon: "shopping-cart",
        path: "/profile/basket"
      },
      {
        title: "علاقه مندی ها",
        icon: "bookmark",
        path: "/profile/favorites"
      },
      {
        title: "اطلاعات حساب کاربری",
        icon: "user",
        path: "/profile/info"
      },
      {
        title: "خروج از حساب کاربری",
        icon: "log-out",
        path: "/auth/signout",
        color: "text-error-600"
      }
    ]
  }
]

export const _profileSidebarMenu: NavigationType[] = [
  {
    items: [
      {
        title: "اطلاعات حساب کاربری",
        icon: "user",
        path: "/profile/info"
      },
      {
        title: "پروژه ها",
        icon: "folder-open",
        path: "/profile/projects"
      },
      {
        title: "سفارشات",
        icon: "list",
        path: "/profile/orders"
      },
      {
        title: "خروج از حساب کاربری",
        icon: "log-out",
        path: "/auth/signout",
        color: "text-error-600"
      }
      // {
      //   title: "سبد کالا",
      //   icon: "shopping-cart",
      //   path: "/profile/basket"
      // }
      // {
      //   title: "علاقه مندی ها",
      //   icon: "bookmark",
      //   path: "/profile/favorites"
      // }
    ]
  }
]

export const _authentication_signin_sidebarMenu: NavigationItemType = {
  title: "ورود به حساب کاربری",
  icon: "log-in",
  path: "/auth/signin"
}

export const _authentication_signout_sidebarMenu: NavigationItemType = {
  title: "خروج از حساب کاربری",
  icon: "log-out",
  path: "/auth/signout"
}

export const _sidebarMenu: NavigationType[] = [
  {
    items: [
      {
        title: "خانه",
        path: "/",
        icon: "home"
      },
      {
        title: "سفارشات",
        icon: "list",
        path: "/orders"
      },
      {
        title: "کالاها",
        path: "/products",
        icon: "package",
        abilities: "gql.products.product.index"
      },
      {
        title: "دسته‌بندی‌ها",
        path: "/vocabularies",
        icon: "layout-grid",
        abilities: "gql.base.taxonomy.vocabulary.index"
      },
      {
        title: "برندها",
        path: "/brands",
        icon: "factory",
        abilities: "gql.products.brand.index"
      },
      {
        title: "فروشندگان",
        path: "/sellers",
        icon: "store",
        abilities: "gql.products.seller.index"
      },
      {
        title: "کاربران",
        path: "/users",
        icon: "users",
        abilities: "gql.users.user.index"
      },
      {
        title: "پیشنهادات",
        path: "/offers",
        icon: "package",
        abilities: "gql.products.offer.index.index"
      },
      {
        title: "مشخصه‌ها",
        path: "/attributes",
        icon: "layers",
        abilities: "gql.products.attribute.index"
      },

      {
        title: "واحدهای اندازه‌گیری",
        path: "/uoms",
        icon: "ruler",
        abilities: "gql.products.uom.index"
      },
      {
        title: "خروج از حساب کاربری",
        icon: "log-out",
        path: "/auth/signout",
        color: "text-error-600"
      }

      // {
      //   title: "کالاها",
      //   icon: "package",
      //   abilities: "gql.products.product.index",
      //   items: [
      //     {
      //       title: "تمام کالاها",
      //       path: "/products",
      //       icon: "package",
      //       abilities: "gql.products.product.index"
      //     },
      //     {
      //       title: "پیشنهادات",
      //       path: "/offers",
      //       icon: "package",
      //       abilities: "gql.products.offer.index.index"
      //     },
      //     {
      //       title: "مشخصه‌ها",
      //       path: "/attributes",
      //       icon: "layers",
      //       abilities: "gql.products.attribute.index"
      //     },
      //     {
      //       title: "برندها",
      //       path: "/brands",
      //       icon: "fingerprint",
      //       abilities: "gql.products.brand.index"
      //     },
      //     {
      //       title: "واحدهای اندازه‌گیری",
      //       path: "/uoms",
      //       icon: "ruler",
      //       abilities: "gql.products.uom.index"
      //     }
      //   ]
      // },

      // {
      //   title: "مناطق جغرافیایی",
      //   path: "/locations",
      //   icon: "map",
      //   abilities: "gql.base.location.country.index"
      // }
    ]
  }
  // {
  //   title: "مدیریت",
  //   role: "admin",
  //   items: [
  //     {
  //       title: "دسته‌بندی‌ها",
  //       path: "/vocabularies",
  //       icon: "layout-grid",
  //       abilities: "gql.base.taxonomy.vocabulary.index"
  //     },
  //     {
  //       title: "مناطق جغرافیایی",
  //       path: "/locations",
  //       icon: "map",
  //       abilities: "gql.base.location.country.index"
  //     },
  //     {
  //       title: "کاربران",
  //       path: "/users",
  //       icon: "users",
  //       abilities: "gql.users.user.index"
  //     }
  //   ]
  // }
]

export const _sellerSidebarMenu: NavigationType[] = [
  {
    items: [
      {
        title: "خانه",
        path: "/",
        icon: "home"
      },
      {
        title: "سفارشات",
        icon: "list",
        path: "/orders"
      },
      {
        title: "سفارشات من",
        icon: "list",
        path: "/my-orders"
      },
      {
        title: "کالا",
        path: "/products",
        icon: "package",
        abilities: "gql.products.product.index",
        items: [
          {
            title: "لیست کالاهای وردست",
            path: "/products/all-products",
            icon: "package",
            abilities: "gql.products.product.index"
          },
          {
            title: "ثبت کالای جدید",
            path: "/products/new",
            icon: "package",
            abilities: "gql.products.product.index"
          },
          {
            title: "مدیریت کالاهای من",
            path: "/products/my-products",
            icon: "package",
            abilities: "gql.products.offer.index.index"
          }
        ]
      },
      {
        title: "دسته بندی‌های من",
        path: "/categories",
        icon: "layers"
      },
      {
        title: "برندهای من",
        path: "/brands",
        icon: "layers"
      },
      {
        title: "خروج از حساب کاربری",
        icon: "log-out",
        path: "/auth/signout",
        color: "text-error-600"
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
  //for seller////
  {
    forceEqual: true,
    path: "/my-orders"
  },
  {
    forceEqual: true,
    path: "/orders"
  },
  /////////////////
  {
    forceEqual: true,
    path: "/profile/orders"
  },
  {
    forceEqual: true,
    path: "/profile/projects"
  },
  {
    forceEqual: true,
    path: "/profile/info"
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
    href: "/profile/orders",
    Icon: ListBulletIcon,
    ActiveIcon: SolidBookmarkIcon,
    title: "سفارشات",
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

export const _seller_navbar_items: NavbarItem[] = [
  {
    href: "/",
    Icon: HomeIcon,
    ActiveIcon: SolidHomeIcon,
    title: "داشبورد",
    id: 0
  },
  {
    href: "/orders",
    Icon: ListBulletIcon,
    ActiveIcon: SolidSquares2X2Icon,
    title: "سفارشات",
    id: 1
  },
  {
    href: "/products",
    Icon: CubeIcon,
    ActiveIcon: SolidCubeIcon,
    title: "کالاها",
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
