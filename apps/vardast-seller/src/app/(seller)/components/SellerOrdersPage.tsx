"use client"

import { Dispatch, SetStateAction, useMemo } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import CardContainer from "@vardast/component/desktop/CardContainer"
import OrderCard, {
  PreOrderStatesFa
} from "@vardast/component/desktop/OrderCart"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import NotFoundMessage from "@vardast/component/NotFound"
import Pagination from "@vardast/component/Pagination"
import {
  PreOrder,
  PreOrderDto,
  PreOrdersQuery,
  PreOrderStates
} from "@vardast/graphql/generated"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { clsx } from "clsx"
import useTranslation from "next-translate/useTranslation"

type Props = {
  goToOffers: boolean
  isMobileView?: boolean
  filter?: PreOrderStates
  setFilter?: Dispatch<SetStateAction<PreOrderStates>>
  isMyOrderPage?: boolean
  preOrdersQuery: UseQueryResult<PreOrdersQuery, unknown>
  currentPage?: number
  setCurrentPage?: Dispatch<SetStateAction<number>>
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

function SellerOrdersPage({
  // filter,
  // setFilter,
  goToOffers,
  isMobileView,
  setCurrentPage,
  currentPage,
  isMyOrderPage,
  preOrdersQuery
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()

  // const [filterDialog, setFilterDialog] = useState(false)

  const preOrdersLength = useMemo(
    () => preOrdersQuery.data?.preOrders?.data?.length,
    [preOrdersQuery.data?.preOrders?.data.length]
  )

  return isMobileView ? (
    <>
      {preOrdersQuery.isFetching && preOrdersQuery.isLoading ? (
        <div className="flex h-full items-center justify-center pt-6">
          <Loading hideMessage />
        </div>
      ) : preOrdersQuery.data?.preOrders?.data.length > 0 ? (
        <>
          {preOrdersQuery.data?.preOrders?.data.map((preOrder, index) => (
            <OrderCard
              goToOffers={goToOffers}
              isSellerPanel={true}
              key={index}
              preOrder={preOrder as PreOrder & PreOrderDto}
            />
          ))}
        </>
      ) : (
        <NotFoundMessage text="سفارشی" />
      )}
    </>
  ) : (
    <CardContainer
      title={
        isMobileView ? "" : isMyOrderPage ? "لیست سفارشات من" : "لیست سفارشات"
      }
    >
      {/* <div className="flex w-full gap-5 border-b border-alpha-200 pb-5">
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
      </div> */}
      {renderedListStatus[
        getContentByApiStatus(preOrdersQuery, !!preOrdersLength)
      ] || (
        <div className="overflow-x-auto">
          <table className="table-hover table">
            <thead>
              <tr>
                <th>{t("common:row")}</th>
                <th>
                  {t("common:entity_code", { entity: t("common:order") })}
                </th>
                <th>{t("common:purchaser")}</th>
                <th>
                  {t("common:entity_name", { entity: t("common:project") })}
                </th>
                <th>{t("common:submission-time")}</th>
                <th>{t("common:order-expire-time")}</th>

                <th>{t("common:status")}</th>
              </tr>
            </thead>

            <tbody className="border-collapse border">
              {preOrdersQuery.data?.preOrders?.data.map((preOrder, index) => (
                <tr
                  key={preOrder?.id}
                  className="cursor-pointer hover:bg-alpha-50"
                  onClick={() => {
                    isMyOrderPage
                      ? router.push(`/my-orders/${preOrder?.id}/offers`)
                      : router.push(`/orders/${preOrder?.id}`)
                  }}
                >
                  <td className="w-4">
                    <span>{digitsEnToFa(index + 1)}</span>
                  </td>
                  <td>{preOrder?.id && digitsEnToFa(preOrder?.id)}</td>
                  <td>
                    {preOrder?.user?.fullName &&
                      digitsEnToFa(preOrder?.user?.fullName)}
                  </td>
                  <td>{preOrder?.project?.name}</td>
                  <td>
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
                  <td>
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

                  <td>
                    <div
                      className={clsx(
                        "tag",
                        PreOrderStatesFa[preOrder?.status]?.className
                      )}
                    >
                      {/* <Dot /> */}
                      <span>{PreOrderStatesFa[preOrder?.status]?.name_fa}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        total={preOrdersQuery.data?.preOrders?.lastPage ?? 0}
        page={currentPage}
        onChange={(page) => {
          setCurrentPage(page)
        }}
      />
    </CardContainer>
  )
}

export default SellerOrdersPage
