"use client"

import { ThemeProvider } from "next-themes"

type Props = {
  children: React.ReactNode
}

export default function NextThemeProvider({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  )
}
