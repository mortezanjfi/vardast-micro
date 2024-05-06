import { QueryClient } from "@tanstack/react-query"

import queryClientOptions from "./queryClientOptions"

const getQueryClient = () => new QueryClient(queryClientOptions)
export default getQueryClient
