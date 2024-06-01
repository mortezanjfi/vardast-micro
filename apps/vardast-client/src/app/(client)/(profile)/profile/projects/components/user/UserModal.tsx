import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMediaQuery } from "@mantine/hooks"
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
import clsx from "clsx"
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
  isMobileView,
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

  const isTabletOrMobile = useMediaQuery("(max-width: 640px)", true, {
    getInitialValueInEffect: false
  })

  return (
    <Dialog
      modal={!isMobileView}
      open={
        selectedUsers?.type === SELECTED_ITEM_TYPE.ADD ||
        selectedUsers?.type === SELECTED_ITEM_TYPE.EDIT
      }
      onOpenChange={onCloseModal}
    >
      <DialogContent
        className={clsx(
          "gap-7",
          isMobileView &&
            "h-full max-h-full w-screen max-w-screen !gap-0 rounded-none"
        )}
      >
        <div className="flex h-full w-full flex-col gap-7">
          <DialogHeader className="h-fit border-b pb-9 pt-4 md:pb md:pt-0">
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
            <form
              className="flex h-full flex-col justify-between"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex w-full grid-cols-2 flex-col gap-6 md:grid">
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
                <div className="grid grid-cols-2 items-center gap-2 md:flex">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
