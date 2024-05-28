"use client"

import { Dispatch, SetStateAction, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import CardContainer from "@vardast/component/desktop/CardContainer"
import {
  AddSellerOrderOffer,
  useAddSellerOrderOfferMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@vardast/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { OfferDetailModalProps } from "@/app/(seller)/components/OfferDetailModal"

const CreateSellerSchema = z.object({
  address: z.string(),
  cellphone: z.string(),
  company_name: z.string(),
  phone: z.string(),
  seller_name: z.string()
})

export type CreateSellerInfoType = TypeOf<typeof CreateSellerSchema>

type Props = {
  detailModalProps: OfferDetailModalProps & {
    setSelectedOfferId: Dispatch<SetStateAction<number>>
  }
  orderId: number
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function AddSellerModal({
  orderId,
  open,
  onOpenChange,
  detailModalProps
}: Props) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const form = useForm<CreateSellerInfoType>({
    resolver: zodResolver(CreateSellerSchema)
  })
  z.setErrorMap(zodI18nMap)

  const addSellerOrderOfferMutation = useAddSellerOrderOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        ;(
          errors.response.errors?.at(0)?.extensions.displayErrors as string[]
        ).map((error) =>
          toast({
            description: error,
            duration: 5000,
            variant: "danger"
          })
        )
      },
      onSuccess: (data) => {
        if (data?.addSellerOrderOffer?.id) {
          queryClient.invalidateQueries({
            queryKey: ["FindPreOrderById"]
          })
          toast({
            title: "پیشنهاد شما با موفقیت ثبت شد",
            description:
              "لطفا برای قیمت گذاری بقر روی کالاها ادامه فرایند را انجام دهید.",
            duration: 8000,
            variant: "success"
          })
          onOpenChange(false)
          detailModalProps.onOpenChange(true)
          detailModalProps.setSelectedOfferId(data?.addSellerOrderOffer?.id)
          // router.push(`/my-orders/${uuid}/offers/${data.createOrderOffer.id}`)
        }
      }
    }
  )

  const onSubmit = (data: CreateSellerInfoType) => {
    addSellerOrderOfferMutation.mutate({
      addSellerOrderOffer: {
        ...data,
        orderOfferId: +orderId
      } as AddSellerOrderOffer
    })
  }

  useEffect(() => {
    const clearObject = Object.fromEntries(
      Object.keys(form.getValues()).map((key) => [key, ""])
    )
    form.reset(clearObject)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-fit !min-w-[50rem] max-w-full gap-7">
        <DialogHeader className="">
          <span>{t("common:details")}</span>
        </DialogHeader>
        <CardContainer title="اطلاعات فروشنده">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-7"
            >
              <div className="grid grid-cols-4 gap-7">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("common:entity_name", { entity: t("common:store") })}
                        <span> / </span>
                        {t("common:entity_name", {
                          entity: t("common:company")
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="وارد کنید" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seller_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {" "}
                        {t("common:entity_name", {
                          entity: t("common:seller")
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="وارد کنید" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cellphone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common:cellPhone")}</FormLabel>
                      <FormControl>
                        <Input
                          dir="rtl"
                          placeholder="وارد کنید"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>شماره ثابت</FormLabel>
                      <FormControl>
                        <Input
                          dir="rtl"
                          placeholder="وارد کنید"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>{t("common:address")}</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row-reverse border-t pt-5">
                <Button className="py-2" type="submit" variant="primary">
                  تایید و ادامه
                </Button>
              </div>
            </form>
          </Form>
        </CardContainer>
      </DialogContent>
    </Dialog>
  )
}

export default AddSellerModal
