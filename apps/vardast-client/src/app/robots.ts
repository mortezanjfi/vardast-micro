import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.NEXT_PUBLIC_SITE_URL === "https://vardast.com"
        ? {
            userAgent: "*"
          }
        : {
            userAgent: "*",
            disallow: "/"
          },
    sitemap: "https://vardast.com/sitemap.xml",
    host: "vardast.com"
  }
}
