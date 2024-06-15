"use client"

import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import { useGetTotalInfoQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

const AdminInsight = () => {
  const allInsightInfo = useGetTotalInfoQuery(graphqlRequestClientWithToken)
  console.log(allInsightInfo)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Link href="/products">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">کالاها</div>
          {allInsightInfo.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(
                addCommas(`${allInsightInfo.data.totalInfo.countOfProducts}`)
              )}
            </div>
          )}
        </div>
      </Link>
      <Link href="/">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">برندها</div>
          {allInsightInfo.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(
                addCommas(`${allInsightInfo.data.totalInfo.countOfBrands}`)
              )}
            </div>
          )}
        </div>
      </Link>
      <Link href="/users">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">کاربران</div>
          {allInsightInfo.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(
                addCommas(`${allInsightInfo.data.totalInfo.countOfUsers}`)
              )}
            </div>
          )}
        </div>
      </Link>
      <Link href="/sellers">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">فروشندگان</div>
          {allInsightInfo.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(
                addCommas(`${allInsightInfo.data.totalInfo.countOfSellers}`)
              )}
            </div>
          )}
        </div>
      </Link>
      <Link href="/vocabularies">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">دسته‌بندی‌ها</div>
          {allInsightInfo.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(
                addCommas(`${allInsightInfo.data.totalInfo.countOfCategories}`)
              )}
            </div>
          )}
        </div>
      </Link>
      <div className="card flex flex-col gap-2 rounded p-4">
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
      </div>
    </div>
  )
}

export default AdminInsight
