import { QueryClientConfig } from "@tanstack/react-query"

const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity
    }
  }
}

export default queryClientOptions
