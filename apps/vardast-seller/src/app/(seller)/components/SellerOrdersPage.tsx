"use client"

import { Dispatch, SetStateAction, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import CardContainer from "@vardast/component/desktop/CardContainer"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import Pagination from "@vardast/component/Pagination"
import {
  PreOrder,
  PreOrdersQuery,
  PreOrderStates
} from "@vardast/graphql/generated"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@vardast/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import { clsx } from "clsx"
import { LucideCheck, LucideChevronDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

type Props = {
  filter?: PreOrderStates
  setFilter?: Dispatch<SetStateAction<PreOrderStates>>
  isMyOrderPage?: boolean
  data: UseQueryResult<PreOrdersQuery, unknown> | any
  currentPage?: number
  setCurrentPage?: Dispatch<SetStateAction<number>>
}
export const PreOrderStatesFa = {
  [PreOrderStates.Created]: {
    className: "tag-secondary",
    name_fa: "ایجاد شده"
  },
  [PreOrderStates.PendingInfo]: {
    className: "tag-warning",
    name_fa: "در انتظار تایید اطلاعات"
  },
  [PreOrderStates.PendingLine]: {
    className: "tag-warning",
    name_fa: "در انتظار افزودن کالا"
  },
  [PreOrderStates.Verified]: { className: "tag-success", name_fa: "تایید شده" }
}
export const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="order" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

export const getContentByApiStatus = (
  apiQuery: UseQueryResult<PreOrdersQuery, unknown>,
  queryLength: boolean
) => {
  if (apiQuery.isLoading) {
    return ApiCallStatusEnum.LOADING
  }
  if (apiQuery.isError) {
    return ApiCallStatusEnum.ERROR
  }
  if (!queryLength || !apiQuery.data.preOrders.data) {
    return ApiCallStatusEnum.EMPTY
  }
  return ApiCallStatusEnum.DEFAULT
}

export const statuses = [
  { filterValue: undefined, name_fa: "همه" },
  {
    filterValue: PreOrderStates.Created,
    name_fa: PreOrderStatesFa[PreOrderStates.Created].name_fa
  },
  {
    filterValue: PreOrderStates.PendingInfo,
    name_fa: PreOrderStatesFa[PreOrderStates.PendingInfo].name_fa
  },
  {
    filterValue: PreOrderStates.PendingLine,
    name_fa: PreOrderStatesFa[PreOrderStates.PendingLine].name_fa
  },
  {
    filterValue: PreOrderStates.Verified,
    name_fa: PreOrderStatesFa[PreOrderStates.Verified].name_fa
  }
]

function SellerOrdersPage({
  filter,
  setFilter,

  setCurrentPage,
  currentPage,
  isMyOrderPage,
  data
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [filterDialog, setFilterDialog] = useState(false)

  const preOrdersLength = useMemo(
    () => data.data?.preOrders?.data.length,
    [data.data?.preOrders?.data.length]
  )

  return (
    <CardContainer title={isMyOrderPage ? "لیست سفارشات من" : "لیست سفارشات"}>
      <div className="flex w-full gap-5 border-b border-alpha-200 pb-5">
        <Popover open={filterDialog} onOpenChange={setFilterDialog}>
          <PopoverTrigger asChild>
            <Button
              noStyle
              role="combobox"
              className="flex items-center gap-3 rounded-full border border-alpha-200 bg-alpha-white px-5 py-2 text-start"
            >
              {" "}
              <span className="text-alpha-500">وضعیت سفارش</span>
              {statuses.find(
                (status) => status && status?.filterValue === filter
              ).name_fa || "همه"}
              <LucideChevronDown className="ms-auto h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandEmpty>
                {t("common:no_entity_found", {
                  entity: t("common:producer")
                })}
              </CommandEmpty>
              <CommandGroup>
                {statuses.map((status, index) => (
                  <CommandItem
                    value={status.filterValue}
                    key={index}
                    onSelect={(value) => {
                      setFilter(status.filterValue)
                      setFilterDialog(false)
                    }}
                  >
                    <LucideCheck
                      className={mergeClasses(
                        "mr-2 h-4 w-4",
                        status.filterValue === filter
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {status.name_fa}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>{" "}
      </div>
      {renderedListStatus[getContentByApiStatus(data, preOrdersLength)] || (
        <div className="overflow-x-auto">
          <table className="table-hover table">
            <thead>
              <tr>
                <th className="border">{t("common:row")}</th>
                <th className="border">
                  {" "}
                  {t("common:entity_code", { entity: t("common:order") })}
                </th>
                <th className="border">{t("common:purchaser")}</th>
                <th className="border">
                  {t("common:entity_name", { entity: t("common:project") })}
                </th>
                <th className="border">{t("common:submition-time")}</th>
                <th className="border">{t("common:order-expire-time")}</th>

                <th>{t("common:status")}</th>
              </tr>
            </thead>

            <tbody className="border-collapse border">
              {data.data?.preOrders?.data.map(
                (preOrder: PreOrder, index: number) =>
                  preOrder && (
                    <tr
                      key={preOrder.id}
                      className="cursor-pointer"
                      onClick={() => {
                        isMyOrderPage
                          ? router.push(
                              `/my-orders/${preOrder.id}/order-detail`
                            )
                          : router.push(`/orders/${preOrder.id}`)
                      }}
                    >
                      <td className="w-4 border">
                        <span>{digitsEnToFa(index + 1)}</span>
                      </td>
                      <td className="border">{preOrder.id}</td>
                      <td className="border">{preOrder.user.fullName}</td>
                      <td className="border">{preOrder?.project?.name}</td>
                      <td className="border">
                        {digitsEnToFa(
                          new Date(preOrder?.request_date).toLocaleDateString(
                            "fa-IR",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit"
                            }
                          )
                        )}
                      </td>
                      <td className="border">
                        {digitsEnToFa(
                          new Date(preOrder?.expire_time).toLocaleDateString(
                            "fa-IR",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit"
                            }
                          )
                        )}
                      </td>

                      <td className="border">
                        <div
                          className={clsx(
                            "tag",
                            PreOrderStatesFa[preOrder?.status].className
                          )}
                        >
                          {/* <Dot /> */}
                          <span>
                            {PreOrderStatesFa[preOrder?.status].name_fa}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        total={data.data?.preOrders?.lastPage ?? 0}
        page={currentPage}
        onChange={(page) => {
          setCurrentPage(page)
        }}
      />
    </CardContainer>
  )
}

export default SellerOrdersPage
