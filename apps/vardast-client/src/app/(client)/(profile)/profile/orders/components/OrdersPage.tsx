"use client"

import { useState } from "react"
import { ListBulletIcon } from "@heroicons/react/24/solid"
import Link from "@vardast/component/Link"
import PageHeader from "@vardast/component/PageHeader"
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

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import OrderCard from "@/app/(client)/(profile)/profile/orders/components/OrderCart"
import OrderDeleteModal from "@/app/(client)/(profile)/profile/orders/components/OrderDeleteModal"

export interface Order {
  id: number
  title: string
  status: string
  offer: { total: number }
  projectCode: number
  name: string
  createdAt: Date
  expiresAt: Date
}

type OrdersPageProps = { title: string }

const OrdersPage = ({ title }: OrdersPageProps) => {
  const { t } = useTranslation()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [orderToDelete, setOrderToDelete] = useState<{}>()
  // eslint-disable-next-line no-unused-vars
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 2,
      title: "Fake Order 2",
      status: "Completed",
      offer: { total: 2 },
      projectCode: 456,
      name: "test1",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: 1,
      title: "Fake Order 1",
      status: "Pending",
      offer: { total: 1 },
      projectCode: 123,
      name: "test2",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ])
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

  return (
    <div className="flex h-full w-full flex-col">
      <OrderDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        orderToDelete={orderToDelete}
      />
      <PageTitle title={title} />
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
      <PageHeader
        pageHeaderClasses="border-b py-5 !mb-0"
        title={"سفارش خود را ثبت کنید و بهترین قیمت را از وردست بخواهید."}
        titleClasses="text-[14px] font-normal "
        containerClass="items-center"
      >
        <Link
          href={`
             /profile/orders/${new Date().getTime()}/addOrderInfo
           `}
        >
          <Button variant="primary" size="medium">
            {t("common:add_new_entity", {
              entity: t("common:order")
            })}
          </Button>
        </Link>
      </PageHeader>
      <div className="w-full">
        {orders.length > 0 ? (
          <div className="flex flex-col">
            {orders.map((order, index) => (
              <OrderCard
                key={index}
                order={order}
                setOrderToDelete={setOrderToDelete}
                setDeleteModalOpen={setDeleteModalOpen}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-5 py-7">
            <ListBulletIcon width={64} height={64} className="text-alpha-400" />
            <p>شما هنوز پروژه ای اضافه نکرده اید!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
