"use client"

import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import {
  useGetAllBrandsQuery,
  useGetAllCategoriesV2Query,
  useGetAllProductsQuery,
  useGetAllSellersQuery,
  useGetAllUsersQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

const AdminInsight = () => {
  const users = useGetAllUsersQuery(graphqlRequestClientWithToken)
  const products = useGetAllProductsQuery(graphqlRequestClientWithToken)
  const sellers = useGetAllSellersQuery(graphqlRequestClientWithToken)
  const brands = useGetAllBrandsQuery(graphqlRequestClientWithToken)

  const allCategoriesQuery = useGetAllCategoriesV2Query(
    graphqlRequestClientWithToken,
    {
      indexCategoryInput: {
        // vocabularyId: 1
      }
    }
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Link href="/products">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">کالاها</div>
          {products.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(addCommas(`${products.data?.products.total}`))}
            </div>
          )}
        </div>
      </Link>
      <Link href="/">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">برندها</div>
          {brands.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(addCommas(`${brands.data?.brands.total}`))}
            </div>
          )}
        </div>
      </Link>
      <Link href="/users">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">کاربران</div>
          {users.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(addCommas(`${users.data?.users.total}`))}
            </div>
          )}
        </div>
      </Link>
      <Link href="/sellers">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">فروشندگان</div>
          {sellers.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(addCommas(`${sellers.data?.sellers.total}`))}
            </div>
          )}
        </div>
      </Link>
      <Link href="/vocabularies">
        <div className="card flex flex-col gap-2 rounded p-4">
          <div className="font-bold text-alpha-400">دسته‌بندی‌ها</div>
          {allCategoriesQuery.isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-alpha-800">
              {digitsEnToFa(
                addCommas(`${allCategoriesQuery.data?.allCategoriesV2.length}`)
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export default AdminInsight
