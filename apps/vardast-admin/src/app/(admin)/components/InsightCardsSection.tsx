import { useGetTotalInfoQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import InsightCard from "./InsightCard"

type Props = {}

function InsightCardsSection({}: Props) {
  const allInsightInfo = useGetTotalInfoQuery(graphqlRequestClientWithToken)

  return (
    <div className="row-span-1 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <InsightCard
        href="/products"
        title="کالا"
        count={allInsightInfo?.data?.totalInfo?.countOfProducts}
        icon="CubeIcon"
        iconBackground="bg-primary-600"
      />
      <InsightCard
        href="/vocabularies"
        title="دسته بندی"
        count={allInsightInfo?.data?.totalInfo?.countOfCategories}
        icon="Squares2X2Icon"
        iconBackground="bg-blue-500"
      />
      <InsightCard
        href="/"
        title="برند"
        count={allInsightInfo?.data?.totalInfo?.countOfBrands}
        icon="HomeModernIcon"
        iconBackground="bg-success-500"
      />
      <InsightCard
        href="/users/admin"
        title="کاربر"
        count={allInsightInfo?.data?.totalInfo?.countOfUsers}
        icon="UsersIcon"
        iconBackground="bg-indigo-500"
      />
      <InsightCard
        href="/sellers"
        title="فروشنده"
        count={allInsightInfo?.data?.totalInfo?.countOfSellers}
        icon="BuildingStorefrontIcon"
        iconBackground="bg-rose-500"
      />
      <InsightCard
        href="/orders"
        title="سفارش"
        count={allInsightInfo?.data?.totalInfo?.countOfOrders}
        icon="ClipboardDocumentIcon"
        iconBackground="bg-orange-500"
      />

      {/* <div className="card flex flex-col gap-2 rounded p-4">
  <div className="font-bold text-alpha-400">وبسایت ها</div>
  {allInsightInfo.isLoading ? (
    <div className="animate-pulse">
      <div className="h-5 w-full rounded-md bg-alpha-200"></div>
    </div>
  ) : (
    <div className="text-xl font-bold text-alpha-800">
      {digitsEnToFa(
        addCommas(`${allInsightInfo.data.totalInfo.countOfSellersOnline}`)
      )}
    </div>
  )}
</div>
<div className="card flex flex-col gap-2 rounded p-4">
  <div className="font-bold text-alpha-400">نمایندگان فروش</div>
  {allInsightInfo.isLoading ? (
    <div className="animate-pulse">
      <div className="h-5 w-full rounded-md bg-alpha-200"></div>
    </div>
  ) : (
    <div className="text-xl font-bold text-alpha-800">
      {digitsEnToFa(
        addCommas(
          `${allInsightInfo.data.totalInfo.countOfSellersOffline}`
        )
      )}
    </div>
  )}
</div>
<div className="card flex flex-col gap-2 rounded p-4">
  <div className="font-bold text-alpha-400">فروشنده ثبت نامی</div>
  {allInsightInfo.isLoading ? (
    <div className="animate-pulse">
      <div className="h-5 w-full rounded-md bg-alpha-200"></div>
    </div>
  ) : (
    <div className="text-xl font-bold text-alpha-800">
      {digitsEnToFa(
        addCommas(`${allInsightInfo.data.totalInfo.countOfSellersNormal}`)
      )}
    </div>
  )}
</div>
<div className="card flex flex-col gap-2 rounded p-4">
  <div className="font-bold text-alpha-400">اضافه شده به وردست</div>
  {allInsightInfo.isLoading ? (
    <div className="animate-pulse">
      <div className="h-5 w-full rounded-md bg-alpha-200"></div>
    </div>
  ) : (
    <div className="text-xl font-bold text-alpha-800">
      {digitsEnToFa(
        addCommas(
          `${allInsightInfo.data.totalInfo.countOfSellersExtended}`
        )
      )}
    </div>
  )}
</div> */}
    </div>
  )
}

export default InsightCardsSection
