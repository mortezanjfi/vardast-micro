import { dehydrate } from "@tanstack/react-query"
import AllLegalUsers from "@vardast/component/legal/AllLegalUsers"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

type Props = {}

export default async () => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)
  return (
    <ReactQueryHydrate state={dehydratedState}>
      <AllLegalUsers />
    </ReactQueryHydrate>
  )
}
