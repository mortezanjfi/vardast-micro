"use client"

import { DirectionProvider } from "@radix-ui/react-direction"

type Props = {
  children: React.ReactNode
}

export default function RadixDirectionProvider({ children }: Props) {
  return <DirectionProvider dir="rtl">{children}</DirectionProvider>
}
