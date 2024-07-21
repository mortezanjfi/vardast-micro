"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { OfferOrder } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import { FormControl, FormField, FormItem, FormLabel } from "@vardast/ui/form"
import { LucideEdit, LucideMoreVertical } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { UseFormReturn } from "react-hook-form"

import { ConfirmOffer } from "../../../../apps/vardast-order/src/app/(bid)/orders/[uuid]/components/SellersList"
import { DetailsWithTitle } from "../desktop/DetailsWithTitle"

type SellerMobileCartProps = {
  setSelectedOfferId: Dispatch<SetStateAction<number>>
  setOpen: Dispatch<SetStateAction<boolean>>
  form: UseFormReturn<ConfirmOffer>
  selectedRow: number
  setSelectedRow: (value: SetStateAction<number>) => void
  offer: OfferOrder
}

function SellerMobileCart({
  setSelectedOfferId,
  setOpen,
  selectedRow,
  setSelectedRow,
  form,
  offer
}: SellerMobileCartProps) {
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="flex w-full  items-start justify-between  border-alpha-200 py-4">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-base font-semibold">{offer.request_name}</span>
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
              <DropdownMenuItem>
                <LucideEdit className="dropdown-menu-item-icon" />
                <span
                  onClick={() => {
                    setSelectedOfferId(offer?.id)
                    setOpen(true)
                  }}
                >
                  {t("common:details")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col items-start gap">
          {/* <DetailsWithTitle
            title="آدرس ها"
            text={project?.address
              .map((address) => `- ${address.address.address}`)
              .join("\n")}
          /> */}
          <div className="tag tag-gray">
            {/* <Dot /> */}
            <span>کد فروشنده</span>
            <span>{offer?.id}</span>
          </div>
          <DetailsWithTitle title={"شماره فاکتور"} text={offer?.preOrder?.id} />
          <div className="flex w-full justify-center gap-5 rounded-lg border border-blue-300 bg-blue-50 px-5 py-4">
            {" "}
            <h4>{t(`common:total_price`)}:</h4>
            <p className="font-semibold">
              {digitsEnToFa(addCommas(offer.total))}
              {`(${t(`common:toman`)})`}
            </p>
          </div>
          <FormField
            control={form.control}
            name="offerId"
            render={({ field }) => {
              return (
                <FormItem className="checkbox-field flex-row-reverse gap py-3">
                  <FormLabel>انتخاب پیشنهاد قیمت</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={offer?.id === selectedRow}
                      onCheckedChange={(checked) => {
                        setSelectedRow(offer?.id)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SellerMobileCart
