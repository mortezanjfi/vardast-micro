import { NavigationType } from "@vardast/type/Navigation"

const _profile: NavigationType[] = [
  {
    items: [
      {
        title: "پروژه ها",
        icon: "FolderOpenIcon",
        path: "/profile/projects",
        background_color: "bg-blue-500",
        color: "text-white"
      },
      {
        title: "سفارشات من",
        icon: "ClipboardDocumentListIcon",
        path: "/profile/orders",
        background_color: "bg-orange-500",
        color: "text-white"
      },
      {
        title: "سبد کالا",
        icon: "ShoppingCartIcon",
        path: "/basket",
        background_color: "bg-green-500",
        color: "text-white"
      },
      {
        title: "علاقه‌مندی ها",
        icon: "BookmarkIcon",
        path: "/profile/favorites",
        background_color: "bg-rose-500",
        color: "text-white"
      }
    ]
  }
]

const _profile_about: NavigationType[] = [
  {
    items: [
      {
        title: "درباره ما",
        icon: "InformationCircleIcon",
        path: "/about",
        background_color: "bg-amber-500",
        color: "text-white"
      },
      {
        title: "تماس با ما",
        icon: "PhoneIcon",
        path: "/contact",
        background_color: "bg-emerald-500",
        color: "text-white"
      },
      {
        title: "سوالات متداول",
        icon: "QuestionMarkCircleIcon",
        path: "/faq",
        background_color: "bg-pink-500",
        color: "text-white"
      },
      {
        title: "قوانین و مقررات",
        icon: "ScaleIcon",
        path: "/privacy",
        background_color: "bg-violet-500",
        color: "text-white"
      }
    ]
  }
]

const _admin: NavigationType[] = [
  {
    items: [
      {
        title: "خانه",
        path: "/",
        background_color: "bg-green-500",
        color: "text-white",
        icon: "HomeIcon"
      },
      {
        title: "کالا",
        background_color: "bg-orange-500",
        color: "text-white",
        icon: "CubeIcon",
        items: [
          {
            title: "کالاها",
            path: "/products"
          },
          {
            title: "پیشنهادات",
            path: "/offers"
          }
        ]
      },
      {
        title: "دسته‌بندی‌ها",
        path: "/vocabularies",
        background_color: "bg-blue-500",
        color: "text-white",
        icon: "Squares2X2Icon"
      },
      {
        title: "برندها",
        path: "/brands",
        background_color: "bg-green-500",
        color: "text-white",
        icon: "HomeModernIcon"
      },
      {
        title: "کاربران",
        background_color: "bg-violet-500",
        color: "text-white",
        icon: "UsersIcon",
        items: [
          {
            title: "ادمین",
            path: "/users/admin"
          },
          {
            title: "فروشندگان",
            path: "/sellers"
          },
          {
            title: "خریداران",
            items: [
              {
                title: "حقوقی",
                path: "/users/legal"
              },
              {
                title: "حقیقی",
                path: "/users/real"
              }
            ]
          }
        ]
      },
      {
        title: "پروژه ها",
        path: "/profile/projects",
        background_color: "bg-orange-500",
        color: "text-white",
        icon: "FolderOpenIcon"
      },
      {
        title: "سفارشات",
        path: "/profile/orders",
        background_color: "bg-blue-500",
        color: "text-white",
        icon: "ClipboardDocumentIcon"
      },
      {
        title: "مالی",
        background_color: "bg-pink-500",
        color: "text-white",
        icon: "WalletIcon",
        items: [
          {
            title: "پیش فاکتورها",
            path: "/test"
          },
          {
            title: "فاکتورها",
            path: "/test"
          }
        ]
      },
      {
        title: "گزارشات",
        background_color: "bg-amber-500",
        color: "text-white",
        icon: "ChartPieIcon",
        path: "/test"
      },
      {
        title: "تنظیمات",
        background_color: "bg-gray-400",
        color: "text-white",
        icon: "Cog6ToothIcon",
        items: [
          {
            title: "واحدهای اندازه‌گیری",
            path: "/uoms"
          },
          {
            title: "مشخصه‌ها",
            path: "/attributes"
          },
          {
            title: "نقش‌ها",
            path: "/test"
          },
          {
            title: "دسترسی‌ها",
            path: "/test"
          }
        ]
      },
      {
        title: "مدیریت اپلیکیشن",
        background_color: "bg-blue-500",
        color: "text-white",
        icon: "DevicePhoneMobileIcon",
        items: [
          {
            title: "صفحه اصلی",
            path: "/app-management/main"
          }
        ]
      }
    ]
  }
]

export const _seller_panel: NavigationType[] = [
  {
    items: [
      {
        title: "خانه",
        path: "/",
        background_color: "bg-gray-400",
        color: "text-white",
        icon: "HomeIcon"
      },
      {
        title: "سفارشات",
        background_color: "bg-gray-400",
        color: "text-white",
        icon: "ClipboardDocumentIcon",
        path: "/orders"
      },
      {
        title: "سفارشات من",
        background_color: "bg-gray-400",
        color: "text-white",
        icon: "ClipboardIcon",
        path: "/my-orders"
      },
      {
        title: "کالاها",
        path: "/products",
        background_color: "bg-gray-400",
        color: "text-white",
        icon: "CubeIcon",
        items: [
          {
            title: "لیست کالاهای وردست",
            path: "/products/all-products"
          },
          {
            title: "ثبت کالای جدید",
            path: "/products/new"
          },
          {
            title: "مدیریت کالاهای من",
            path: "/products/my-products"
          }
        ]
      },
      {
        title: "دسته بندی‌های من",
        path: "/categories",
        background_color: "bg-gray-400",
        color: "text-white",
        icon: "Squares2X2Icon"
      },
      {
        title: "برندهای من",
        path: "/brands",
        background_color: "bg-gray-400",
        color: "text-white",
        icon: "HomeModernIcon"
      }
    ]
  }
]

export default {
  _profile,
  _admin,
  _profile_about,
  _seller_panel
}
