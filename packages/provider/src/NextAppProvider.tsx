import "@vardast/style/globals.css"

import { Viewport } from "next"
import { myColors } from "@vardast/tailwind-config/themes"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

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
export default async function NextAppProvider({
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
                <RouteChangeProvider>{children}</RouteChangeProvider>
                <Toaster />
              </NextThemeProvider>
            </ReactQueryProvider>
          </NextAuthProvider>
        </body>
      </html>
    </RadixDirectionProvider>
  )
}
