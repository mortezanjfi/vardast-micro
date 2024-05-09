import { NextRequest, NextResponse } from "next/server"
import { pathToRegexp } from "path-to-regexp"

import i18n from "./i18n.mjs"

export async function middleware(request: NextRequest) {
  const locale = request.nextUrl.locale || i18n.defaultLocale
  request.nextUrl.searchParams.set("lang", locale)
  request.nextUrl.href = request.nextUrl.href.replace(`/${locale}`, "")

  const productPathRegexp = pathToRegexp("/product/:slug1/:slug2?")
  const productPathRegexpText = productPathRegexp.exec(request.nextUrl.pathname)
  if (productPathRegexpText) {
    const id = productPathRegexpText[1]
    const name = productPathRegexpText[2]
    const data = await fetch(
      `http://${request.nextUrl.hostname}:${request.nextUrl.port}/api/products/${id}`
    )
    if (data && data.status === 200) {
      const res = await data.json()
      if (!name || name !== encodeURI(res.product.name)) {
        return NextResponse.redirect(
          new URL(
            `/product/${res.product.id}/${res.product.name}`,
            request.url
          ),
          301
        )
      }
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/authentication/api") ||
    request.nextUrl.pathname.startsWith("/authentication/redirect") ||
    request.nextUrl.pathname.startsWith("/authentication/signout") ||
    request.nextUrl.pathname.startsWith("/authentication/signin") ||
    request.nextUrl.pathname.startsWith("/authentication/request-seller")
  ) {
    const data = await fetch(`http://localhost:3000${request.nextUrl.pathname}`)
    if (data && data.status === 200) {
      const res = await data.text()
      return NextResponse.json(res, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      })
    }
  }

  const productsPathRegexp = pathToRegexp("/products/:slug1/:slug2?")
  const productsPathRegexpText = productsPathRegexp.exec(
    request.nextUrl.pathname
  )
  if (productsPathRegexpText) {
    const id = productsPathRegexpText[1]
    const title = productsPathRegexpText[2]
    const data = await fetch(
      `http://${request.nextUrl.hostname}:${request.nextUrl.port}/api/category/${id}`
    )
    if (data && data.status === 200) {
      const res = await data.json()
      if (!title || title !== encodeURI(res.category.title)) {
        request.nextUrl.searchParams.delete("lang")
        return NextResponse.redirect(
          new URL(
            `/products/${res.category.id}/${res.category.title}?${request.nextUrl.searchParams}`,
            request.url
          ),
          301
        )
      }
    }
  }

  const brandPathRegexp = pathToRegexp("/brand/:slug1/:slug2?")
  const brandPathRegexpText = brandPathRegexp.exec(request.nextUrl.pathname)
  if (brandPathRegexpText) {
    const id = brandPathRegexpText[1]
    const title = brandPathRegexpText[2]
    const data = await fetch(
      `http://${request.nextUrl.hostname}:${request.nextUrl.port}/api/brands/${id}`
    )
    if (data && data.status === 200) {
      const res = await data.json()
      if (!title || title !== encodeURI(res.brand.name)) {
        request.nextUrl.searchParams.delete("lang")
        return NextResponse.redirect(
          new URL(
            `/brand/${res.brand.id}/${res.brand.name}?${request.nextUrl.searchParams}`,
            request.url
          ),
          301
        )
      }
    }
  }

  const sellerPathRegexp = pathToRegexp("/seller/:slug1/:slug2?")
  const sellerPathRegexpText = sellerPathRegexp.exec(request.nextUrl.pathname)
  if (sellerPathRegexpText) {
    const id = sellerPathRegexpText[1]
    const title = sellerPathRegexpText[2]
    const data = await fetch(
      `http://${request.nextUrl.hostname}:${request.nextUrl.port}/api/sellers/${id}`
    )
    if (data && data.status === 200) {
      const res = await data.json()
      if (!title || title !== encodeURI(res.seller.name)) {
        request.nextUrl.searchParams.delete("lang")
        return NextResponse.redirect(
          new URL(
            `/seller/${res.seller.id}/${res.seller.name}?${request.nextUrl.searchParams}`,
            request.url
          ),
          301
        )
      }
    }
  }

  const categoryPathRegexp = pathToRegexp("/category/:slug1/:slug2?")
  const categoryPathRegexpText = categoryPathRegexp.exec(
    request.nextUrl.pathname
  )
  if (categoryPathRegexpText) {
    const id = categoryPathRegexpText[1]
    const title = categoryPathRegexpText[2]
    const data = await fetch(
      `http://${request.nextUrl.hostname}:${request.nextUrl.port}/api/category/${id}`
    )

    if (data && data.status === 200) {
      const res = await data.json()
      if (!title || title !== encodeURI(res.category.title)) {
        request.nextUrl.searchParams.delete("lang")
        return NextResponse.redirect(
          new URL(
            `/category/${res.category.id}/${res.category.title}?${request.nextUrl.searchParams}`,
            request.url
          ),
          301
        )
      }
    }
  }

  return NextResponse.rewrite(request.nextUrl.href)
}
