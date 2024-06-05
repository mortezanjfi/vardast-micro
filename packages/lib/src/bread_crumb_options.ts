import { ILayoutProps } from "@vardast/type/layout"

const _default: ILayoutProps = {
  desktop: {
    footer: {},
    header: {}
  },
  mobile: {
    header: {
      title: {
        type: "image"
      }
    },
    footer: {
      search: true,
      options: { name: "_default" }
    }
  }
}

const _profile: ILayoutProps = {
  desktop: {
    footer: {},
    header: {},
    sidebar: {
      profile: true,
      menus_name: "_profile"
    }
  },
  mobile: {
    header: {
      title: {
        type: "image"
      }
    },
    footer: {
      search: true,
      options: { name: "_default" }
    }
  }
}

export default {
  _default,
  _profile
}
