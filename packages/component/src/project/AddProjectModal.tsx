"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient, UseQueryResult } from "@tanstack/react-query"
import {
  FindOneProjectQuery,
  TypeProject,
  useCreateProjectMutation,
  UserTypeProject,
  useUpdateProjectMutation
} from "@vardast/graphql/generated"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
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
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { toast } from "../../../hook/src/use-toast"
import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"

type Props = {
  setIdToEdit: Dispatch<SetStateAction<number>>
  findOneProjectQuery?: UseQueryResult<FindOneProjectQuery, unknown>
  isMobileView: boolean
  isAdmin?: boolean
  id: number
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export type CreateLegalUserInfoType = TypeOf<typeof CreateLegalUserSchema>

const CreateLegalUserSchema = z.object({
  type: z.string().optional(),
  cellPhone: z.string().optional(),
  name: z.string()
})

const AddLegalUserModal = ({
  setIdToEdit,
  isMobileView,
  findOneProjectQuery,
  isAdmin,
  id,
  open,
  setOpen
}: Props) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<CreateLegalUserInfoType>({
    resolver: zodResolver(CreateLegalUserSchema),
    defaultValues: {
      type: "LEGAL"
    }
  })

  const createProjectMutation = useCreateProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        toast({
          description: (
            errors.response.errors?.at(0)?.extensions.displayErrors as string[]
          )
            .map((error) => error)
            .join(" "),
          duration: 2000,
          variant: "danger"
        })
      },
      onSuccess: (data) => {
        if (data?.createProject?.id) {
          toast({
            description: "پروژه با موفقیت اضافه شد",
            duration: 2000,
            variant: "success"
          })
          router.push(`/profile/projects/${data.createProject.id}`)
          form.reset()
          setIdToEdit(undefined)
        } else {
          toast({
            description: "خطا درایجاد پروژه",
            duration: 2000,
            variant: "danger"
          })
        }
        form.reset()
        setIdToEdit(undefined)
      }
    }
  )

  const updateProjectMutation = useUpdateProjectMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        router.push(`/profile/projects/${id}`)
        form.reset()
        setIdToEdit(undefined)
      }
    }
  )

  const onSubmit = (data: CreateLegalUserInfoType) => {
    if (!id) {
      createProjectMutation.mutate({
        createProjectInput: {
          cellphone: data.cellPhone || undefined,
          type: data.type as TypeProject,
          name: data.name
        }
      })
    }
    updateProjectMutation.mutate({
      updateProjectInput: {
        id: +id,
        name: data.name,
        cellphone: data.cellPhone || undefined,
        type: data.type as TypeProject
      }
    })
  }

  useEffect(() => {
    if (findOneProjectQuery?.data?.findOneProject?.name) {
      form.setValue("name", findOneProjectQuery?.data?.findOneProject?.name)

      form.setValue(
        "cellPhone",
        findOneProjectQuery?.data?.findOneProject?.user.find(
          (user) => user && user?.type === UserTypeProject?.Manager
        )?.user?.cellphone
      )
      form.setValue("type", findOneProjectQuery?.data?.findOneProject?.type)
    }
  }, [findOneProjectQuery?.data])

  useEffect(() => {
    form.reset()
  }, [open])

  return (
    <Dialog modal={!isMobileView} open={open} onOpenChange={setOpen}>
      <DialogContent
        className={clsx(
          isMobileView && "h-full max-h-full w-screen max-w-screen rounded-none"
        )}
      >
        <div className="flex h-full w-full flex-col gap-7">
          <DialogHeader className="h-fit border-b pb-9 pt-4 md:pb md:pt-0">
            <DialogTitle>
              {t("common:add_new_entity", { entity: t("common:project") })}
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
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
            >
              <div className="flex w-full grid-cols-3 flex-col gap-7 md:grid ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>نام پروژه</FormLabel>
                      <FormControl>
                        <Input
                          disabled={
                            (findOneProjectQuery.isLoading &&
                              findOneProjectQuery.isFetching) ||
                            updateProjectMutation.isLoading ||
                            createProjectMutation.isLoading
                          }
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isAdmin && (
                  <>
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>نوع پروژه</FormLabel>
                          <FormControl
                            toggleInputGroup="h-full"
                            className="h-14"
                          >
                            <ToggleGroup
                              defaultValue="LEGAL"
                              className="input-field grid grid-cols-2 p-0.5"
                              type="single"
                              value={field.value}
                              onValueChange={(value: TypeProject) => {
                                form.setValue("type", value)
                              }}
                            >
                              <ToggleGroupItem
                                className={clsx(
                                  "h-full rounded-xl p-0.5 text-alpha-500",
                                  form.watch("type") === TypeProject.Legal &&
                                    "!bg-alpha-white !text-alpha-black shadow-lg"
                                )}
                                value={TypeProject.Legal}
                              >
                                حقوقی
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                className={clsx(
                                  "h-full rounded-xl p-0.5 text-alpha-500",
                                  form.watch("type") === TypeProject.Real &&
                                    "!bg-alpha-white !text-alpha-black shadow-lg"
                                )}
                                value={TypeProject.Real}
                              >
                                حقیقی
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cellPhone"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>{t("common:cellphone")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder={t("common:enter")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <div className="mt-auto flex w-full flex-row-reverse gap pt-6 md:mt-7 md:border-t ">
                <Button
                  className="w-full md:w-fit"
                  type="submit"
                  variant="primary"
                >
                  تایید و ادامه
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default AddLegalUserModal
