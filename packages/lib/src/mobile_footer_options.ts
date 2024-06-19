import { ILayoutOption } from "@vardast/type/layout"
import { Home, LayoutGrid, LayoutList, User2 } from "lucide-react"

const _default: ILayoutOption[] = [
  {
    id: 0,
    icon: "home",
    IconPrerender: Home,
    button: {
      type: "link",
      value: "/"
    },
    title: "خانه"
  },
  {
    id: 1,
    icon: "layout-grid",
    IconPrerender: LayoutGrid,
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
    IconPrerender: LayoutList,
    button: {
      type: "link",
      value: "/profile/basket"
    },
    title: "سفارشات"
  },
  {
    id: 3,
    icon: "user-2",
    IconPrerender: User2,
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
