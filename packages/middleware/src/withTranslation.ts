// import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
// import { MiddlewareFactory } from "./types";
// export const withHeaders: MiddlewareFactory = (next: NextMiddleware) => {
//   return async (request: NextRequest, _next: NextFetchEvent) => {
//     const res = await next(request, _next);
//     if (res) {
//       res.headers.set("x-content-type-options", "nosniff");
//       res.headers.set("x-dns-prefetch-control", "false");
//       res.headers.set("x-download-options", "noopen");
//       res.headers.set("x-frame-options", "SAMEORIGIN");
//     }
//     return res;
//   };
// };

import { NextMiddleware, NextRequest, NextResponse } from "next/server"

import i18n from "./i18n"
import { MiddlewareFactory } from "./types"

export const withTranslation: MiddlewareFactory = (_: NextMiddleware) => {
  return async (request: NextRequest) => {
    const locale = request.nextUrl.locale || i18n.defaultLocale
    request.nextUrl.searchParams.set("lang", locale)
    request.nextUrl.href = request.nextUrl.href.replace(`/${locale}`, "")
    return NextResponse.rewrite(request.nextUrl)
  }
}
