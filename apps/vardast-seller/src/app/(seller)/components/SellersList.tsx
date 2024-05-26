"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import CardContainer from "@vardast/component/desktop/CardContainer"
import SellerAdminConfirmationModal from "@vardast/component/desktop/SellerAdminConfirmationModal"
import { Button } from "@vardast/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@vardast/ui/form"
import { RadioGroup, RadioGroupItem } from "@vardast/ui/radio-group"
import { LucideCircle } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import OfferDetailModal from "@/app/(seller)/components/OfferDetailModal"
import SubmitButton from "@/app/(seller)/components/SubmitButton"

type Props = {
  uuid: string
  sellersData: any
  // form: UseFormReturn<ConfirmOffer>
}
const AddOfferSchema = z.object({
  offerId: z.coerce.string(),
  confirmOffer: z.boolean()
})
export type ConfirmOffer = TypeOf<typeof AddOfferSchema>
function SellersList({ sellersData, uuid }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedOfferId, setSelectedOfferId] = useState<number>()
  const [submitOpen, seSubmitOpen] = useState<boolean>(false)
  const form = useForm<ConfirmOffer>({ resolver: zodResolver(AddOfferSchema) })

  const submitModal = () => {
    console.log("done")
    router.push(`/my-orders`)
  }

  const submitButton = (e) => {
    console.log("test")
    seSubmitOpen(true)
  }
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
        <form className="flex flex-col gap-7">
          <CardContainer title="لیست فروشندگان">
            <div className="flex flex-col gap-7">
              <div className="flex w-full flex-row-reverse">
                <Button
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
                    <th className="border align-middle">{t("common:row")}</th>
                    <th>
                      {" "}
                      {t("common:entity_code", { entity: t("common:seller") })}
                    </th>
                    <th>
                      {" "}
                      {t("common:entity_name", { entity: t("common:seller") })}
                    </th>
                    <th>{t("common:invoice-number")}</th>
                    <th>{t("common:invoice-total-price")}</th>
                    <th>{t("common:choose-offer")}</th>
                    <th>{t("common:operation")}</th>
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
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={(value) => {
                                        console.log(value)
                                      }}
                                      // onValueChange={field.onChange}
                                      // defaultValue={field.value}
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value={seller.id} />
                                        </FormControl>
                                        <FormLabel className="flex gap-3">
                                          <LucideCircle />
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          console.log(value)
                        }}
                        // onValueChange={field.onChange}
                        // defaultValue={field.value}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="purchaser" />
                          </FormControl>
                          <FormLabel className="flex items-center gap-3">
                            <LucideCircle />
                            قیمت خریدار را به عنوان پایین ترین قیمت، تایید می
                            کنم!
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContainer>
          <SubmitButton
            buttonText={"ارسال پیشنهاد به فروشنده"}
            onClick={submitButton}
          />
        </form>
      </Form>
    </>
  )
}

export default SellersList
