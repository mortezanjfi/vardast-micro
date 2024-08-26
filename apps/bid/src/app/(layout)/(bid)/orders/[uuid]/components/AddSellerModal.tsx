"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import {
  AddSellerOrderOffer,
  AddSellerOrderOfferSchema,
  useAddSellerOrderOfferMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Modal, ModalProps } from "@vardast/ui/modal"
import { Textarea } from "@vardast/ui/textarea"
import zodI18nMap from "@vardast/util/zodErrorMap"
import {
  cellphoneNumberSchema,
  phoneSchema
} from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  IOrderPageSectionProps,
  OrderModalEnum
} from "@/app/(layout)/(bid)/types/type"

const CreateSellerSchema = AddSellerOrderOfferSchema()
  .extend({
    cellphone: cellphoneNumberSchema,
    phone: phoneSchema
  })
  .omit({ orderOfferId: true })

function AddSellerModal({
  modals,
  uuid,
  open,
  onCloseModals,
  onChangeModals
}: IOrderPageSectionProps<number>) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [errors, setErrors] = useState<ClientError>()

  const form = useForm<AddSellerOrderOffer>({
    resolver: zodResolver(CreateSellerSchema),
    defaultValues: {
      orderOfferId: +uuid
    }
  })
  z.setErrorMap(zodI18nMap)

  const addSellerOrderOfferMutation = useAddSellerOrderOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.addSellerOrderOffer?.id) {
          queryClient.invalidateQueries({
            queryKey: ["FindPreOrderById"]
          })
          onChangeModals({
            data: data?.addSellerOrderOffer?.id,
            type: OrderModalEnum.OFFER
          })
        }
      }
    }
  )
  const onSubmit = (data: AddSellerOrderOffer) => {
    addSellerOrderOfferMutation.mutate({
      addSellerOrderOffer: {
        ...data,
        cellphone: digitsFaToEn(data.cellphone),
        orderOfferId: +modals?.data
      }
    })
  }

  useEffect(() => {
    const clearObject = Object.fromEntries(
      Object.keys(form.getValues()).map((key) => [key, ""])
    )
    return () => {
      form.reset(clearObject)
      setErrors(undefined)
    }
  }, [open])

  const modalProps: ModalProps<AddSellerOrderOffer> = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: t("common:add_entity", { entity: t("common:seller") }),
    action: {
      title: t("common:add_entity", { entity: t("common:offer") }),
      loading: addSellerOrderOfferMutation.isLoading,
      disabled: addSellerOrderOfferMutation.isLoading
    },
    form: {
      formProps: form,
      onSubmit: form.handleSubmit(onSubmit)
    }
  }

  return (
    <Modal {...modalProps}>
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_name", {
                entity: t("common:store")
              })}
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
            <FormLabel>{t("common:cellphone")}</FormLabel>
            <FormControl>
              <Input
                className="placeholder:text-right"
                inputMode="numeric"
                placeholder={t("common:cellphone")}
                type="tel"
                {...field}
                onChange={(e) =>
                  e.target.value.length <= 11 &&
                  field.onChange(digitsEnToFa(e.target.value))
                }
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
                className="placeholder:text-right"
                inputMode="numeric"
                placeholder="وارد کنید"
                type="tel"
                {...field}
                onChange={(e) =>
                  e.target.value.length <= 11 &&
                  field.onChange(digitsEnToFa(e.target.value))
                }
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
          <FormItem className="col-span-full">
            <FormLabel>{t("common:address")}</FormLabel>
            <FormControl>
              <Textarea placeholder="وارد کنید" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Modal>
  )
}

export default AddSellerModal
