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
      if (!name || name !== encodeURI(res.product.name.trim())) {
        return NextResponse.redirect(
          new URL(
            `/product/${res.product.id}/${res.product.name.trim()}`,
            request.url
          ),
          301
        )
      }
    }
  }

  const orderPathRegexp = pathToRegexp("/profile/orders/:uuid*")

  const orderPathRegexpText = orderPathRegexp.exec(request.nextUrl.pathname)
  if (orderPathRegexpText) {
    const url = request.nextUrl.clone()
    const response = NextResponse.next()
    response.headers.set("x-url-pathname", url.pathname)
    return response
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
      if (!title || title !== encodeURI(res.category.title.trim())) {
        request.nextUrl.searchParams.delete("lang")
        return NextResponse.redirect(
          new URL(
            `/products/${res.category.id}/${res.category.title.trim()}?${request.nextUrl.searchParams}`,
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
      if (!title || title !== encodeURI(res.brand.name_fa.trim())) {
        request.nextUrl.searchParams.delete("lang")
        return NextResponse.redirect(
          new URL(
            `/brand/${res.brand.id}/${res.brand.name_fa.trim()}?${request.nextUrl.searchParams}`,
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
      if (!title || title !== encodeURI(res.seller.name.trim())) {
        request.nextUrl.searchParams.delete("lang")
        return NextResponse.redirect(
          new URL(
            `/seller/${res.seller.id}/${res.seller.name.trim()}?${request.nextUrl.searchParams}`,
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
      if (!title || title !== encodeURI(res.category.title.trim())) {
        request.nextUrl.searchParams.delete("lang")
        return NextResponse.redirect(
          new URL(
            `/category/${res.category.id}/${res.category.title.trim()}?${request.nextUrl.searchParams}`,
            request.url
          ),
          301
        )
      }
    }
  }

  return NextResponse.rewrite(request.nextUrl.href)
}
