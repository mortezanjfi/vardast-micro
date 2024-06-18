import { ILayoutOption } from "@vardast/type/layout"

const _default: ILayoutOption[] = [
  {
    id: 0,
    icon: "home",
    button: {
      type: "link",
      value: "/"
    },
    title: "خانه"
  },
  {
    id: 1,
    icon: "layout-grid",
    button: {
      type: "link",
      value: "/category"
    },
    title: "دسته‌بندی"
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
    icon: "layout-list",
    button: {
      type: "link",
      value: "/profile/basket"
    },
    title: "سفارشات"
  },
  {
    id: 3,
    icon: "user-2",
    button: {
      type: "link",
      value: "/profile"
    },
    title: "حساب کاربری"
  }
]

export default {
  _default
}
