"use client"

import I18nProvider from "next-translate/I18nProvider"

type Props = {
  children: React.ReactNode
}

export default function TranslateProvider({ children }: Props) {
  return <I18nProvider>{children}</I18nProvider>
}
