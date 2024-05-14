import "@vardast/style/globals.css"

import { Metadata, Viewport } from "next"
import startupImage from "@vardast/lib/startupImage"
import { myColors } from "@vardast/tailwind-config/themes"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { CheckIsTwa } from "@vardast/util/checkIsTwa"
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

export default async function NextAppProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { lang } = useTranslation()
  const isMobileView = await CheckIsMobileView()
  const isTwa = await CheckIsTwa()

  console.log({ isTwa })

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  return (
    <html lang={lang} suppressHydrationWarning>
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
      </body>
    </html>
  )
}
