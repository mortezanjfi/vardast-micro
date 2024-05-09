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
    path: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}`
  },
  async redirects() {
    return [
      // {
      //   source: `${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}`,
      //   destination: `${process.env.NEXT_PUBLIC_AUTHENTICATION_URL}${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/signin`,
      //   permanent: true
      // },
      // {
      //   source: `${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/:path*`,
      //   destination: `${process.env.NEXT_PUBLIC_AUTHENTICATION_URL}${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/:path*`,
      //   permanent: true
      // },
      // {
      //   source: "/authentication/signin",
      //   destination: `${process.env.NEXT_PUBLIC_AUTHENTICATION_URL}${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/signin`,
      //   permanent: true
      // },
      // {
      //   source: "/authentication/signout",
      //   destination: `${process.env.NEXT_PUBLIC_AUTHENTICATION_URL}${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/signout`,
      //   permanent: true
      // },
      // {
      //   source: "/authentication/request-seller",
      //   destination: `${process.env.NEXT_PUBLIC_AUTHENTICATION_URL}${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/request-seller`,
      //   permanent: true
      // },
      // {
      //   source: "/authentication/redirect",
      //   destination: `${process.env.NEXT_PUBLIC_AUTHENTICATION_URL}${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/redirect`,
      //   permanent: true
      // },
      // {
      //   source: `/api/auth/:path*`,
      //   destination: `${process.env.NEXT_PUBLIC_AUTHENTICATION_URL}${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/api/auth/:path*`,
      //   permanent: true
      // },
      {
        source: "/authentication",
        destination: "/authentication/signin",
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
        source: "/seller",
        destination: "/sellers",
        permanent: true
      }
    ]
  },
  poweredByHeader: false
}

module.exports = withPlugins([nextTranslate, withBundleAnalyzer], nextConfig)
