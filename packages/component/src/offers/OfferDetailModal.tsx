"use client"

import { Dispatch, SetStateAction } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import {
  FindPreOrderByIdQuery,
  PreOrderStates
} from "@vardast/graphql/generated"
import { ACTION_BUTTON_TYPE } from "@vardast/type/OrderProductTabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@vardast/ui/dialog"
import { Input } from "@vardast/ui/input"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "../desktop/DetailsWithTitle"
import OrderProductsList from "../desktop/OrderProductsList"

export type OfferDetailModalProps = {
  isMobileView?: boolean
  selectedOfferId: number
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function OfferDetailModal({
  isMobileView,
  findPreOrderByIdQuery,
  selectedOfferId,
  open,
  onOpenChange
}: OfferDetailModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog modal={!isMobileView} open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={clsx(
          "flex flex-col gap-7 md:!w-fit md:!min-w-[50rem] md:max-w-full",
          isMobileView && "h-full max-h-full w-screen max-w-screen rounded-none"
        )}
      >
        <DialogHeader className="h-fit">
          <DialogTitle>{t("common:details")}</DialogTitle>
        </DialogHeader>
        <div className="flex grid-cols-4 flex-col gap-7 md:grid">
          {isMobileView ? (
            <DetailsWithTitle
              title={t("common:entity_name", { entity: t("common:seller") })}
              text={
                findPreOrderByIdQuery?.data?.findPreOrderById?.offers.find(
                  (item) => item.id === selectedOfferId
                )?.request_name
              }
            />
          ) : (
            <div className="flex flex-col gap-1">
              <span>
                {t("common:entity_name", { entity: t("common:seller") })}
              </span>
              <Input
                disabled
                className="w-full"
                value={
                  findPreOrderByIdQuery?.data?.findPreOrderById?.offers.find(
                    (item) => item.id === selectedOfferId
                  )?.request_name
                }
              />
            </div>
          )}
          {/* <div className="flex flex-col gap-1">
            <span>{t("common:cellPhone")}</span>
            <Input disabled className="w-full" value="8888888888" />
          </div>
          <div className="flex flex-col gap-1">
            <span>{t("common:province")}</span>
            <Input disabled className="w-full" value="Tehran" />
          </div>
          <div className="flex flex-col gap-1">
            <span>{t("common:city")}</span>
            <Input disabled className="w-full" value="Tehran" />
          </div> */}
        </div>
        <OrderProductsList
          isSeller={true}
          actionButtonType={ACTION_BUTTON_TYPE.ADD_PRODUCT_OFFER}
          isMobileView={isMobileView}
          hasOperation={
            findPreOrderByIdQuery?.data?.findPreOrderById?.status !==
            PreOrderStates.Closed
          }
          uuid={`${selectedOfferId}`}
          findPreOrderByIdQuery={findPreOrderByIdQuery}
        />
      </DialogContent>
    </Dialog>
  )
}

export default OfferDetailModal
