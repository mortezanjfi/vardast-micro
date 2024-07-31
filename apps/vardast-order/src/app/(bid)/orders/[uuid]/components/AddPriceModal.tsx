"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import { Modal, ModalProps } from "@vardast/component/modal"
import {
  MultiTypeOrder,
  OfferLine,
  useCalculatePriceOfferLineMutation,
  useCreateOrderOfferLineMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Switch } from "@vardast/ui/switch"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { IOrderPageSectionProps } from "@/types/type"

const AddPriceModal = ({
  modals,
  open,
  onCloseModals
}: IOrderPageSectionProps<OfferLine>) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState<ClientError>()

  const FormSchema = z.object({
    fi_price: z.string(),
    with_tax: z.boolean()
  })

  type FormSchemaType = TypeOf<typeof FormSchema>

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  })

  const createOrderOfferLineMutation = useCreateOrderOfferLineMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindPreOrderById"]
        })
        queryClient.invalidateQueries({
          queryKey: ["FindOfferPreOrderById"]
        })
        onCloseModals()
        toast({
          title: "قیمت کالا با موفقیت به روزرسانی شد",
          duration: 5000,
          variant: "success"
        })
      }
    }
  )

  const calculatePriceOfferLineMutation = useCalculatePriceOfferLineMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        form.setValue(
          "fi_price",
          data?.calculatePriceOfferLine?.fi_price || "0"
        )
        form.setValue("with_tax", +data?.calculatePriceOfferLine?.tax_price > 0)
      }
    }
  )

  const onSubmit = (data: FormSchemaType) => {
    calculatePriceOfferLineMutation.mutate({
      fi_price: data.fi_price,
      with_tax: data.with_tax || false,
      lineId: +modals?.data?.line?.id
    })
  }

  const onConfirmModal = () => {
    const { fi_price, tax_price, total_price } =
      calculatePriceOfferLineMutation.data?.calculatePriceOfferLine
    createOrderOfferLineMutation.mutate({
      createLineOfferInput: {
        offerId: +modals.data?.offerOrder?.id,
        lineId: +modals?.data?.line?.id,
        fi_price:
          modals?.data?.line?.type === MultiTypeOrder.Product
            ? fi_price
            : form.getValues("fi_price"),
        tax_price:
          modals?.data?.line?.type === MultiTypeOrder.Product ? tax_price : "0",
        total_price:
          modals?.data?.line?.type === MultiTypeOrder.Product
            ? total_price
            : form.getValues("fi_price")
      }
    })
  }

  useEffect(() => {
    if (open && modals?.data?.fi_price) {
      onSubmit({ fi_price: modals?.data?.fi_price })
    }
  }, [open, modals?.data?.fi_price])

  useEffect(() => {
    const clearObject = Object.fromEntries(
      Object.keys(form.getValues()).map((key) => [key, ""])
    )
    form.reset(clearObject)
  }, [open])

  const modalProps: ModalProps = {
    size: "sm",
    open,
    onOpenChange: onCloseModals,
    errors,
    title: "وارد کردن قیمت پیشنهادی",
    action: {
      title: t("common:confirm", { entity: t("common:price") }),
      onClick: onConfirmModal,
      disabled:
        modals?.data?.line?.type === MultiTypeOrder.Product
          ? !calculatePriceOfferLineMutation.data ||
            calculatePriceOfferLineMutation.isLoading ||
            createOrderOfferLineMutation.isLoading ||
            !form.watch("fi_price") ||
            form.watch("fi_price") !==
              calculatePriceOfferLineMutation?.data?.calculatePriceOfferLine
                ?.fi_price ||
            form.watch("with_tax") !==
              !!+calculatePriceOfferLineMutation?.data?.calculatePriceOfferLine
                ?.tax_price
          : false,
      loading: createOrderOfferLineMutation.isLoading,
      type: "button"
    },
    secondAction: {
      loading:
        calculatePriceOfferLineMutation.isLoading ||
        createOrderOfferLineMutation.isLoading,
      disabled:
        calculatePriceOfferLineMutation.isLoading ||
        createOrderOfferLineMutation.isLoading ||
        +form.watch("fi_price") < 1,
      title: t("common:calculate", { entity: t("common:price") }),
      type: "submit"
    },
    form: {
      formProps: form,
      onSubmit: form.handleSubmit(onSubmit),
      template: "1/3"
    }
  }

  // {line?.type === MultiTypeOrder.Product && (
  //   <Button
  //     disabled={
  //       calculatePriceOfferLineMutation.isLoading ||
  //       createOrderOfferLineMutation.isLoading ||
  //       +form.watch("fi_price") < 1
  //     }
  //     loading={calculatePriceOfferLineMutation.isLoading}
  //     type="submit"
  //     variant="full-secondary"
  //   >
  //     {t("common:calculate", { entity: t("common:price") })}
  //   </Button>
  // )}
  // <Button
  //   onClick={onConfirmModal}
  //   disabled={
  //     line?.type === MultiTypeOrder.Product
  //       ? !calculatePriceOfferLineMutation.data ||
  //         calculatePriceOfferLineMutation.isLoading ||
  //         createOrderOfferLineMutation.isLoading ||
  //         !form.watch("fi_price") ||
  //         form.watch("fi_price") !==
  //           calculatePriceOfferLineMutation?.data
  //             ?.calculatePriceOfferLine?.fi_price ||
  //         form.watch("with_tax") !==
  //           !!+calculatePriceOfferLineMutation?.data
  //             ?.calculatePriceOfferLine?.tax_price
  //       : false
  //   }
  //   loading={createOrderOfferLineMutation.isLoading}
  //   type="button"
  // >
  //   {t("common:confirm", { entity: t("common:price") })}
  // </Button>

  return (
    <Modal {...modalProps}>
      <FormField
        control={form.control}
        name={"fi_price"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(`common:fi_price`)}</FormLabel>
            <FormControl>
              <Input
                disabled={
                  calculatePriceOfferLineMutation.isLoading ||
                  createOrderOfferLineMutation.isLoading
                }
                type="text"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="with_tax"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <div className="flex items-center gap-1">
              <FormControl>
                <Switch
                  disabled={
                    calculatePriceOfferLineMutation.isLoading ||
                    createOrderOfferLineMutation.isLoading
                  }
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel noStyle>
                %{digitsEnToFa(10)} {t("common:tax")}
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      {modals?.data?.line?.type === MultiTypeOrder.Product && (
        <>
          <div className="col-span-full flex flex-col justify-center gap-5 rounded-lg border border-blue-300 bg-blue-50 px-5 py-7">
            {form.watch("with_tax") && (
              <div className="flex gap">
                <h4>{t(`common:tax_price`)}:</h4>
                <p className="font-semibold">
                  {!calculatePriceOfferLineMutation.isLoading &&
                    calculatePriceOfferLineMutation.data
                      ?.calculatePriceOfferLine.tax_price &&
                    digitsEnToFa(
                      addCommas(
                        calculatePriceOfferLineMutation.data
                          ?.calculatePriceOfferLine.tax_price
                      )
                    )}
                  {` (${t(`common:toman`)})`}
                </p>
              </div>
            )}
            <div className="flex gap">
              <h4>{t(`common:total_price`)}:</h4>
              <p className="font-semibold">
                {!calculatePriceOfferLineMutation.isLoading &&
                  calculatePriceOfferLineMutation.data?.calculatePriceOfferLine
                    .total_price &&
                  digitsEnToFa(
                    addCommas(
                      calculatePriceOfferLineMutation.data
                        ?.calculatePriceOfferLine.total_price
                    )
                  )}
                {` (${t(`common:toman`)})`}
              </p>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}

export default AddPriceModal
