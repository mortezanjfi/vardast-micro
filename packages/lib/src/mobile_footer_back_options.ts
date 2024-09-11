import { WithNavigationRouteItem } from "@vardast/type/layout"

const _profile: WithNavigationRouteItem[] = [
  {
    forceEqual: true,
    dynamicRouteAllow: true,
    path: "profile/main/orders"
  },
  {
    forceEqual: true,
    dynamicRouteAllow: true,
    path: "profile/main/projects"
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
  },
  {
    forceEqual: true,
    dynamicRouteAllow: true,
    path: "profile/favorites"
  }
]

export default {
  _profile
}
