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
        path: "/profile/basket"
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
        title: "سفارشات",
        icon: "list",
        path: "/profile/orders"
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
        title: "پروژه ها",
        path: "/profile/projects",
        icon: "folder",
        abilities: "gql.products.seller.index"
      },
      {
        title: "کاربران",
        icon: "users",
        abilities: "gql.users.user.index",
        items: [
          {
            title: "حقوقی",
            path: "/users/legal",
            icon: "users",
            abilities: "gql.products.offer.index.index"
          },
          {
            title: "حقیقی",
            path: "/users/real",
            icon: "users",
            abilities: "gql.products.offer.index.index"
          }
        ]
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
      }
    ]
  }
]

export default {
  _profile,
  _admin,
  _seller_panel
}
