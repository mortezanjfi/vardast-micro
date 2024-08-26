"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { PreOrder, PreOrderDto } from "@vardast/graphql/generated"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { newTimeConvertor } from "@vardast/util/convertToPersianDate"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import getBidTimeLeft from "../../../util/src/getBidTimeLeft"
import Card from "../Card"
import { DetailsWithTitle } from "../desktop/DetailsWithTitle"
import DynamicHeroIcon from "../DynamicHeroIcon"

type OrderCardProps = {
  goToOffers?: boolean
  isSellerPanel?: boolean
  verticalDetails?: boolean
  forHomeCard?: boolean
  preOrder: PreOrder & PreOrderDto
  setOrderToDelete?: Dispatch<SetStateAction<PreOrder>>
  setDeleteModalOpen?: Dispatch<SetStateAction<boolean>>
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
  const { colorClass, timeDisplay } = getBidTimeLeft(preOrder?.bid_end)

  return (
    <Card className="overflow-hidden !p-0">
      <div
        onClick={() => {
          isSellerPanel &&
            router.push(
              goToOffers
                ? `/my-orders/${preOrder?.id}`
                : `/orders/${preOrder?.id}`
            )
        }}
        className="flex w-full flex-col border-alpha-200"
      >
        {/* order code */}
        <div className="flex w-full items-center justify-between border-b border-alpha-200 bg-alpha-50 px-3 py-6">
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
                <span className="whitespace-nowrap text-alpha-500">
                  کد سفارش
                </span>
              </div>
              <div className="flex gap-1">
                <span className="whitespace-pre-wrap">
                  {digitsEnToFa(preOrder?.uuid || "-")}
                </span>
              </div>
            </div>
            {/* <Badge variant={PreOrderStatesFa[preOrder?.status]?.variant}>
            {PreOrderStatesFa[preOrder?.status]?.name_fa}
          </Badge> */}
          </div>
          <span className={clsx("tag", colorClass)}>{timeDisplay}</span>
          {/* {!isSellerPanel && !forHomeCard && (
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
          )} */}
        </div>
        <div className="flex flex-col gap-4 p-3">
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
              <DetailsWithTitle
                item={{ value: preOrder?.lines[0]?.item_name }}
              />
              {preOrder?.lines?.length > 1 && (
                <div className="flex items-center gap-1">
                  <DetailsWithTitle
                    item={{ value: preOrder?.lines[1]?.item_name }}
                  />
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
              <DetailsWithTitle
                item={{
                  key: "خریدار",
                  value: preOrder?.user.fullName
                }}
              />
            )}

            <>
              <DetailsWithTitle
                item={{
                  key: "دسته بندی",
                  value: preOrder?.category?.title,
                  icon: "Squares2X2Icon"
                }}
              />
            </>

            {!forHomeCard && (
              <>
                <DetailsWithTitle
                  item={{
                    key: "پروژه",
                    value: preOrder?.project?.name,
                    icon: "FolderIcon"
                  }}
                />
              </>
            )}
            <DetailsWithTitle
              item={{
                key: "تاریخ نیاز",
                value: preOrder?.need_date
                  ? newTimeConvertor(preOrder?.need_date)
                  : "",
                icon: "CalendarDaysIcon"
              }}
            />
            {forHomeCard && (
              <>
                <DetailsWithTitle
                  item={{
                    key: "تخلیه",
                    value: preOrder?.destination,
                    icon: "MapPinIcon"
                  }}
                />
                <DetailsWithTitle
                  item={{
                    key: "روش پرداخت",
                    value: preOrder?.payment_method,
                    icon: "CurrencyDollarIcon"
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default OrderCard
