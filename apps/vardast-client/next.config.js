/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins")
const nextTranslate = require("next-translate-plugin")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@vardast/auth",
    "@vardast/ui",
    "@vardast/validators",
    "@vardast/graphql",
    "@vardast/tsconfig",
    "@vardast/asset",
    "@vardast/auth",
    "@vardast/component",
    "@vardast/hook",
    "@vardast/lib",
    "@vardast/middleware",
    "@vardast/provider",
    "@vardast/query",
    "@vardast/type",
    "@vardast/ui",
    "@vardast/util",
    "@vardast/style",
    "@vardast/tailwind-config"
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
      "trustseal.enamad.ir",
      "storage.vardast.ir",
      "storage.vardast.com"
    ]
  },
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/signin",
        permanent: true
      }
    ]
  },
  poweredByHeader: false
}

module.exports = withPlugins([nextTranslate, withBundleAnalyzer], nextConfig)
