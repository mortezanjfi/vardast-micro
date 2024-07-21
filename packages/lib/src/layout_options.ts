import { ILayoutProps, ILayoutTitle } from "@vardast/type/layout"

import mobile_footer_back_options from "./mobile_footer_back_options"

const _default: ILayoutProps = {
  desktop: {
    footer: {},
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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

const _category_item: ILayoutProps = {
  desktop: {
    footer: {},
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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
      back: true,
      options: { name: "_default" }
    }
  }
}

const _home: ILayoutProps = {
  desktop: {
    footer: {},
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
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

const _footer: ILayoutProps = {
  desktop: {
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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
    main: {
      background: { type: "color", value: "bg-alpha-100" }
    },
    footer: {
      search: true,
      back: mobile_footer_back_options._profile,
      options: { name: "_default" }
    }
  }
}

const _basket: ILayoutProps = {
  desktop: {
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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
      back: mobile_footer_back_options._profile,
      options: { name: "_default" }
    }
  }
}

const _brand: ILayoutProps = {
  desktop: {
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
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
    main: {
      background: {
        type: "color",
        value: "bg-alpha-100"
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
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },
      search: true
    },
    sidebar: {},
    main: {
      container: true,
      page_header: true
    },
    breadcrumb: true,
    footer: {}
  },
  mobile: {
    header: {
      title: {
        type: "image"
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
    header: {
      button: {
        type: "link",
        value: process.env.NEXT_PUBLIC_SELLER_VARDAST as string
      },

      search: true
    },
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

const _admin: ILayoutProps = {
  desktop: {
    header: {},
    main: {
      container: true,
      breadcrumb: true
    },
    sidebar: {
      menus_name: "_admin"
    }
  },
  mobile: {
    sidebar: {
      menus_name: "_admin"
    },
    header: {
      progress: true,
      hamburger: true,
      title: {
        type: "image"
      }
    }
  }
}

const _bidding: ILayoutProps = {
  desktop: {
    main: {
      container: true,
      breadcrumb: true
    },
    sidebar: {
      menus_name: "_bidding"
    }
  },
  mobile: {
    sidebar: {
      menus_name: "_bidding"
    },
    header: {
      progress: true,
      hamburger: true,
      title: {
        type: "image"
      }
    }
  }
}

const _seller_panel: ILayoutProps = {
  desktop: {
    header: {},
    main: {
      container: true,
      breadcrumb: true
    },
    sidebar: {
      menus_name: "_seller_panel"
    }
  },
  mobile: {
    header: {
      progress: true,
      hamburger: true,
      title: {
        type: "image"
      }
    },
    sidebar: {
      menus_name: "_seller_panel"
    }
  }
}

const options = {
  _default,
  _profile,
  _home,
  _seller,
  _brand,
  _products,
  _category,
  _category_item,
  _seller_or_brand_with_header,
  _product,
  _footer,
  _admin,
  _bidding,
  _seller_panel,
  _basket
}

type OptionName = keyof typeof options

const createOptionByMobileTitle = (
  title: ILayoutTitle<"image" | "text">,
  optionName?: OptionName
) => {
  const temp = options[optionName || "_default"]
  temp.mobile.header.title = title
  return temp
}

export default {
  ...options,
  createOptionByMobileTitle
}
