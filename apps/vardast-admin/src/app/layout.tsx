/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import "@vardast/style/globals.css"

import { Viewport } from "next"
import NextAuthProvider from "@vardast/provider/NextAuthProvider"
import NextThemeProvider from "@vardast/provider/NextThemeProvider"
import RadixDirectionProvider from "@vardast/provider/RadixDirectionProvider"
import ReactQueryProvider from "@vardast/provider/ReactQueryProvider"
import { RouteChangeProvider } from "@vardast/provider/RouteChangeProvider"
import { Toaster } from "@vardast/provider/ToasterProvider"
import { myColors } from "@vardast/tailwind-config/themes"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

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
  const { lang } = useTranslation()

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  return (
    <RadixDirectionProvider>
      <html lang={lang} suppressHydrationWarning>
        <body>
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
        </body>
      </html>
    </RadixDirectionProvider>
  )
}
