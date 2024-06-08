import { NavigationType } from "@vardast/type/Navigation"

const _profile: NavigationType[] = [
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

export default {
  _profile,
  _admin
}
