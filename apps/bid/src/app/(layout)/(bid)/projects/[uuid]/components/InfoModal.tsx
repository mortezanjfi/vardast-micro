import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import { useUpdateProjectMutation } from "@vardast/graphql/generated"
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
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { IOrderPageSectionProps } from "@/app/(layout)/(bid)/types/type"

const ProjectSchema = z.object({
  name: z.string()
})
type InfoNameType = TypeOf<typeof ProjectSchema>

const InfoModal = ({
  modals,
  open,
  onCloseModals,
  uuid
}: IOrderPageSectionProps<InfoNameType>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const form = useForm<InfoNameType>({
    resolver: zodResolver(ProjectSchema)
  })

  z.setErrorMap(zodI18nMap)

  const updateProjectMutation = useUpdateProjectMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
      }
    }
  )

  const onSubmit = (data: InfoNameType) => {
    updateProjectMutation.mutate({
      updateProjectInput: {
        id: +uuid,
        name: data.name
      }
    })
  }

  useEffect(() => {
    if (modals?.data?.name) {
      form.setValue("name", digitsEnToFa(modals?.data?.name))
    } else {
      form.reset()
    }
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals, modals?.data])

  const modalProps: ModalProps = {
    open: open,
    onOpenChange: onCloseModals,
    errors,
    title: t("common:edit_entity", { entity: t("common:project-info") }),
    action: {
      title: t("common:save_entity", { entity: t("common:information") })
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_name", { entity: t("common:project") })}
            </FormLabel>
            <FormControl>
              <Input
                disabled={updateProjectMutation.isLoading}
                type="text"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Modal>
  )
}

export default InfoModal
