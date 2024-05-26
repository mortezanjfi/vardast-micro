"use client"

import { forwardRef, Ref, useState } from "react"
import { Line, MultiTypeOrder } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

import { OrderProductTabContentProps } from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsTabs"
import AddPriceModal from "@/app/(client)/(profile)/profile/orders/components/AddPriceModal"
import { DetailsWithTitle } from "@/app/(client)/(profile)/profile/projects/components/DetailsWithTitle"

export enum ACTION_BUTTON_TYPE {
  ADD_PRODUCT_ORDER = "ADD_PRODUCT_ORDER",
  ADD_PRODUCT_OFFER = "ADD_PRODUCT_OFFER"
}

interface OrderProductCardProps {
  line: Pick<
    Line,
    "brand" | "qty" | "item_name" | "uom" | "descriptions" | "type"
  >
  actionButtonType?: ACTION_BUTTON_TYPE
  addProductLine?: OrderProductTabContentProps["addProductLine"]
}

export const OrderProductCardSkeleton = ({}: {}) => {
  return (
    <div className="animated-card relative h-[200px] max-h-[200px] rounded px-6 sm:py sm:ring-2 sm:!ring-alpha-200"></div>
  )
}

const OrderProductCard = forwardRef(
  (
    { line, addProductLine, actionButtonType }: OrderProductCardProps,
    ref: Ref<HTMLDivElement> | undefined
  ) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState<boolean>(false)

    setDefaultOptions({
      locale: faIR,
      weekStartsOn: 6
    })

    const actionButtonTypeAlternatives = {
      [ACTION_BUTTON_TYPE.ADD_PRODUCT_ORDER]: (
        <Button
          variant="outline-primary"
          onClick={(e) => {
            e.stopPropagation()
            e.nativeEvent.preventDefault()
            e.nativeEvent.stopImmediatePropagation()
            addProductLine({
              brand: line.brand,
              descriptions: line.descriptions,
              item_name: line.item_name,
              uom: line.uom
            })
          }}
          className="py-3"
        >
          {t("common:add-to_entity", { entity: t("common:order") })}
        </Button>
      ),
      [ACTION_BUTTON_TYPE.ADD_PRODUCT_OFFER]: (
        <Button
          className="py-3"
          variant="full-secondary"
          onClick={(e) => {
            e.stopPropagation()
            e.nativeEvent.preventDefault()
            e.nativeEvent.stopImmediatePropagation()
            if (setOpen) setOpen(true)
          }}
        >
          {t("common:add_entity", { entity: t("common:price") })}
        </Button>
      )
    }

    return (
      <>
        <AddPriceModal setOpen={setOpen} open={open} />
        <div
          ref={ref}
          onClick={(e) => {
            e.preventDefault()
          }}
          className={clsx("flex max-h-[200px] flex-col rounded border px-6 py")}
        >
          <div className="flex w-full flex-col">
            <h4
              title={line.item_name}
              className="my-auto line-clamp-2 max-h-10 overflow-hidden whitespace-pre-wrap pb font-semibold"
            >
              {line.item_name}
            </h4>
            {line.type === MultiTypeOrder.Product && (
              <>
                <DetailsWithTitle
                  className="text-sm"
                  title={t("common:brand")}
                  text={line?.brand}
                />
                <DetailsWithTitle
                  className="text-sm"
                  title={t("common:unit")}
                  text={line?.uom}
                />
                <DetailsWithTitle
                  className="text-sm"
                  title={t("common:value")}
                  text={line?.qty}
                />
              </>
            )}
          </div>
          {actionButtonType && (
            <div className="flex w-full justify-end gap-5">
              {actionButtonTypeAlternatives[actionButtonType]}
            </div>
          )}
        </div>
      </>
    )
  }
)

export default OrderProductCard
