import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import {
  CreateAddressProjectInput,
  CreateAddressProjectInputSchema,
  ProjectAddress,
  useAssignAddressProjectMutation,
  useGetAllProvincesQuery,
  useGetProvinceQuery,
  useUpdateProjectAddressMutation
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
import { SelectPopover } from "@vardast/ui/select-popover"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { IOrderPageSectionProps } from "@/types/type"

const CreateAddressProjectAddressSchema =
  CreateAddressProjectInputSchema().omit({ projectId: true })

type CreateAddressProjectType = Omit<CreateAddressProjectInput, "projectId">

export const AddressModal = ({
  onCloseModals,
  open,
  modals,
  uuid
}: IOrderPageSectionProps<ProjectAddress>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const form = useForm<CreateAddressProjectType>({
    resolver: zodResolver(CreateAddressProjectAddressSchema)
  })

  z.setErrorMap(zodI18nMap)

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
      enabled: !!form.watch("provinceId") && open
    }
  )

  const assignAddressProjectMutation = useAssignAddressProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        onCloseModals()
      }
    }
  )

  const updateProjectAddressMutation = useUpdateProjectAddressMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        onCloseModals()
      }
    }
  )

  const onSubmit = (data: CreateAddressProjectType) => {
    if (modals?.data) {
      return updateProjectAddressMutation.mutate({
        updateProjectAddressInput: {
          ...data,
          postalCode: digitsFaToEn(data.postalCode),
          addressId: modals?.data?.id,
          projectId: +uuid
        }
      })
    } else {
      assignAddressProjectMutation.mutate({
        createAddressProjectInput: {
          ...data,
          projectId: +uuid
        }
      })
    }
  }

  useEffect(() => {
    if (modals?.data) {
      const defaultValues: CreateAddressProjectType = {
        title: modals?.data?.title,
        provinceId: +modals?.data?.province?.id,
        cityId: +modals?.data?.city?.id,
        postalCode:
          modals?.data?.postalCode && digitsEnToFa(modals?.data?.postalCode),
        address: modals?.data?.address,
        delivery_name: modals?.data?.delivery_name,
        delivery_contact: modals?.data?.delivery_contact
      }
      setMultiFormValues(defaultValues, form.setValue)
    } else {
      form.reset()
    }
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals, modals?.data])

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: t("common:add_new_entity", { entity: t("common:address") }),
    action: {
      title: t("common:save_entity", { entity: t("common:address") }),
      loading:
        assignAddressProjectMutation.isLoading ||
        updateProjectAddressMutation.isLoading,
      disabled:
        assignAddressProjectMutation.isLoading ||
        updateProjectAddressMutation.isLoading ||
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
                loading={provinces.isLoading || provinces.isError}
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
                // disabled={!form.watch("provinceId")}
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
                placeholder={digitsEnToFa("**********")}
                {...field}
                onChange={(e) =>
                  e.target.value.length <= 10 &&
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
            <FormLabel>{t("common:postal-address")}</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="delivery_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:transferee-name-family")}</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="delivery_contact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:transferee-number")}</FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                placeholder={digitsEnToFa("09*********")}
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
    </Modal>
  )
}
