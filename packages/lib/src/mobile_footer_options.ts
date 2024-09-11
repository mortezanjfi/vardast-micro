import { ILayoutOption } from "@vardast/type/layout"

// import { Home, LayoutGrid, LayoutList, User2 } from "lucide-react";

const _default: ILayoutOption[] = [
  {
    id: 0,
    icon: "HomeIcon",
    button: {
      type: "link",
      value: "/"
    },
    title: "خانه"
  },
  {
    id: 1,
    icon: "Squares2X2Icon",
    button: {
      type: "link",
      value: "/category"
    },
    title: "دسته‌بندی‌ها"
  },
  // {
  //   id: 2,
  //   icon: {
  //     Default: BookmarkIcon,
  //     Active: SolidBookmarkIcon
  //   },
  //   button: {
  //     type: "link",
  //     value: "/favorites"
  //   },
  //   title: "علاقه‌مندی"
  // },
  {
    id: 2,
    icon: "ClipboardDocumentListIcon",
    button: {
      type: "link",
      value: "/orders"
    },
    title: "سفارشات"
  },
  // {
  //   id: 2,
  //   icon: "layout-list",
  //   icon: LayoutList,
  //   button: {
  //     type: "link",
  //     value: "/basket"
  //   },
  //   title: "سبد کالا"
  // },
  {
    id: 3,
    icon: "UserIcon",
    button: {
      type: "link",
      value: [
        "/profile/main",
        "/profile/info",
        "/profile/favorites",
        "/profile/projects",
        "/profile/orders",
        "/about",
        "/contact",
        "/faq",
        "/basket",
        "/privacy"
      ]
    },
    title: "حساب کاربری"
  }
]

export default {
  _default
}
