"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebouncedState } from "@mantine/hooks"
import { useQueryClient } from "@tanstack/react-query"
import {
  TypeProject,
  useCreateProjectMutation,
  useGetAllLegalUsersQuery
} from "@vardast/graphql/generated"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@vardast/ui/command"
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
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import {
  LucideAlertOctagon,
  LucideCheck,
  LucideChevronsUpDown
} from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { toast } from "../../../hook/src/use-toast"
import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"

type Props = {
  isMobileView: boolean
  isAdmin?: boolean
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export type CreateLegalUserInfoType = TypeOf<typeof CreateLegalUserSchema>

const CreateLegalUserSchema = z.object({
  type: z.string().optional(),
  cellPhone: z.string().optional(),
  name: z.string()
})

const AddLegalUserModal = ({ isMobileView, isAdmin, open, setOpen }: Props) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const [projectType, setProjectType] = useState<"LEGAL" | "REAL">("LEGAL")
  const [legalDialog, setLegalDialog] = useState(false)
  const [legalQuery, setLegalQuery] = useDebouncedState<string>("", 500)
  const [legalQueryTemp, setLegalQueryTemp] = useState<string>("")

  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<CreateLegalUserInfoType>({
    resolver: zodResolver(CreateLegalUserSchema),
    defaultValues: {
      type: "LEGAL"
    }
  })

  const getAllLegalUsers = useGetAllLegalUsersQuery(
    graphqlRequestClientWithToken,
    {
      indexLegalInput: { nameOrUuid: legalQuery }
    }
  )

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

          router.push(`/profile/projects/${data.createProject.id}/?mode=new`)
          form.reset()
        } else {
          toast({
            description: "خطا درایجاد پروژه",
            duration: 2000,
            variant: "danger"
          })
        }
        form.reset()
      }
    }
  )

  const onSubmit = (data: CreateLegalUserInfoType) => {
    createProjectMutation.mutate({
      createProjectInput: {
        cellphone: data.cellPhone || undefined,
        type: data.type as TypeProject,
        name: data.name
      }
    })
  }

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
                                setProjectType(value)
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
                    {projectType === "REAL" ? (
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
                    ) : (
                      <FormField
                        control={form.control}
                        name="cellPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common:legal-user")}</FormLabel>
                            <Popover
                              modal
                              open={legalDialog}
                              onOpenChange={setLegalDialog}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    disabled={
                                      getAllLegalUsers.isLoading ||
                                      getAllLegalUsers.isError
                                    }
                                    noStyle
                                    role="combobox"
                                    className="input-field flex items-center text-start"
                                  >
                                    <span className="inline-block max-w-full truncate">
                                      {field?.value
                                        ? getAllLegalUsers?.data?.findAllLegals?.data?.find(
                                            (user) =>
                                              user &&
                                              user?.owner?.cellphone ===
                                                field?.value
                                          )?.name_company
                                        : t("common:legal-user")}
                                    </span>
                                    <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="!z-[9999]" asChild>
                                <Command>
                                  <CommandInput
                                    loading={
                                      getAllLegalUsers?.data?.findAllLegals
                                        ?.data?.length === 0
                                    }
                                    value={legalQueryTemp}
                                    onValueChange={(newQuery) => {
                                      console.log(newQuery)

                                      setLegalQuery(newQuery)
                                      setLegalQueryTemp(newQuery)
                                    }}
                                    placeholder={t("common:search_entity", {
                                      entity: t("common:legal-user")
                                    })}
                                  />
                                  <CommandEmpty>
                                    {t("common:no_entity_found", {
                                      entity: t("common:legal-user")
                                    })}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {getAllLegalUsers?.data?.findAllLegals?.data?.map(
                                      (user) =>
                                        user && (
                                          <CommandItem
                                            value={user?.owner?.cellphone}
                                            key={user?.id}
                                            onSelect={(value) => {
                                              console.log(value)
                                              value &&
                                                form.setValue(
                                                  "cellPhone",
                                                  value
                                                )
                                              setLegalDialog(false)
                                            }}
                                          >
                                            <LucideCheck
                                              className={mergeClasses(
                                                "mr-2 h-4 w-4",
                                                user?.owner?.cellphone ===
                                                  field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {user?.name_company}
                                          </CommandItem>
                                        )
                                    )}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>نام پروژه</FormLabel>
                      <FormControl>
                        <Input
                          disabled={
                            createProjectMutation.isLoading ||
                            createProjectMutation.isError
                          }
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-auto flex w-full flex-row-reverse gap pt-6 md:mt-7 md:border-t ">
                <Button
                  loading={
                    createProjectMutation.isLoading ||
                    createProjectMutation.isError
                  }
                  disabled={getAllLegalUsers.isError}
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
