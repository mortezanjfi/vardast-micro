 
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  PaymentMethodEnum,
  UpdatePreOrderInputSchema,
  useCreatePreOrderMutation,
  useGetAllCategoriesQuery,
  useGetAllProjectsQuery,
  useUpdatePreOrderMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import DatePicker from "@vardast/ui/date-picker"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Modal, ModalProps } from "@vardast/ui/modal"
import { SelectPopover, SelectPopoverTrigger } from "@vardast/ui/select-popover"
import { Textarea } from "@vardast/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { DateObject } from "react-multi-date-picker"
import { TypeOf, z } from "zod"

import { IOrderPageSectionProps } from "@/app/(layout)/(bid)/types/type"

const UpdateOrderInfoSchema = UpdatePreOrderInputSchema()
  .extend({
    projectId: z.string()
  })
  .omit({ id: true })

type UpdatePreOrderType = TypeOf<typeof UpdateOrderInfoSchema>

const OrderInfoModal = ({
  modals,
  open,
  onCloseModals,
  uuid
}: IOrderPageSectionProps<UpdatePreOrderType>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState<ClientError>()

  const form = useForm<UpdatePreOrderType>({
    resolver: zodResolver(UpdateOrderInfoSchema),
    defaultValues: {
      payment_methods: PaymentMethodEnum.Cash
    }
  })

  z.setErrorMap(zodI18nMap)

  const rootCategories = useGetAllCategoriesQuery(
    graphqlRequestClientWithToken,
    {
      indexCategoryInput: {
        onlyRoots: true
      }
    },
    {
      enabled: open
    }
  )

  const createPreOrderMutation = useCreatePreOrderMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: (data) => {
        if (data?.createPreOrder?.id) {
          router.push(
            `${process.env.NEXT_PUBLIC_BIDDING_PATH}orders/${data.createPreOrder.id}`
          )
        }
      }
    }
  )

  const updatePreOrderMutation = useUpdatePreOrderMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindPreOrderById"]
        })
        onCloseModals()
      }
    }
  )

  const myProjectsQuery = useGetAllProjectsQuery(
    graphqlRequestClientWithToken,
    undefined,
    {
      refetchOnMount: "always",
      enabled: open
    }
  )

  const addresses = useMemo(
    () =>
      form.watch("projectId") && myProjectsQuery.data
        ? myProjectsQuery.data?.projects.data.find(
            (project) => project.id === +form.watch("projectId")
          )?.addresses
        : [],
    [
      form.watch("projectId"),
      form.watch("addressId"),
      router,
      modals,
      myProjectsQuery.data
    ]
  )

  const onSubmit = (data: UpdatePreOrderType) => {
    if (modals?.data) {
      updatePreOrderMutation.mutate({
        updatePreOrderInput: {
          ...data,
          expert_name: data.expert_name,
          applicant_name: data.applicant_name,
          categoryId: +data.categoryId,
          projectId: +data.projectId,
          id: +uuid
        }
      })
    } else {
      createPreOrderMutation.mutate({
        createPreOrderInput: {
          ...data,
          expert_name: data.expert_name,
          applicant_name: data.applicant_name,
          categoryId: +data.categoryId,
          projectId: +data.projectId
        }
      })
    }
  }

  useEffect(() => {
    if (modals?.data) {
      setMultiFormValues(modals.data, form.setValue)
    } else {
      form.reset()
    }
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals, modals?.data])

  const modalProps: ModalProps = useMemo(
    () => ({
      open,
      onOpenChange: onCloseModals,
      errors,
      title: t("common:edit_entity", { entity: t("common:order-info") }),
      action: {
        title: t("common:save_entity", { entity: t("common:order") }),
        loading:
          updatePreOrderMutation.isLoading || createPreOrderMutation.isLoading,
        disabled:
          updatePreOrderMutation.isLoading || createPreOrderMutation.isLoading
      },
      form: {
        formProps: form,
        onSubmit: form.handleSubmit(onSubmit)
      }
    }),
    [updatePreOrderMutation, createPreOrderMutation]
  )

  return (
    <Modal {...modalProps}>
      <FormField
        control={form.control}
        name="projectId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:project")}</FormLabel>
            <FormControl>
              <SelectPopover
                internalSearchable
                loading={myProjectsQuery.data?.projects?.data?.length === 0}
                options={myProjectsQuery.data?.projects?.data?.map(
                  (project) => ({
                    key: project?.name,
                    value: `${project?.id}`
                  })
                )}
                value={field.value}
                onSelect={(value) => {
                  form.setValue("projectId", value, {
                    shouldDirty: true
                  })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="addressId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:address")}</FormLabel>
            <FormControl>
              <SelectPopover
                internalSearchable
                loading={myProjectsQuery.data?.projects.data.length === 0}
                options={addresses?.map((address) => ({
                  key: `${address.address.title} - ${address.address.address}`,
                  value: `${address?.address?.id}`
                }))}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("addressId", +value, {
                    shouldDirty: true
                  })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:category")}</FormLabel>
            <FormControl>
              <SelectPopover
                internalSearchable
                loading={myProjectsQuery.data?.projects.data.length === 0}
                options={rootCategories?.data?.categories?.data?.map(
                  (rootCategory) => ({
                    key: `${rootCategory?.title}`,
                    value: `${rootCategory?.id}`
                  })
                )}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("categoryId", +value, {
                    shouldDirty: true
                  })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="need_date"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel>{t("common:submission-time")}</FormLabel>
            <FormControl>
              <DatePicker
                render={(value, openCalendar) => {
                  return (
                    <SelectPopoverTrigger
                      label={value}
                      onClick={openCalendar}
                    />
                  )
                }}
                value={value ? new DateObject(new Date(value)) : ""}
                onChange={(dateObject: DateObject) => {
                  onChange(
                    dateObject?.isValid ? dateObject?.toDate?.().toString() : ""
                  )
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bid_start"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel>{t("common:bid-start-time")}</FormLabel>
            <FormControl>
              <DatePicker
                render={(value, openCalendar) => {
                  return (
                    <SelectPopoverTrigger
                      label={value}
                      onClick={openCalendar}
                    />
                  )
                }}
                value={value ? new DateObject(new Date(value)) : ""}
                onChange={(dateObject: DateObject) => {
                  onChange(
                    dateObject?.isValid ? dateObject?.toDate?.().toString() : ""
                  )
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bid_end"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel>{t("common:bid-end-time")}</FormLabel>
            <FormControl>
              <DatePicker
                render={(value, openCalendar) => {
                  return (
                    <SelectPopoverTrigger
                      label={value}
                      onClick={openCalendar}
                    />
                  )
                }}
                value={value ? new DateObject(new Date(value)) : ""}
                onChange={(dateObject: DateObject) => {
                  onChange(
                    dateObject?.isValid ? dateObject?.toDate?.().toString() : ""
                  )
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="expert_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:expert_name")}</FormLabel>
            <FormControl>
              <Input
                disabled={updatePreOrderMutation.isLoading}
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
        name="applicant_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:applicant_name")}</FormLabel>
            <FormControl>
              <Input
                disabled={updatePreOrderMutation.isLoading}
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
        name="payment_methods"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:pay-method")}</FormLabel>
            <FormControl className="h-14" toggleInputGroup="h-full">
              <ToggleGroup
                className="input-field grid grid-cols-2 p-0.5"
                type="single"
                value={field.value}
                onValueChange={(value: PaymentMethodEnum) => {
                  value && form.setValue("payment_methods", value)
                }}
              >
                <ToggleGroupItem
                  className={clsx(
                    "h-full rounded-xl p-0.5 text-alpha-500",
                    form.watch("payment_methods") === PaymentMethodEnum.Cash &&
                      "!bg-alpha-white !text-alpha-black shadow-lg"
                  )}
                  value={PaymentMethodEnum.Cash}
                >
                  {t("common:cash")}
                </ToggleGroupItem>
                <ToggleGroupItem
                  className={clsx(
                    "h-full rounded-xl p-0.5 text-alpha-500",
                    form.watch("payment_methods") ===
                      PaymentMethodEnum.Credit &&
                      "!bg-alpha-white !text-alpha-black shadow-lg"
                  )}
                  value={PaymentMethodEnum.Credit}
                >
                  {t("common:credit")}
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="descriptions"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>
              {t("common:description_entity", { entity: t("common:order") })}
            </FormLabel>
            <FormControl>
              <Textarea style={{ resize: "none" }} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Modal>
  )
}

export default OrderInfoModal
