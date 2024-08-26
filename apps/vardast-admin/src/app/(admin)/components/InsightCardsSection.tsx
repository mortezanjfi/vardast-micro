import { useGetTotalInfoQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import InsightCard from "./InsightCard"

type Props = {}

function InsightCardsSection({}: Props) {
  const allInsightInfo = useGetTotalInfoQuery(graphqlRequestClientWithToken)

  return (
    <>
      <InsightCard
        count={allInsightInfo?.data?.totalInfo?.countOfProducts}
        href="/products"
        icon="CubeIcon"
        iconBackground="bg-primary-600"
        title="کالا"
      />
      <InsightCard
        count={allInsightInfo?.data?.totalInfo?.countOfCategories}
        href="/vocabularies"
        icon="Squares2X2Icon"
        iconBackground="bg-blue-500"
        title="دسته بندی"
      />
      <InsightCard
        count={allInsightInfo?.data?.totalInfo?.countOfBrands}
        href="/brands"
        icon="HomeModernIcon"
        iconBackground="bg-success-500"
        title="برند"
      />
      <InsightCard
        count={allInsightInfo?.data?.totalInfo?.countOfUsers}
        href="/users/real"
        icon="UsersIcon"
        iconBackground="bg-indigo-500"
        title="کاربر حقیقی"
      />
      <InsightCard
        count={allInsightInfo?.data?.totalInfo?.countOfSellers}
        href="/users/seller"
        icon="BuildingStorefrontIcon"
        iconBackground="bg-rose-500"
        title="فروشنده"
      />
      <InsightCard
        count={allInsightInfo?.data?.totalInfo?.countOfOrders}
        href={`${process.env.NEXT_PUBLIC_BIDDING_PATH}orders`}
        icon="ClipboardDocumentIcon"
        iconBackground="bg-orange-500"
        title="سفارش"
      />
    </>
  )
}

export default InsightCardsSection
