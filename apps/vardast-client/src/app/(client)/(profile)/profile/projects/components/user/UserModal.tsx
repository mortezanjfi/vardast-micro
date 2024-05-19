import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  CreateUserProjectInput,
  UpdateProjectUserInput,
  useAssignUserProjectMutation,
  useUpdateProjectUserMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@vardast/ui/dialog"
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
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import {
  ProjectUserCartProps,
  SELECTED_ITEM_TYPE
} from "@/app/(client)/(profile)/profile/projects/components/user/ProjectUsersTab"

export const AddUserModalFormSchema = z.object({
  name: z.string(),
  cellphone: z.string()
})

export type AddUserModalFormType = TypeOf<typeof AddUserModalFormSchema>

export const UserModal = ({
  onCloseModal,
  selectedUsers,
  uuid
}: ProjectUserCartProps) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const form = useForm<AddUserModalFormType>({
    resolver: zodResolver(AddUserModalFormSchema)
  })

  z.setErrorMap(zodI18nMap)

  const assignUserProjectMutation = useAssignUserProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        onCloseModal()
      }
    }
  )

  const updateProjectUserMutation = useUpdateProjectUserMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        onCloseModal()
      }
    }
  )

  const onSubmit = (data: any) => {
    if (selectedUsers?.data) {
      return updateProjectUserMutation.mutate({
        updateProjectUserInput: {
          ...(data as UpdateProjectUserInput),
          userId: selectedUsers?.data.id,
          projectId: +uuid
        }
      })
    }
    assignUserProjectMutation.mutate({
      createUserProjectInput: {
        ...(data as CreateUserProjectInput),
        projectId: +uuid
      }
    })
  }

  useEffect(() => {
    if (
      selectedUsers?.data &&
      selectedUsers?.type === SELECTED_ITEM_TYPE.EDIT
    ) {
      form.setValue("name", selectedUsers?.data.fullName)
      form.setValue("cellphone", selectedUsers?.data.cellphone)
    } else {
      form.reset()
    }
    return () => form.reset()
  }, [selectedUsers, selectedUsers?.data])

  return (
    <Dialog
      open={
        selectedUsers?.type === SELECTED_ITEM_TYPE.ADD ||
        selectedUsers?.type === SELECTED_ITEM_TYPE.EDIT
      }
      onOpenChange={onCloseModal}
    >
      <DialogContent className="gap-7">
        <DialogHeader className="border-b pb">
          <DialogTitle>
            {t("common:add_new_entity", { entity: t("common:user") })}
          </DialogTitle>
        </DialogHeader>
        {errors && (
          <Alert variant="danger">
            <LucideAlertOctagon />
            <AlertTitle>خطا</AlertTitle>
            <AlertDescription>
              {(
                errors.response.errors?.at(0)?.extensions
                  .displayErrors as string[]
              ).map((error) => (
                <p key={error}>{error}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام و نام خانوادگی</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
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
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-7 border-t pt">
              <div className="flex items-center gap-2">
                <Button
                  className="py-2"
                  variant="ghost"
                  onClick={() => {
                    onCloseModal()
                  }}
                >
                  انصراف
                </Button>
                <Button className="py-2" variant="primary" type="submit">
                  ذخیره
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
