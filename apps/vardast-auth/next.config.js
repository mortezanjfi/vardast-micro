/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins")
const nextTranslate = require("next-translate-plugin")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH,
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@vardast/auth",
    "@vardast/ui",
    "@vardast/validators",
    "@vardast/graphql"
  ],
  webpack: (config) => {
    config.resolve.alias.canvas = false

    return config
  },
  productionBrowserSourceMaps: true,
  // experimental: {
  //   serverActions: true
  // },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "api.dicebear.com",
      "localhost",
      "static.vardast.com",
      "stage.vardast.com",
      "vardast.com",
      "blog.vardast.com",
      "storage",
      "trustseal.enamad.ir"
    ],
    path: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}`
  },
  poweredByHeader: false
}

module.exports = withPlugins([nextTranslate, withBundleAnalyzer], nextConfig)
