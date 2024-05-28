"use client"

import { Dispatch, SetStateAction } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import OrderProductsList from "@vardast/component/desktop/OrderProductsList"
import {
  FindPreOrderByIdQuery,
  PreOrderStates
} from "@vardast/graphql/generated"
import { Dialog, DialogContent, DialogHeader } from "@vardast/ui/dialog"
import { Input } from "@vardast/ui/input"
import useTranslation from "next-translate/useTranslation"

export type OfferDetailModalProps = {
  selectedOfferId: number
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function OfferDetailModal({
  findPreOrderByIdQuery,
  selectedOfferId,
  open,
  onOpenChange
}: OfferDetailModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-fit !min-w-[50rem] max-w-full gap-7">
        <DialogHeader className="">
          <span>{t("common:details")}</span>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-7">
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
