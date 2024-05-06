"use client"

import { ThemeProvider } from "next-themes"

type Props = {
  children: React.ReactNode
}

export default function NextThemeProvider({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
