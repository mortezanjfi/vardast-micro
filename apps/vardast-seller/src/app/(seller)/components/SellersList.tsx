"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import CardContainer from "@vardast/component/desktop/CardContainer"
import SellerAdminConfirmationModal from "@vardast/component/desktop/SellerAdminConfirmationModal"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import OfferDetailModal from "@/app/(seller)/components/OfferDetailModal"

type Props = {
  uuid: string
  sellersData: any
}

const AddOfferSchema = z.object({
  offerId: z.number()
})

export type ConfirmOffer = TypeOf<typeof AddOfferSchema>
function SellersList({ sellersData, uuid }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedOfferId, setSelectedOfferId] = useState<number>()
  const [submitOpen, seSubmitOpen] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const form = useForm<ConfirmOffer>({ resolver: zodResolver(AddOfferSchema) })

  const thClasses = "border align-middle"

  const submitModal = () => {
    console.log("done")
    router.push(`/my-orders`)
  }

  const submitButton = (data: any) => {
    console.log(data)

    console.log("test")
    seSubmitOpen(true)
  }

  useEffect(() => {
    form.setValue("offerId", selectedRow)
  }, [selectedRow])
  // z.setErrorMap(zodI18nMap)
  return (
    <>
      <SellerAdminConfirmationModal
        onSubmit={submitModal}
        content={
          "در صورت تایید، سفارش شما به خریدار ارسال می شود و امکان ویرایش قیمت وجود نخواهد داشت."
        }
        open={submitOpen}
        onOpenChange={seSubmitOpen}
      />
      <OfferDetailModal
        selectedOfferId={selectedOfferId}
        open={open}
        onOpenChange={setOpen}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitButton)}
          className="flex flex-col gap-7"
        >
          <CardContainer title="لیست فروشندگان">
            <div className="flex flex-col gap-7">
              <div className="flex w-full flex-row-reverse">
                <Button
                  className="py-2"
                  onClick={(e) => {
                    console.log("test")
                    e.stopPropagation()
                    e.preventDefault()
                    router.push(`/my-orders/${uuid}/add-seller-info`)
                  }}
                  variant="outline-primary"
                >
                  {t("common:add_entity", { entity: t("common:seller") })}
                </Button>
              </div>
              <table className="table border-collapse border">
                <thead>
                  <tr>
                    <th className={thClasses}>{t("common:row")}</th>
                    <th className={thClasses}>
                      {" "}
                      {t("common:entity_code", { entity: t("common:seller") })}
                    </th>
                    <th className={thClasses}>
                      {" "}
                      {t("common:entity_name", { entity: t("common:seller") })}
                    </th>
                    <th className={thClasses}>{t("common:invoice-number")}</th>
                    <th className={thClasses}>
                      {t("common:invoice-total-price")}
                    </th>
                    <th className={thClasses}>{t("common:choose-offer")}</th>
                    <th className={thClasses}>{t("common:operation")}</th>
                  </tr>
                </thead>

                <tbody>
                  {sellersData.length === 0 ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <span>فروشنده مورد نظر خود را اضافه کنید!</span>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  ) : (
                    sellersData.map((seller, index) =>
                      seller ? (
                        <tr key={seller.id}>
                          <td className="w-4 border">
                            <span>{digitsEnToFa(index + 1)}</span>
                          </td>
                          <td className="border">
                            <span className="font-medium text-alpha-800">
                              {seller.sellerCode}
                            </span>
                          </td>
                          <td className="border">{seller.sellerName}</td>
                          <td className="border">
                            {digitsEnToFa(seller.invoiceNumber)}
                          </td>
                          <td className="border">
                            {digitsEnToFa(seller.invoicePrice)}
                          </td>
                          <td className="border">
                            <FormField
                              control={form.control}
                              name="offerId"
                              render={({ field }) => {
                                return (
                                  <FormItem className="checkbox-field">
                                    <FormControl>
                                      <Checkbox
                                        checked={seller.id === selectedRow}
                                        onCheckedChange={(checked) => {
                                          setSelectedRow(seller.id)
                                          console.log(selectedRow)

                                          console.log(checked)
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )
                              }}
                            />
                          </td>
                          <td className="border">
                            <span
                              onClick={() => {
                                setSelectedOfferId(seller.id)
                                setOpen(true)
                              }}
                              className="tag cursor-pointer text-blue-500"
                            >
                              {" "}
                              نمایش جزییات
                            </span>

                            <span className="tag cursor-pointer text-primary-600">
                              {t("common:edit")}
                            </span>
                          </td>
                        </tr>
                      ) : null
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContainer>
          <CardContainer title="تایید قیمت خریدار">
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="offerId"
                render={({ field }) => {
                  return (
                    <FormItem className="checkbox-field flex-col gap-2">
                      <div className="flex gap-2">
                        <FormControl>
                          <Checkbox
                            checked={selectedRow === 0}
                            onCheckedChange={(checked) => {
                              setSelectedRow(0)
                              console.log(selectedRow)

                              console.log(checked)
                            }}
                          />
                        </FormControl>
                        <FormLabel>
                          قیمت خریدار را به عنوان پایین ترین قیمت، تایید می کنم!
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </CardContainer>
          <div className="justify between flex flex-row-reverse border-t pt-5">
            <Button className="py-2" type="submit" variant="primary">
              "ارسال پیشنهاد به فروشنده"
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default SellersList
