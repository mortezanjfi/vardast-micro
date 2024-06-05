import { ILayoutProps } from "@vardast/type/layout"

const _default: ILayoutProps = {
  desktop: {
    footer: {},
    header: {},
    main: {
      container: true
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

const _category: ILayoutProps = {
  desktop: {
    footer: {},
    header: {},
    main: {
      container: true
    }
  },
  mobile: {
    header: {
      title: {
        type: "image"
      }
    },
    main: {
      background: {
        type: "color",
        value: "bg-alpha-100"
      }
    },
    footer: {
      search: true,
      options: { name: "_default" }
    }
  }
}

const _home: ILayoutProps = {
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
    main: {
      background: {
        type: "color",
        value: "bg-alpha-100"
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
    header: {},
    main: {
      container: true,
      breadcrumb: true
    },
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

const _seller_or_brand: ILayoutProps = {
  desktop: {
    header: {},
    main: {
      container: true,
      breadcrumb: true
    },
    footer: {}
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

const _products: ILayoutProps = {
  desktop: {
    footer: {},
    header: {},
    main: {
      container: true,
      breadcrumb: true
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
  _profile,
  _home,
  _seller_or_brand,
  _products,
  _category
}
