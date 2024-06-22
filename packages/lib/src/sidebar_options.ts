import { NavigationType } from "@vardast/type/Navigation"

const _profile: NavigationType[] = [
  {
    items: [
      {
        title: "پروژه ها",
        icon: "folder-open",
        path: "/profile/projects"
      },
      {
        title: "سفارشات",
        icon: "layout-list",
        path: "/profile/orders"
      },
      {
        title: "سبد کالا",
        icon: "shopping-cart",
        path: "/basket"
      },
      {
        title: "علاقه‌مندی ها",
        icon: "bookmark",
        path: "/profile/favorites"
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
        icon: "home"
      },
      {
        title: "کالا",
        icon: "package",
        items: [
          {
            title: "تمام کالاها",
            icon: "package",
            path: "/products"
          },
          {
            title: "پیشنهادات",
            path: "/offers",
            icon: "package"
          },
          {
            title: "واحدهای اندازه‌گیری",
            path: "/uoms",
            icon: "ruler"
          },
          {
            title: "مشخصه‌ها",
            path: "/attributes",
            icon: "layers"
          }
        ]
      },
      {
        title: "دسته‌بندی‌ها",
        path: "/vocabularies",
        icon: "layout-grid"
      },
      {
        title: "برندها",
        path: "/brands",
        icon: "factory"
      },
      {
        title: "کاربران",
        icon: "users-2",
        items: [
          {
            title: "ادمین",
            path: "/users/admin",
            icon: "users"
          },
          {
            title: "فروشندگان",
            icon: "store",
            path: "/sellers"
          },
          {
            title: "خریداران",
            icon: "users",
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
        icon: "folder"
      },
      {
        title: "سفارشات",
        icon: "layout-list",
        path: "/profile/orders"
      },
      {
        title: "مالی",
        icon: "wallet",
        items: [
          {
            title: "پیش فاکتورها",
            icon: "package",
            path: "/"
          },
          {
            title: "فاکتورها",
            path: "/",
            icon: "ruler"
          }
        ]
      },
      {
        title: "گزارشات",
        path: "/",
        icon: "pie-chart"
      },
      {
        title: "نقش‌ها",
        path: "/",
        icon: "shield-alert"
      },
      {
        title: "دسترسی‌ها",
        path: "/",
        icon: "key-round"
      }
      // {
      //   title: "کالاها",
      //   icon: "package",
      //   items: [
      //     {
      //       title: "تمام کالاها",
      //       path: "/products",
      //       icon: "package",
      //     },
      //     {
      //       title: "پیشنهادات",
      //       path: "/offers",
      //       icon: "package",
      //     },
      //     {
      //       title: "مشخصه‌ها",
      //       path: "/attributes",
      //       icon: "layers",
      //     },
      //     {
      //       title: "برندها",
      //       path: "/brands",
      //       icon: "fingerprint",
      //     },
      //     {
      //       title: "واحدهای اندازه‌گیری",
      //       path: "/uoms",
      //       icon: "ruler",
      //     }
      //   ]
      // },

      // {
      //   title: "مناطق جغرافیایی",
      //   path: "/locations",
      //   icon: "map",
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
  //     },
  //     {
  //       title: "مناطق جغرافیایی",
  //       path: "/locations",
  //       icon: "map",
  //     },
  //     {
  //       title: "کاربران",
  //       path: "/users",
  //       icon: "users",
  //     }
  //   ]
  // }
]

export const _seller_panel: NavigationType[] = [
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
        items: [
          {
            title: "لیست کالاهای وردست",
            path: "/products/all-products",
            icon: "package"
          },
          {
            title: "ثبت کالای جدید",
            path: "/products/new",
            icon: "package"
          },
          {
            title: "مدیریت کالاهای من",
            path: "/products/my-products",
            icon: "package"
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
      }
    ]
  }
]

export default {
  _profile,
  _admin,
  _seller_panel
}
