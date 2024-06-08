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

const _footer: ILayoutProps = {
  desktop: {
    header: {},
    // main: {
    //   background: {
    //     type: "image",
    //     value: "bg-[url('/images/background.svg')]"
    //   }
    // },
    main: {
      container: true
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
      back: true,
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

const _brand: ILayoutProps = {
  desktop: {
    header: {},
    sidebar: {},
    main: {
      container: true,
      breadcrumb: true
    },
    footer: {}
  },
  mobile: {
    header: {
      title: {
        type: "text",
        value: "برندهای وردست"
      }
    },
    main: {
      background: { type: "color", value: "bg-alpha-100" }
    },
    footer: {
      search: true,
      options: { name: "_default" },
      back: true
    }
  }
}

const _seller: ILayoutProps = {
  desktop: {
    header: {},
    sidebar: {},
    main: {
      container: true,
      breadcrumb: true
    },
    footer: {}
  },
  mobile: {
    header: {
      title: {
        type: "text",
        value: "فروشندگان وردست"
      }
    },
    main: {
      background: { type: "color", value: "bg-alpha-100" }
    },
    footer: {
      search: true,
      options: { name: "_default" },
      back: true
    }
  }
}

const _product: ILayoutProps = {
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
      back: true,
      action: true
    }
  }
}

const _seller_or_brand_with_header: ILayoutProps = {
  desktop: {
    header: {},
    sidebar: {},
    main: {
      container: true,
      breadcrumb: true,
      page_header: true
    },
    footer: {}
  },
  mobile: {
    header: {
      title: {
        type: "text"
      }
    },
    main: { page_header: true },
    footer: {
      back: true,
      action: true
    }
  }
}

const _products: ILayoutProps = {
  desktop: {
    footer: {},
    header: {},
    sidebar: {},
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
      options: { name: "_default" },
      back: true
    }
  }
}

export default {
  _default,
  _profile,
  _home,
  _seller,
  _brand,
  _products,
  _category,
  _seller_or_brand_with_header,
  _product,
  _footer
}
