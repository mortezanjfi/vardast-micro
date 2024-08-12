"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import {
  Address,
  CreateAddressInput,
  CreateAddressInputSchema,
  ThreeStateSupervisionStatuses,
  useCreateAddressMutation,
  useGetAllProvincesQuery,
  useGetProvinceQuery,
  useUpdateAddressMutation
} from "@vardast/graphql/generated"
import { ThreeStateSupervisionStatusesFa } from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { SelectPopover } from "@vardast/ui/select-popover"
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { postalCodeSchema } from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

type AddressFormDataType = Omit<CreateAddressInput, "countryId" | "sort"> & {
  sort: string
}

const AddressModal = <TEnum,>({
  modals,
  open,
  onCloseModals
}: IUseModal<TEnum, Address>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const isEdit = modals?.data?.address

  const createAddressMutation = useCreateAddressMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        onCloseModals(data)
      }
    }
  )

  const updateAddressMutation = useUpdateAddressMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        onCloseModals(data)
      }
    }
  )

  z.setErrorMap(zodI18nMap)

  const form = useForm<AddressFormDataType>({
    resolver: zodResolver(
      CreateAddressInputSchema()
        .omit({ sort: true })
        .merge(
          z.object({
            postalCode: postalCodeSchema,
            sort: z.string()
          })
        )
    )
  })

  const provinces = useGetAllProvincesQuery(
    graphqlRequestClientWithToken,
    {
      indexProvinceInput: {
        perPage: 32
      }
    },
    {
      enabled: open
    }
  )

  const cities = useGetProvinceQuery(
    graphqlRequestClientWithToken,
    {
      id: form.watch("provinceId")
    },
    {
      enabled: !!form.watch("provinceId") && !!provinces.data && open
    }
  )

  function onSubmit(data: AddressFormDataType) {
    let body = {
      ...data,
      postalCode: data?.postalCode ? digitsFaToEn(data?.postalCode) : undefined,
      sort: data?.sort ? +digitsFaToEn(`${data?.sort}`) : undefined
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateAddressMutation.mutate({
        updateAddressInput: {
          ...body,
          id: modals?.data.id
        }
      })
    } else {
      createAddressMutation.mutate({
        createAddressInput: body
      })
    }
  }

  useEffect(() => {
    if (isEdit) {
      const {
        city,
        province,
        address,
        isPublic,
        relatedId,
        relatedType,
        sort,
        status,
        title,
        latitude,
        longitude,
        postalCode
      } = modals?.data
      setMultiFormValues(
        {
          address,
          isPublic,
          relatedId,
          relatedType,
          sort: sort ? digitsEnToFa(sort) : undefined,
          status,
          title,
          latitude,
          longitude,
          postalCode: postalCode ? digitsEnToFa(postalCode) : undefined,
          cityId: city.id,
          provinceId: province.id
        },
        form.setValue
      )
    } else {
      const modalData = modals?.data
      if (modalData) {
        setMultiFormValues(
          {
            relatedId: modalData?.relatedId,
            relatedType: modalData?.relatedType
          },
          form.setValue
        )
      }
    }
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals?.data])

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: isEdit
      ? t("common:edit_entity", { entity: t("common:address") })
      : t("common:new_entity", { entity: t("common:address") }),
    action: {
      title: t("common:save_entity", { entity: t("common:address") }),
      loading:
        updateAddressMutation.isLoading || createAddressMutation.isLoading,
      disabled:
        updateAddressMutation.isLoading ||
        createAddressMutation.isLoading ||
        provinces.isLoading ||
        cities.isLoading
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
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:title")}</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:address")}</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="provinceId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:province")}</FormLabel>
            <FormControl>
              <SelectPopover
                onSelect={(value) => {
                  form.setValue("provinceId", +value, {
                    shouldDirty: true
                  })
                  form.setValue("cityId", null)
                }}
                loading={
                  provinces.isLoading ||
                  provinces.isError ||
                  provinces.isFetching
                }
                options={provinces.data?.provinces?.data?.map((province) => ({
                  key: province?.name,
                  value: `${province?.id}`
                }))}
                internalSearchable
                value={`${field.value}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cityId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:city")}</FormLabel>
            <FormControl>
              <SelectPopover
                onSelect={(value) => {
                  form.setValue("cityId", +value, {
                    shouldDirty: true
                  })
                }}
                loading={cities.isFetching}
                options={cities.data?.province?.cities?.map((city) => ({
                  key: city?.name,
                  value: `${city?.id}`
                }))}
                internalSearchable
                value={`${field.value}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:postalCode")}</FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                className="placeholder:text-right"
                placeholder={t("common:enter")}
                {...field}
                onChange={(e) => {
                  e.target.value.length <= 10 &&
                    field.onChange(digitsEnToFa(e.target.value))
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:status")}</FormLabel>
            <FormControl>
              <SelectPopover
                onSelect={(value) => {
                  form.setValue(
                    "status",
                    value.toUpperCase() as ThreeStateSupervisionStatuses,
                    {
                      shouldDirty: true
                    }
                  )
                }}
                options={Object.entries(
                  enumToKeyValueObject(ThreeStateSupervisionStatuses)
                )?.map(([value, key]) => ({
                  key: ThreeStateSupervisionStatusesFa[
                    key as ThreeStateSupervisionStatuses
                  ]?.name_fa,
                  value: value.toUpperCase()
                }))}
                value={`${field.value}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sort"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:display_sort")}</FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                className="placeholder:text-right"
                placeholder={t("common:enter")}
                {...field}
                onChange={(e) => {
                  field.onChange(digitsEnToFa(e.target.value))
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isPublic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:visibility")}</FormLabel>
            <FormControl>
              <SelectPopover
                onSelect={(value) => {
                  form.setValue("isPublic", value === "true", {
                    shouldDirty: true
                  })
                }}
                options={[
                  {
                    key: "نمایش",
                    value: "true"
                  },
                  {
                    key: "عدم نمایش",
                    value: "false"
                  }
                ]}
                value={`${field.value}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Modal>
  )
}

export default AddressModal
