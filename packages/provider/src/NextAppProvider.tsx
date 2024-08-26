import "@vardast/style/globals.css"

import { Metadata, Viewport } from "next"
import Script from "next/script"
import startupImage from "@vardast/lib/startupImage"
import { myColors } from "@vardast/tailwind-config/themes"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"
import NextTopLoader from "nextjs-toploader"

import NextAuthProvider from "./NextAuthProvider"
import NextThemeProvider from "./NextThemeProvider"
import RadixDirectionProvider from "./RadixDirectionProvider"
import ReactQueryProvider from "./ReactQueryProvider"
import { RouteChangeProvider } from "./RouteChangeProvider"
import { Toaster } from "./ToasterProvider"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: myColors.primary[600],
  maximumScale: 1,
  viewportFit: "cover",
  minimumScale: 1
}
export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_TITLE} `,
    default: process.env.NEXT_PUBLIC_TITLE
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

export default async function NextAppProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { lang } = useTranslation()
  const isMobileView = await CheckIsMobileView()

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_SITE_URL === "https://vardast.com" && (
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
        )}
      </head>
      <body>
        {!isMobileView && (
          <NextTopLoader color={myColors.primary[600]} showSpinner={false} />
        )}
        <RadixDirectionProvider>
          <NextAuthProvider>
            <ReactQueryProvider>
              <NextThemeProvider>
                <RouteChangeProvider>{children}</RouteChangeProvider>
                <Toaster />
              </NextThemeProvider>
            </ReactQueryProvider>
          </NextAuthProvider>
        </RadixDirectionProvider>
        {process.env.NEXT_PUBLIC_SITE_URL === "https://vardast.com" && (
          <noscript>
            <iframe
              height="0"
              src="https://www.googletagmanager.com/ns.html?id=GTM-MHFGSPC9"
              style={{ display: "none", visibility: "hidden" }}
              width="0"
            ></iframe>
          </noscript>
        )}
      </body>
    </html>
  )
}
