import {
  BookmarkIcon,
  HomeIcon,
  Squares2X2Icon,
  UserCircleIcon
} from "@heroicons/react/24/outline"
import {
  BookmarkIcon as SolidBookmarkIcon,
  HomeIcon as SolidHomeIcon,
  Squares2X2Icon as SolidSquares2X2Icon,
  UserCircleIcon as SolidUserCircleIcon
} from "@heroicons/react/24/solid"
import { ILayoutOption } from "@vardast/type/layout"

const _default: ILayoutOption[] = [
  {
    id: 0,
    icon: {
      Default: HomeIcon,
      Active: SolidHomeIcon
    },
    button: {
      type: "link",
      value: "/"
    },
    title: "خانه"
  },
  {
    id: 1,
    icon: {
      Default: Squares2X2Icon,
      Active: SolidSquares2X2Icon
    },
    button: {
      type: "link",
      value: "/category"
    },
    title: "دسته‌بندی"
  },
  {
    id: 2,
    icon: {
      Default: BookmarkIcon,
      Active: SolidBookmarkIcon
    },
    button: {
      type: "link",
      value: "/favorites"
    },
    title: "علاقه‌مندی"
  },
  {
    id: 3,
    icon: {
      Default: UserCircleIcon,
      Active: SolidUserCircleIcon
    },
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
