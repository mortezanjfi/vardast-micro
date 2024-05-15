"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import { Dot, LucideMoreVertical, LucideTrash } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { Order } from "@/app/(client)/(profile)/profile/orders/components/OrdersPage"
import { DetailsWithTitle } from "@/app/(client)/(profile)/profile/projects/components/DetailsWithTitle"

type OrderCardProps = {
  order: Order
  setOrderToDelete: Dispatch<SetStateAction<{} | undefined>>
  setDeleteModalOpen: Dispatch<SetStateAction<boolean>>
}

const OrderCard = ({
  order,
  setOrderToDelete,
  setDeleteModalOpen
}: OrderCardProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex w-full  items-start justify-between border-b  border-alpha-200 py-4">
      {" "}
      <div className="flex flex-col gap-4 py-7">
        <div className="flex items-center gap-9">
          <span className="text-base font-semibold">{order.name}</span>
          <div className="tag tag-success">
            <Dot />
            <span>{order.status}</span>
          </div>
          <Button
            variant="secondary"
            className="tag"
            onClick={() => {
              console.log(order.id)
              router.push(`/profile/orders/${order.id}/offers`)
            }}
          >
            <span>{t("common:price-offer")}</span>
            <span className="flex h-[19px] w-[19px] flex-col items-center justify-evenly rounded-full  bg-error-500 text-alpha-white">
              {order.offer.total}
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-9">
          <DetailsWithTitle title={"کد سفارش"} text={order.title} />
          <DetailsWithTitle title={"پروژه"} text={order.name} />
          <DetailsWithTitle
            title={t("common:submition-time")}
            text={
              order.createdAt
                ? digitsEnToFa(
                    new Date(order.createdAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit"
                    })
                  )
                : ""
            }
          />
          <DetailsWithTitle
            title={t("common:order-expire-time")}
            text={
              order.expiresAt
                ? digitsEnToFa(
                    new Date(order.expiresAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit"
                    })
                  )
                : ""
            }
          />
        </div>
      </div>
      <DropdownMenu
        modal={false}
        open={dropDownMenuOpen}
        onOpenChange={setDropDownMenuOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" iconOnly>
            <LucideMoreVertical className="icon text-black" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setOrderToDelete(order)
                setDeleteModalOpen(true)
              }}
              className="danger"
            >
              <LucideTrash className="dropdown-menu-item-icon" />
              <span>{t("common:delete")}</span>
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default OrderCard
