"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import queryClientOptions from "@vardast/query/queryClients/queryClientOptions"

type Props = {
  children: React.ReactNode
}

export default function ReactQueryProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions))

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
