/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import "@vardast/style/globals.css"

import { Metadata, Viewport } from "next"
import Script from "next/script"
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
  manifest:
    process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller"
      ? "/manifest.seller.json"
      : "/manifest.json",
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
        <head>
          {process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "user" && (
            <>
              <link rel="canonical" href="https://www.vardast.com/" />
              <Script async id="google-tag-manager" strategy="afterInteractive">
                {`<!-- Google Tag Manager -->
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MHFGSPC9');
              <!-- End Google Tag Manager -->
              `}
              </Script>
            </>
          )}
        </head>
        <body>
          {(process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller" ||
            !isMobileView) && (
            <NextTopLoader
              color={
                process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller"
                  ? myColors.secondary[600]
                  : myColors.primary[600]
              }
              showSpinner={false}
            />
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
          {process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "user" && (
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MHFGSPC9"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>
            </noscript>
          )}
        </body>
      </html>
    </RadixDirectionProvider>
  )
}
