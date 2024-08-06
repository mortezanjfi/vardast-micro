import { WithNavigationRouteItem } from "@vardast/type/layout"

const _profile: WithNavigationRouteItem[] = [
  {
    forceEqual: true,
    dynamicRouteAllow: true,
    path: "profile/orders"
  },
  {
    forceEqual: true,
    dynamicRouteAllow: true,
    path: "profile/projects"
  },
  {
    forceEqual: true,
    dynamicRouteAllow: true,
    path: "profile/info"
  },
  {
    forceEqual: true,
    dynamicRouteAllow: true,
    path: "basket"
  }
]

export default {
  _profile
}
