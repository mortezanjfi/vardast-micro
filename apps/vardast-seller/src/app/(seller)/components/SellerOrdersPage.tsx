"use client"

import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import CardContainer from "@vardast/component/desktop/CardContainer"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@vardast/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import { LucideChevronDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

type Props = { isMyOrderPage?: boolean; data: any }
const statuses = [
  {
    status: "دارد",
    value: "true"
  },
  { status: "ندارد", value: "false" },
  {
    status: "همه",
    value: ""
  }
]

function SellerOrdersPage({ isMyOrderPage, data }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <CardContainer title={isMyOrderPage ? "لیست سفارشات من" : "لیست سفارشات"}>
      <div className="flex w-full gap-5 border-b border-alpha-200 pb-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              noStyle
              role="combobox"
              className="flex items-center gap-3 rounded-full border border-alpha-200 bg-alpha-white px-5 py-2 text-start"
            >
              <span className="text-alpha-500">پروژه</span>
              همه
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
                {statuses.map((st) => (
                  <CommandItem
                    value={st.value}
                    key={st.status}
                    // onSelect={(value) => {
                    //   form.setValue("logoStatus", value)
                    // }}
                  >
                    {/* <LucideCheck
                      className={mergeClasses(
                        "mr-2 h-4 w-4",
                        st.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    /> */}
                    {st.status}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>{" "}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              noStyle
              role="combobox"
              className="flex items-center gap-3 rounded-full border border-alpha-200 bg-alpha-white px-5 py-2 text-start"
            >
              {" "}
              <span className="text-alpha-500">وضعیت سفارش</span>
              همه
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
                {statuses.map((st) => (
                  <CommandItem
                    value={st.value}
                    key={st.status}
                    // onSelect={(value) => {
                    //   form.setValue("logoStatus", value)
                    // }}
                  >
                    {/* <LucideCheck
                      className={mergeClasses(
                        "mr-2 h-4 w-4",
                        st.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    /> */}
                    {st.status}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>{" "}
      </div>
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
          {data.map(
            (order: any, index: number) =>
              order && (
                <tr
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => {
                    isMyOrderPage
                      ? router.push(`/my-orders/${order.id}/order-detail`)
                      : router.push(`/orders/${order.id}/order-detail`)
                  }}
                >
                  <td className="w-4 border">
                    <span>{digitsEnToFa(index + 1)}</span>
                  </td>
                  <td className="border">{order.projectCode}</td>
                  <td className="border">{order.purchaser}</td>
                  <td className="border">{order.projectName}</td>
                  <td className="border">
                    {digitsEnToFa(
                      new Date(order.dateOfSubmission).toLocaleDateString(
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
                      new Date(order.dateOfExpiry).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                      })
                    )}
                  </td>

                  <td className="border">
                    {order.status ? (
                      <span className="tag  tag-sm tag-success">
                        {t("common:active")}
                      </span>
                    ) : (
                      <span className="tag tag-sm tag-danger">
                        {t("common:not-active")}
                      </span>
                    )}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
      {/* <Pagination
          total={orders.data?.orders.lastPage ?? 0}
          page={currentPage}
          onChange={(page) => {
            setCurrentPage(page)
          }}
        /> */}
    </CardContainer>
  )
}

export default SellerOrdersPage
