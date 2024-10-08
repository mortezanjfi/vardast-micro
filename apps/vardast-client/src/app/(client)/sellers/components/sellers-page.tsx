"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { useDebouncedState } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import { checkLimitPageByCondition } from "@vardast/component/product-list"
import {
  GetAllSellersQuery,
  IndexSellerInput
} from "@vardast/graphql/generated"
import { setBreadCrumb } from "@vardast/provider/LayoutProvider/use-layout"
import { getAllSellersQueryFn } from "@vardast/query/queryFns/allSellersQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"
import { Input } from "@vardast/ui/input"
import clsx from "clsx"
import { Loader2, LucideSearch, LucideX } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import SellersList from "@/app/(client)/sellers/components/SellersList"

interface SellersPageProps {
  isMobileView: boolean
  args: IndexSellerInput
  limitPage?: number
  hasSearch?: boolean
}

const SellersPage = ({
  isMobileView,
  limitPage,
  args,
  hasSearch
}: SellersPageProps) => {
  const [query, setQuery] = useDebouncedState<string>("", 500)
  const [queryTemp, setQueryTemp] = useState<string>("")

  const { t } = useTranslation()

  const allSellersQuery = useInfiniteQuery<GetAllSellersQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_SELLERS_QUERY_KEY,
      {
        ...args,
        name: query,
        page: args.page || 1
      }
    ],
    ({ pageParam = 1 }) =>
      getAllSellersQueryFn({
        ...args,
        name: query,
        page: pageParam
      }),
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return limitPage
          ? checkLimitPageByCondition(
              lastPage.sellers.currentPage <= limitPage,
              allPages
            )
          : checkLimitPageByCondition(
              lastPage.sellers.currentPage < lastPage.sellers.lastPage,
              allPages
            )
      }
    }
  )

  if (!allSellersQuery.data) notFound()

  setBreadCrumb([
    {
      label: t("common:sellers_vardast"),
      path: "/sellers",
      isCurrent: true
    }
  ])

  return (
    <div
      className={clsx(
        "flex flex-col gap-9 ",
        !isMobileView && "bg-alpha-white"
      )}
    >
      {hasSearch && (
        <div className="bg-alpha-white p md:w-1/4">
          {" "}
          <div className="relative flex transform items-center rounded-lg border-alpha-200 bg-alpha-100  pr-2 transition-all">
            {allSellersQuery.isFetching ||
            allSellersQuery.isLoading ||
            queryTemp !== query ? (
              <Loader2 className="h-6 w-6 animate-spin text-alpha-400" />
            ) : (
              <LucideSearch className="h-6 w-6 text-primary" />
            )}
            <Input
              autoFocus
              className="flex h-full
              w-full
              items-center
              gap-2
              rounded-lg
              bg-alpha-100
              px-4
              py-3
              focus:!ring-0 disabled:bg-alpha-100"
              defaultValue={query}
              placeholder="نام کالا | برند | فروشنده | دسته بندی | SKU"
              type="text"
              value={queryTemp}
              onChange={(e) => {
                setQueryTemp(e.target.value)
                setQuery(e.target.value)
              }}
            />
            <Button
              className="rounded-full"
              iconOnly
              size="small"
              variant="ghost"
              onClick={() => {
                setQuery("")
                setQueryTemp("")
              }}
            >
              <LucideX className="icon" />
            </Button>
          </div>
        </div>
      )}
      <SellersList
        args={args}
        isMobileView={isMobileView}
        limitPage={limitPage}
      />
    </div>
  )
}

export default SellersPage
