"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { PreOrder, PreOrderStates } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import { clsx } from "clsx"
import { LucideEdit, LucideMoreVertical, LucideTrash } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import Link from "../Link"
import { DetailsWithTitle } from "./DetailsWithTitle"

type OrderCardProps = {
  isSellerPanel?: boolean
  preOrder: PreOrder
  setOrderToDelete?: Dispatch<SetStateAction<PreOrder>>
  setDeleteModalOpen?: Dispatch<SetStateAction<boolean>>
}

export const PreOrderStatesFa = {
  [PreOrderStates.Created]: {
    className: "tag-gray",
    name_fa: "ایجاد شده"
  },
  [PreOrderStates.PendingInfo]: {
    className: "tag-info",
    name_fa: "در انتظار تایید اطلاعات"
  },
  [PreOrderStates.PendingLine]: {
    className: "tag-warning",
    name_fa: "در انتظار افزودن کالا"
  },
  [PreOrderStates.Verified]: { className: "tag-primary", name_fa: "تایید شده" },
  [PreOrderStates.Closed]: { className: "tag-success", name_fa: "بسته شده" }
}

const OrderCard = ({
  isSellerPanel,
  preOrder,
  setOrderToDelete,
  setDeleteModalOpen
}: OrderCardProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div
      onClick={() => {
        isSellerPanel && router.push(`/orders/${preOrder?.id}`)
      }}
      className="flex w-full flex-col gap-4 border-b border-alpha-200 py-4 md:py-11"
    >
      <div className="flex w-full items-center justify-between">
        {/* <span className="text-base font-semibold">{preOrder?.name}</span> */}
        <div className="flex gap-3 md:gap-9">
          {isSellerPanel && (
            <div className="tag tag-gray">
              {/* <Dot /> */}
              <span>کدسفارش</span>
              <span>{preOrder?.id}</span>
            </div>
          )}
          <div
            className={clsx(
              "tag",
              PreOrderStatesFa[preOrder?.status]?.className
            )}
          >
            {/* <Dot /> */}
            <span>{PreOrderStatesFa[preOrder?.status]?.name_fa}</span>
          </div>

          {!isSellerPanel && (
            <Button
              variant="secondary"
              className="tag"
              onClick={() => {
                router.push(`/profile/orders/${preOrder?.id}/offers`)
              }}
            >
              <span>{t("common:price-offer")}</span>
              <span className="flex h-[19px] w-[19px] flex-col items-center justify-center rounded-full  bg-error-500 text-alpha-white">
                {digitsEnToFa(preOrder?.offersNum)}
              </span>
            </Button>
          )}
        </div>
        {!isSellerPanel && (
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
                {preOrder.status !== PreOrderStates.Closed && (
                  <>
                    <Link href={`/profile/orders/${preOrder?.id}/info`}>
                      <DropdownMenuItem>
                        <LucideEdit className="dropdown-menu-item-icon" />
                        <span>{t("common:edit")}</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onSelect={() => {
                    setOrderToDelete(preOrder)
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
        )}
      </div>
      <div className="flex flex-col items-start gap-1 md:flex-row md:gap-9">
        {isSellerPanel ? (
          <DetailsWithTitle title={"خریدار"} text={preOrder.user.fullName} />
        ) : (
          <DetailsWithTitle title={"کد سفارش"} text={preOrder?.id} />
        )}

        <DetailsWithTitle title={"پروژه"} text={preOrder?.project?.name} />
        <DetailsWithTitle
          title={t("common:submition-time")}
          text={
            preOrder.request_date
              ? convertToPersianDate({
                  dateString: preOrder.request_date,
                  withHour: true,
                  withMinutes: true
                })
              : ""
          }
        />
        <DetailsWithTitle
          title={t("common:order-expire-time")}
          text={
            preOrder?.expire_time
              ? digitsEnToFa(
                  new Date(preOrder?.expire_time).toLocaleDateString("fa-IR", {
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
  )
}

export default OrderCard
