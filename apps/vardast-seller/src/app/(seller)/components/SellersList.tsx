"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useQueryClient, UseQueryResult } from "@tanstack/react-query"
import CardContainer from "@vardast/component/desktop/CardContainer"
import SellerAdminConfirmationModal from "@vardast/component/desktop/SellerAdminConfirmationModal"
import {
  FindPreOrderByIdQuery,
  OrderOfferStatuses,
  PreOrderStates,
  useCreateOrderOfferMutation,
  useUpdateOrderOfferMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import { Form, FormControl, FormField, FormItem } from "@vardast/ui/form"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import AddSellerModal from "@/app/(seller)/components/AddSellerModal"
import OfferDetailModal from "@/app/(seller)/components/OfferDetailModal"

type Props = {
  uuid: string
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
}

const AddOfferSchema = z.object({
  offerId: z.number()
})

export type ConfirmOffer = TypeOf<typeof AddOfferSchema>
function SellersList({ findPreOrderByIdQuery, uuid }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [addSellerModalOpen, setAddSellerModalOpen] = useState<boolean>(false)
  const [selectedOfferId, setSelectedOfferId] = useState<number>()
  const [orderId, setOrderId] = useState<number>()
  const [confirmModalOpen, seConfirmModalOpen] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const form = useForm<ConfirmOffer>({ resolver: zodResolver(AddOfferSchema) })
  const queryClient = useQueryClient()

  const thClasses = "border align-middle"

  const updateOrderOfferMutation = useUpdateOrderOfferMutation(
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
        if (data?.updateOrderOffer?.id) {
          queryClient.invalidateQueries({
            queryKey: ["FindPreOrderById"]
          })
          toast({
            title: "قیمت گذاری با موفقیت به پایان رسید",
            duration: 8000,
            variant: "success"
          })
          router.push(`/my-orders`)
        }
      }
    }
  )

  const submitModal = () => {
    updateOrderOfferMutation.mutate({
      updateOrderOfferInput: {
        id: form.watch("offerId"),
        status: OrderOfferStatuses.Closed
      }
    })
  }

  const submitButton = () => {
    seConfirmModalOpen(true)
  }

  const createOrderOfferMutation = useCreateOrderOfferMutation(
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
        if (data?.createOrderOffer?.id) {
          queryClient.invalidateQueries({
            queryKey: ["FindPreOrderById"]
          })
          toast({
            title: "پیشنهاد شما با موفقیت ثبت شد",
            description:
              "لطفا برای قیمت گذاری بر روی کالاها ادامه فرایند را انجام دهید.",
            duration: 8000,
            variant: "success"
          })
          setOrderId(data.createOrderOffer.id)
          setAddSellerModalOpen(true)
          // router.push(`/my-orders/${uuid}/offers/${data.createOrderOffer.id}`)
        }
      }
    }
  )

  const onAddSeller = (e) => {
    e.stopPropagation()
    e.preventDefault()
    createOrderOfferMutation.mutate({
      createOrderOfferInput: {
        preOrderId: +uuid
      }
    })
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
        open={confirmModalOpen}
        onOpenChange={seConfirmModalOpen}
      />
      <OfferDetailModal
        findPreOrderByIdQuery={findPreOrderByIdQuery}
        selectedOfferId={selectedOfferId}
        open={open}
        onOpenChange={setOpen}
      />
      <AddSellerModal
        detailModalProps={{
          findPreOrderByIdQuery: findPreOrderByIdQuery,
          selectedOfferId: selectedOfferId,
          setSelectedOfferId: setSelectedOfferId,
          open: open,
          onOpenChange: setOpen
        }}
        orderId={orderId}
        open={addSellerModalOpen}
        onOpenChange={setAddSellerModalOpen}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitButton)}
          className="flex flex-col gap-7"
        >
          <CardContainer title="لیست فروشندگان">
            <div className="flex flex-col gap-7">
              {findPreOrderByIdQuery?.data?.findPreOrderById?.status !==
                PreOrderStates.Closed && (
                <div className="flex w-full flex-row-reverse">
                  <Button
                    className="py-2"
                    onClick={onAddSeller}
                    variant="outline-primary"
                  >
                    {t("common:add_entity", { entity: t("common:seller") })}
                  </Button>
                </div>
              )}
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
                    {findPreOrderByIdQuery?.data?.findPreOrderById?.status !==
                      PreOrderStates.Closed && (
                      <>
                        <th className={thClasses}>
                          {t("common:choose-offer")}
                        </th>
                      </>
                    )}
                    <th className={thClasses}>{t("common:operation")}</th>
                  </tr>
                </thead>

                <tbody>
                  {findPreOrderByIdQuery.data?.findPreOrderById?.offers
                    ?.length === 0 ? (
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
                    findPreOrderByIdQuery.data?.findPreOrderById?.offers?.map(
                      (offer, index) => (
                        <tr key={offer?.id}>
                          <td className="w-4 border">
                            <span>{digitsEnToFa(index + 1)}</span>
                          </td>
                          <td className="border">
                            <span className="font-medium text-alpha-800">
                              {offer?.id && digitsEnToFa(offer?.id)}
                            </span>
                          </td>
                          <td className="border">{offer?.request_name}</td>
                          <td className="border">
                            {digitsEnToFa(offer?.created_at)}
                          </td>
                          <td className="border">
                            {digitsEnToFa(offer?.total)}
                          </td>
                          {findPreOrderByIdQuery?.data?.findPreOrderById
                            ?.status !== PreOrderStates.Closed && (
                            <>
                              <td className="border">
                                <FormField
                                  control={form.control}
                                  name="offerId"
                                  render={({ field }) => {
                                    return (
                                      <FormItem className="checkbox-field">
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
                              </td>
                            </>
                          )}
                          <td className="border">
                            <span
                              onClick={() => {
                                setSelectedOfferId(offer?.id)
                                setOpen(true)
                              }}
                              className="tag cursor-pointer text-blue-500"
                            >
                              نمایش جزییات
                            </span>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContainer>
          {/* <CardContainer title="تایید قیمت خریدار">
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
          </CardContainer> */}
          {findPreOrderByIdQuery?.data?.findPreOrderById?.status !==
            PreOrderStates.Closed && (
            <div className="justify between flex flex-row-reverse border-t pt-5">
              <Button
                disabled={!form.watch("offerId")}
                className="py-2"
                type="submit"
                variant="primary"
              >
                ارسال پیشنهاد به فروشنده
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  )
}

export default SellersList
