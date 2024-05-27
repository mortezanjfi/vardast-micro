"use client"

import { ReactNode, useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import * as Collapsible from "@radix-ui/react-collapsible"
import Card from "@vardast/component/Card"
import { OfferOrder, TypeOrderOffer } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideChevronDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { OrderOfferStatusesFa } from "@/app/(client)/(profile)/profile/orders/components/OrdersPage"
import { DetailsWithTitle } from "@/app/(client)/(profile)/profile/projects/components/DetailsWithTitle"

type CollapsibleOfferCartProps = {
  children: ReactNode
  openDefault?: boolean
  offerOrder: OfferOrder
  status?: "enable" | "disable"
}

export const TypeOrderOfferFa = {
  [TypeOrderOffer.Vardast]: {
    className: "text-primary",
    name_fa: "وردست"
  },
  [TypeOrderOffer.Client]: {
    className: "text-info",
    name_fa: "خریدار"
  },
  [TypeOrderOffer.Seller]: {
    className: "text-secondary",
    name_fa: "فروشنده"
  }
}

const CollapsibleOfferCart = ({
  offerOrder,
  children,
  status,
  openDefault = false
}: CollapsibleOfferCartProps) => {
  const [open, setOpen] = useState(openDefault)
  const { t } = useTranslation()
  return (
    <Card>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <div className={clsx("flex items-center", open && "border-b pb")}>
          <div className="flex items-center gap-10">
            <div className="flex gap-5">
              <div
                className={clsx(
                  "flex items-center justify-center rounded-md p-2",
                  status === "enable" ? "bg-info" : "bg-alpha-500"
                )}
              >
                <div className="h-[8px] w-[8px] rounded-full bg-alpha-white" />
              </div>
              <span>{`پیشنهاد شماره ${offerOrder?.id && digitsEnToFa(offerOrder?.id)}`}</span>
            </div>
            <DetailsWithTitle
              textCustomStyle={TypeOrderOfferFa[offerOrder?.type]?.className}
              title={t("common:offerer")}
              text={TypeOrderOfferFa[offerOrder?.type]?.name_fa}
            />
            <DetailsWithTitle
              title={t("common:offer-submition-time")}
              text={
                offerOrder?.created_at
                  ? digitsEnToFa(
                      new Date(offerOrder?.created_at).toLocaleDateString(
                        "fa-IR",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit"
                        }
                      )
                    )
                  : ""
              }
            />
            {OrderOfferStatusesFa[offerOrder?.status] && (
              <div
                className={clsx(
                  "tag",
                  OrderOfferStatusesFa[offerOrder?.status]?.className
                )}
              >
                {/* <Dot /> */}
                <span>{OrderOfferStatusesFa[offerOrder?.status]?.name_fa}</span>
              </div>
            )}
          </div>

          <Collapsible.Trigger asChild>
            <Button variant="ghost" size="small" className="mr-auto" iconOnly>
              <LucideChevronDown
                className={clsx(["icon", open ? "rotate-180" : ""])}
              />
            </Button>
          </Collapsible.Trigger>
        </div>
        <Collapsible.Content>
          <div className="hide-scrollbar grid grid-cols-1 gap-5 divide-y divide-alpha-200 overflow-y-auto text-justify">
            {children}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card>
  )
}

export default CollapsibleOfferCart
