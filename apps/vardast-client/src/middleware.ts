// import * as middleware from "@vardast/middleware/next.middleware"

// export default middleware

import middleware, {
  config as globalConfig
} from "@vardast/middleware/next.middleware"

export const config = globalConfig

export default middleware
