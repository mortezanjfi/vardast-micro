"use client"

import { ReactNode, useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import * as Collapsible from "@radix-ui/react-collapsible"
import Card from "@vardast/component/Card"
import { DetailsWithTitle } from "@vardast/component/desktop/DetailsWithTitle"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideChevronDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

type CollapsibleOfferCartProps = {
  index: number
  children: ReactNode
  openDefault?: boolean
  offer: any
}

const CollapsibleOfferCart = ({
  index,
  offer,
  children,
  openDefault = false
}: CollapsibleOfferCartProps) => {
  const [open, setOpen] = useState(openDefault)
  const { t } = useTranslation()
  return (
    <Card>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <div className="flex items-center">
          <div className="flex items-center gap-10">
            <div className="flex gap-5">
              <div className="flex items-center justify-center rounded-md bg-alpha-500 p-2">
                <div className="h-[8px] w-[8px] rounded-full bg-alpha-white" />
              </div>
              <span>{`پیشنهاد شماره ${index + 1}`}</span>
            </div>
            <DetailsWithTitle
              textCustomStyle="text-primary-600"
              title={t("common:offerer")}
              text={offer.offerName}
            />
            <DetailsWithTitle
              title={t("common:offer-submition-time")}
              text={
                offer.offerDate
                  ? digitsEnToFa(
                      new Date(offer.offerDate).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                      })
                    )
                  : ""
              }
            />
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
          <div className="hide-scrollbar flex flex-col gap-5 overflow-y-auto  text-justify">
            {children}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card>
  )
}

export default CollapsibleOfferCart
