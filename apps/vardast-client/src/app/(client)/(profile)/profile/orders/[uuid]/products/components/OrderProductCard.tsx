"use client"

import { forwardRef, Ref, useState } from "react"
import Image, { StaticImageData } from "next/image"
import blankProductImageSrc from "@vardast/asset/product-blank.svg"
import blankServiceImageSrc from "@vardast/asset/service-blank.svg"
import { DetailsWithTitle } from "@vardast/component/desktop/DetailsWithTitle"
import { Line, MultiTypeOrder, PriceOfferDto } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

import { OrderProductTabContentProps } from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsTabs"
import AddPriceModal from "@/app/(client)/(profile)/profile/orders/components/AddPriceModal"

export enum ACTION_BUTTON_TYPE {
  ADD_PRODUCT_ORDER = "ADD_PRODUCT_ORDER",
  ADD_PRODUCT_OFFER = "ADD_PRODUCT_OFFER"
}

interface OrderProductCardProps {
  line: Pick<
    Line,
    "brand" | "qty" | "item_name" | "uom" | "descriptions" | "type" | "id"
  > & { price?: PriceOfferDto }
  imageSrc?: string | StaticImageData
  actionButtonType?: ACTION_BUTTON_TYPE
  addProductLine?: OrderProductTabContentProps["addProductLine"]
}

export const OrderProductCardSkeleton = ({}: {}) => {
  return (
    <div className="py-5">
      <div className="animated-card h-[200px] rounded "></div>
    </div>
  )
}

const OrderProductCard = forwardRef(
  (
    { line, addProductLine, actionButtonType, imageSrc }: OrderProductCardProps,
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
              brand: line?.brand,
              descriptions: line?.descriptions,
              item_name: line?.item_name,
              uom: line?.uom
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
          variant={+line?.price?.fi_price > 0 ? "secondary" : "full-secondary"}
          onClick={(e) => {
            e.stopPropagation()
            e.nativeEvent.preventDefault()
            e.nativeEvent.stopImmediatePropagation()
            if (setOpen) setOpen(true)
          }}
        >
          {+line?.price?.fi_price > 0
            ? t("common:edit_entity", { entity: t("common:price") })
            : t("common:add_entity", { entity: t("common:price") })}
        </Button>
      )
    }

    return (
      <>
        {actionButtonType === ACTION_BUTTON_TYPE.ADD_PRODUCT_OFFER && (
          <AddPriceModal
            lineId={line?.id}
            setOpen={setOpen}
            open={open}
            fi_price={line?.price?.fi_price}
          />
        )}
        <div
          ref={ref}
          onClick={(e) => {
            e.preventDefault()
          }}
          className={clsx("flex max-h-[350px] gap rounded py-6")}
        >
          <div
            className={`relative flex aspect-square flex-shrink-0 transform flex-col items-center justify-center bg-center bg-no-repeat align-middle`}
          >
            <Image
              src={
                imageSrc
                  ? imageSrc
                  : line?.type === MultiTypeOrder.Product
                    ? blankProductImageSrc
                    : blankServiceImageSrc
              }
              alt={line?.item_name}
              width={100}
              height={100}
              className="mb-auto object-contain"
            />
          </div>
          <div className="flex w-full flex-col">
            <h4
              title={line?.item_name}
              className="my-auto line-clamp-2 max-h-10 overflow-hidden whitespace-pre-wrap pb font-semibold"
            >
              {line?.item_name}
            </h4>
            {line?.type === MultiTypeOrder.Product && (
              <>
                {line?.brand && (
                  <DetailsWithTitle
                    className="text-sm"
                    title={t("common:brand")}
                    text={line?.brand}
                  />
                )}
                {line?.uom && (
                  <DetailsWithTitle
                    className="text-sm"
                    title={t("common:unit")}
                    text={line?.uom}
                  />
                )}
              </>
            )}
            {actionButtonType === ACTION_BUTTON_TYPE.ADD_PRODUCT_OFFER && (
              <>
                {+line?.price?.fi_price > 0 && (
                  <DetailsWithTitle
                    className="text-sm"
                    title={t("common:fi_price")}
                    text={line?.price?.fi_price}
                  />
                )}
                {+line?.price?.tax_price > 0 && (
                  <DetailsWithTitle
                    className="text-sm"
                    title={t("common:tax_price")}
                    text={line?.price?.tax_price}
                  />
                )}
                {+line?.price?.total_price > 0 && (
                  <DetailsWithTitle
                    className="text-sm"
                    title={t("common:total_price")}
                    text={line?.price?.total_price}
                  />
                )}
              </>
            )}
            {line?.qty && (
              <DetailsWithTitle
                className="text-sm"
                title={t("common:value")}
                text={line?.qty}
              />
            )}
            {actionButtonType && (
              <div className="flex w-full justify-end gap-5">
                {actionButtonTypeAlternatives[actionButtonType]}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
)

export default OrderProductCard
