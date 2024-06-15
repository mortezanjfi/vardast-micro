import { dehydrate } from "@tanstack/react-query"
import PurchasersPage from "@vardast/component/purchasers/PurchasersPage"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

type Props = {}

export default async () => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)
  return (
    <ReactQueryHydrate state={dehydratedState}>
      <PurchasersPage />
    </ReactQueryHydrate>
  )
}
