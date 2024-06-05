import { NavigationType } from "@vardast/type/Navigation"

export const _profile: NavigationType[] = [
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

export default {
  _profile
}
