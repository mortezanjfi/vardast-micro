/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import "@vardast/style/globals.css"

import { Metadata, Viewport } from "next"
import startupImage from "@vardast/lib/startupImage"
import NextAuthProvider from "@vardast/provider/NextAuthProvider"
import NextThemeProvider from "@vardast/provider/NextThemeProvider"
import RadixDirectionProvider from "@vardast/provider/RadixDirectionProvider"
import ReactQueryProvider from "@vardast/provider/ReactQueryProvider"
import { RouteChangeProvider } from "@vardast/provider/RouteChangeProvider"
import { Toaster } from "@vardast/provider/ToasterProvider"
import { myColors } from "@vardast/tailwind-config/themes"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"
import NextTopLoader from "nextjs-toploader"

export const metadata: Metadata = {
  title: {
    template: `${process.env.NEXT_PUBLIC_TITLE} | %s`,
    default: process.env.NEXT_PUBLIC_TITLE as string
  },
  appleWebApp: {
    capable: true,
    title: process.env.NEXT_PUBLIC_TITLE,
    startupImage
  },
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: myColors.primary[600],
  maximumScale: 1,
  viewportFit: "cover",
  minimumScale: 1
}
export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobileView = await CheckIsMobileView()

  const { lang } = useTranslation()

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  return (
    <RadixDirectionProvider>
      <html lang={lang} suppressHydrationWarning>
        <body>
          {!isMobileView && (
            <NextTopLoader color={myColors.primary[600]} showSpinner={false} />
          )}
          <NextAuthProvider>
            <ReactQueryProvider>
              <NextThemeProvider>
                <RouteChangeProvider>
                  {/* <FakeSplashScreenProvider isMobileView={isMobileView}> */}
                  {children}
                  {/* </FakeSplashScreenProvider> */}
                </RouteChangeProvider>
                <Toaster />
              </NextThemeProvider>
            </ReactQueryProvider>
          </NextAuthProvider>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-MHFGSPC9"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        </body>
      </html>
    </RadixDirectionProvider>
  )
}
