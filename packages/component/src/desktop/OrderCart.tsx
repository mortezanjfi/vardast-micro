"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import {
  PaymentMethodEnum,
  PreOrder,
  PreOrderDto,
  PreOrderStates
} from "@vardast/graphql/generated"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import clsx from "clsx"
import { LucideEdit, LucideMoreVertical, LucideTrash } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { newTimeConvertor } from "../../../util/src/convertToPersianDate"
import DynamicHeroIcon from "../DynamicHeroIcon"
import Link from "../Link"
import { DetailsWithTitle } from "./DetailsWithTitle"

type OrderCardProps = {
  goToOffers?: boolean
  isSellerPanel?: boolean
  verticalDetails?: boolean
  forHomeCard?: boolean
  preOrder: PreOrder & PreOrderDto
  setOrderToDelete?: Dispatch<SetStateAction<PreOrder>>
  setDeleteModalOpen?: Dispatch<SetStateAction<boolean>>
}

export const PreOrderStatesFa = {
  [PreOrderStates.PendingAdmin]: {
    className: "tag-info",
    name_fa_admin: "در انتظار تایید ادمین",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingInfo]: {
    className: "tag-info",
    name_fa_admin: "در انتظار دریافت اطلاعات",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingOffer]: {
    className: "tag-info",
    name_fa_admin: "در انتظار پیشنهاد قیمت",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingProduct]: {
    className: "tag-info",
    name_fa_admin: "در انتظار افزودن کالا",
    name_fa: "جاری"
  },
  [PreOrderStates.VerifyFile]: {
    className: "tag-info",
    name_fa_admin: "در انتظار تایید فایل",
    name_fa: "جاری"
  },
  [PreOrderStates.Closed]: {
    className: "tag-success",
    name_fa_admin: "خریداری شده",
    name_fa: "خریداری شده"
  },
  [PreOrderStates.Completed]: {
    className: "tag-danger",
    name_fa_admin: "خریداری نشده",
    name_fa: "خریداری نشده"
  },
  [PreOrderStates.PendingPayment]: {
    className: "tag-success",
    name_fa: "در انتظار پرداخت",
    name_fa_admin: "در انتظار پرداخت"
  }
}

export const PaymentMethodEnumFa = {
  [PaymentMethodEnum.Cash]: {
    className: "",
    name_fa: "نقدی"
  },
  [PaymentMethodEnum.Credit]: {
    className: "",
    name_fa: "غیر نقدی"
  }
}

const OrderCard = ({
  goToOffers,
  isSellerPanel,
  forHomeCard,
  preOrder,
  setOrderToDelete,
  verticalDetails = false,
  setDeleteModalOpen
}: OrderCardProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div
      onClick={() => {
        isSellerPanel &&
          router.push(
            goToOffers
              ? `/my-orders/${preOrder?.id}`
              : `/orders/${preOrder?.id}`
          )
      }}
      className="flex w-full flex-col gap-4  border-alpha-200 pt"
    >
      <div className="flex w-full items-center justify-between">
        {/* <span className="text-base font-semibold">{preOrder?.name}</span> */}
        <div className="flex w-full gap-3">
          {isSellerPanel && (
            <div className="tag tag-gray">
              {/* <Dot /> */}
              <span>کدسفارش</span>
              <span>{digitsEnToFa(preOrder?.uuid || "-")}</span>
            </div>
          )}
          <DynamicHeroIcon
            icon="ClipboardDocumentListIcon"
            className={mergeClasses(
              "icon h-7 w-7 flex-shrink-0 transform rounded-md bg-orange-500 p-1 text-alpha-white transition-all"
            )}
            solid={false}
          />
          <div className="flex items-center gap-1 py-1">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-alpha-500">کد سفارش</span>
            </div>
            <div className="flex gap-1">
              <span className="whitespace-pre-wrap">
                {digitsEnToFa(preOrder?.uuid || "-")}
              </span>
            </div>
          </div>
          <div
            className={clsx(
              "tag",
              PreOrderStatesFa[preOrder?.status]?.className
            )}
          >
            <span>{PreOrderStatesFa[preOrder?.status]?.name_fa}</span>
          </div>
        </div>
        {!isSellerPanel && !forHomeCard && (
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
                {preOrder?.status !== PreOrderStates.Closed && (
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

      {preOrder?.offersNum > 0 && (
        <div className="flex gap-3 md:gap-9">
          <DynamicHeroIcon
            icon="CheckBadgeIcon"
            solid
            className={mergeClasses(
              "icon h-7 w-7 flex-shrink-0 transform overflow-hidden rounded-md bg-alpha-white  text-error-500 transition-all"
            )}
          />
          <span className="text-error-500">
            {digitsEnToFa(preOrder?.offersNum)}
          </span>
          <span className="text-error-500">پیشنهاد قیمت جدید</span>
        </div>
      )}
      <div className="flex flex-col rounded-2xl bg-alpha-50 p-4">
        <div className="flex w-full justify-between">
          <span>کالاها</span>
          <div className="flex gap-1 text-sm text-alpha-500">
            <span>{digitsEnToFa(preOrder?.lines?.length || "-")}</span>
            <span>کالا</span>
          </div>
        </div>
        <div className="flex flex-col pt-3">
          <DetailsWithTitle text={preOrder?.lines[0]?.item_name} />
          {preOrder?.lines?.length > 1 && (
            <div className="flex items-center gap-1">
              <DetailsWithTitle text={preOrder?.lines[1]?.item_name} />
              {preOrder?.lines?.length > 2 && <span>...</span>}
            </div>
          )}
        </div>
      </div>

      <div
        className={clsx(
          "flex flex-col items-start gap-1",
          !verticalDetails && "md:flex-row  md:gap-9"
        )}
      >
        {isSellerPanel && (
          <DetailsWithTitle title={"خریدار"} text={preOrder?.user.fullName} />
        )}
        {!forHomeCard && (
          <>
            <DetailsWithTitle
              dot={false}
              icon="FolderIcon"
              title="دسته‌بندی"
              text={preOrder?.category?.title}
            />
            <DetailsWithTitle
              dot={false}
              icon="FolderIcon"
              title="پروژه"
              text={preOrder?.project?.name}
            />
          </>
        )}
        {forHomeCard && (
          <>
            <DetailsWithTitle
              dot={false}
              icon="FolderIcon"
              title="تخلیه"
              text={preOrder?.destination}
            />
            <DetailsWithTitle
              dot={false}
              icon="FolderIcon"
              title="روش پرداخت"
              text={preOrder?.payment_method}
            />
          </>
        )}
        <DetailsWithTitle
          dot={false}
          icon="CalendarDaysIcon"
          title="تاریخ نیاز"
          text={
            preOrder?.need_date ? newTimeConvertor(preOrder?.need_date) : ""
          }
        />
      </div>
    </div>
  )
}

export default OrderCard
