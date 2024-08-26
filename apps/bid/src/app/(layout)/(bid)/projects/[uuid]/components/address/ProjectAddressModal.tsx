import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AddressRelatedTypes,
  CreateAddressProjectInput,
  CreateAddressProjectInputSchema,
  Project,
  useAssignAddressProjectMutation,
  useGetAllAddressesQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { SelectPopover } from "@vardast/ui/select-popover"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { OrderModalEnum } from "@/app/(layout)/(bid)/types/type"

const CreateAddressProjectAddressSchema = CreateAddressProjectInputSchema()

const ProjectAddressModal = ({
  onCloseModals,
  open,
  modals
}: IUseModal<OrderModalEnum, Project>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const form = useForm<CreateAddressProjectInput>({
    resolver: zodResolver(CreateAddressProjectAddressSchema)
  })

  z.setErrorMap(zodI18nMap)

  const getAllAddressesQuery = useGetAllAddressesQuery(
    graphqlRequestClientWithToken,
    {
      indexAddressInput: {
        relatedType: AddressRelatedTypes.Legal,
        relatedId: modals?.data?.legal?.id
      }
    },
    {
      enabled: open
    }
  )

  const assignAddressProjectMutation = useAssignAddressProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data) {
          onCloseModals(data)
        }
      }
    }
  )

  const onSubmit = (data: CreateAddressProjectInput) => {
    assignAddressProjectMutation.mutate({
      createAddressProjectInput: data
    })
  }

  useEffect(() => {
    setMultiFormValues({ projectId: +modals?.data?.id }, form.setValue)
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals?.data])

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: t("common:add_new_entity", { entity: t("common:address") }),
    action: {
      title: t("common:save_entity", { entity: t("common:address") }),
      loading: assignAddressProjectMutation.isLoading,
      disabled: assignAddressProjectMutation.isLoading
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
        name="addressId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:address")}</FormLabel>
            <FormControl>
              <SelectPopover
                internalSearchable
                loading={getAllAddressesQuery.isFetching}
                options={getAllAddressesQuery.data?.addresses?.data?.map(
                  (address) => ({
                    key: address?.address,
                    value: `${address?.id}`
                  })
                )}
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
    </Modal>
  )
}

export default ProjectAddressModal
