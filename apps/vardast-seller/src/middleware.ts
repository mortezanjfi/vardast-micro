import { NextRequest } from "next/server"
// import * as middleware from "@vardast/middleware/next.middleware"

// export default middleware

import { middleware as middlewareConfig } from "@vardast/middleware/next.middleware"

// export { config } from "@vardast/middleware/next.middleware"

export default async function middleware(request: NextRequest) {
  // Use the middleware function from middlewareUtils
  return await middlewareConfig(request)
}

export const config = {
  matcher: [
    // "/authentication/signin"
    // "/product/:path*"
    // "/products/:path*",
    // "/brand/:path*",
    // "/category/:path*"
  ]
}
