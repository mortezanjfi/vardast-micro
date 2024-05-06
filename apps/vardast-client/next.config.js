/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins")
const nextTranslate = require("next-translate-plugin")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const nextConfig = {
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
    path: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/_next/image`
  },
  async redirects() {
    return [
      {
        source: "/my-api",
        destination: "https://dev.api.vardast.ir/graphql",
        permanent: true
      },
      {
        source: "/product",
        destination: "/products",
        permanent: true
      },
      {
        source: "/categories",
        destination: "/category",
        permanent: true
      },
      {
        source: "/brand",
        destination: "/brands",
        permanent: true
      },
      {
        source: "/seller-panel/products",
        destination: "/seller-panel/products/all-products",
        permanent: true
      },
      {
        source: "/seller",
        destination: "/sellers",
        permanent: true
      }
    ]
  },
  poweredByHeader: false
}

module.exports = withPlugins([nextTranslate, withBundleAnalyzer], nextConfig)
