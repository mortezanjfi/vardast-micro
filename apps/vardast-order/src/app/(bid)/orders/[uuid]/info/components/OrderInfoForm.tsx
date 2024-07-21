/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import DatePickerMulti from "@vardast/component/date-picker/DatePicker"
import CardContainer from "@vardast/component/desktop/CardContainer"
import {
  PaymentMethodEnum,
  PreOrderStates,
  UpdatePreOrderInput,
  useFindPreOrderByIdQuery,
  useGetAllCategoriesQuery,
  useGetAllProjectsQuery,
  useUpdatePreOrderMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@vardast/ui/command"
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
import { Textarea } from "@vardast/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import zodI18nMap from "@vardast/util/zodErrorMap"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { DateObject } from "react-multi-date-picker"
import { TypeOf, z } from "zod"

type OrderInfoFormProps = {
  isMobileView: boolean
  uuid: string
}
export type CreateOrderInfoType = TypeOf<typeof CreateOrderInfoSchema>

const CreateOrderInfoSchema = z.object({
  projectId: z.string(),
  need_date: z.string(),
  addressId: z.number(),
  payment_methods: z.string(),
  descriptions: z.string().optional(),
  categoryId: z.number(),
  expert_name: z.string().optional(),
  applicant_name: z.string().optional()
})

const OrderInfoForm = ({ uuid }: OrderInfoFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [projectDialog, setProjectDialog] = useState(false)
  const [projectQueryTemp, setProjectQueryTemp] = useState("")

  const [addressDialog, setAddressDialog] = useState(false)
  const [addressQueryTemp, setAddressQueryTemp] = useState("")

  const [categoryDialog, setCategoryDialog] = useState(false)
  const [categoryQueryTemp, setCategoryQueryTemp] = useState("")

  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const rootCategories = useGetAllCategoriesQuery(
    graphqlRequestClientWithToken,
    {
      indexCategoryInput: {
        onlyRoots: true
      }
    }
  )

  const updatePreOrderMutation = useUpdatePreOrderMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        ;(
          errors.response.errors?.at(0)?.extensions.displayErrors as string[]
        ).map((error) =>
          toast({
            description: error,
            duration: 5000,
            variant: "danger"
          })
        )
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindPreOrderById"]
        })

        router.push(`${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders/${uuid}`)
      }
    }
  )

  const myProjectsQuery = useGetAllProjectsQuery(
    graphqlRequestClientWithToken,
    undefined,
    {
      refetchOnMount: "always"
    }
  )

  const form = useForm<CreateOrderInfoType>({
    resolver: zodResolver(CreateOrderInfoSchema)
  })

  z.setErrorMap(zodI18nMap)

  const addresses = useMemo(
    () =>
      form.watch("projectId") && myProjectsQuery.data
        ? myProjectsQuery.data?.projects.data.find(
            (project) => project.id === +form.watch("projectId")
          )?.address
        : [],
    [
      form.watch("projectId"),
      form.watch("addressId"),
      router,
      findPreOrderByIdQuery.data,
      myProjectsQuery.data
    ]
  )

  const submit = (data: CreateOrderInfoType) => {
    updatePreOrderMutation.mutate({
      updatePreOrderInput: {
        ...data,
        expert_name: data.expert_name,
        applicant_name: data.applicant_name,
        categoryId: +data.categoryId,
        projectId: +data.projectId,
        id: +uuid
      } as UpdatePreOrderInput
    })
  }

  useEffect(() => {
    if (
      findPreOrderByIdQuery?.data?.findPreOrderById.status ===
      PreOrderStates.Closed
    ) {
      router.push(`${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders`)
    } else if (findPreOrderByIdQuery?.data?.findPreOrderById) {
      const defaultValue = findPreOrderByIdQuery?.data?.findPreOrderById
      if (defaultValue?.address?.id) {
        form.setValue("addressId", defaultValue?.address?.id)
      }
      if (defaultValue?.descriptions) {
        form.setValue("descriptions", defaultValue?.descriptions)
      }
      if (defaultValue?.need_date) {
        form.setValue("need_date", defaultValue?.need_date)
      }
      if (defaultValue?.payment_methods) {
        form.setValue("payment_methods", defaultValue?.payment_methods)
      }
      if (defaultValue?.project?.id) {
        form.setValue("projectId", `${defaultValue?.project?.id}`)
      }
      if (defaultValue?.category?.id) {
        form.setValue("categoryId", defaultValue?.category?.id)
      }
      if (defaultValue?.expert_name) {
        form.setValue("expert_name", defaultValue?.expert_name)
      }
      if (defaultValue?.applicant_name) {
        form.setValue("applicant_name", defaultValue?.applicant_name)
      }
    }
  }, [findPreOrderByIdQuery?.data])

  return (
    <>
      {/* {isMobileView && (
        <PageTitle
          className="pb"
          titleClass="text-sm"
          title={"ثبت اطلاعات سفارش"}
        />
      )} */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          <CardContainer
            title="ثبت اطلاعات سفارش"
            button={{
              text: t("common:verify"),
              type: "submit",
              loading: updatePreOrderMutation.isLoading,
              disabled:
                findPreOrderByIdQuery.isFetching ||
                findPreOrderByIdQuery.isLoading ||
                updatePreOrderMutation.isLoading
            }}
          >
            <div className="flex grid-cols-3 grid-rows-3 flex-col gap-x-7 gap-y-5 pb-4 md:grid">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:project")}</FormLabel>
                    <Popover
                      open={projectDialog}
                      onOpenChange={setProjectDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            // disabled={myProjectsQuery.data?.myProjects.length === 0}
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            <span className="inline-block max-w-full truncate">
                              {field.value
                                ? myProjectsQuery.data?.projects.data.find(
                                    (project) =>
                                      project && project.id === +field.value
                                  )?.name
                                : t("common:choose_entity", {
                                    entity: t("common:project")
                                  })}
                            </span>
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="!z-[9999]" asChild>
                        <Command>
                          <CommandInput
                            loading={
                              myProjectsQuery.data?.projects.data.length === 0
                            }
                            value={projectQueryTemp}
                            onValueChange={(newQuery) => {
                              // setProvinceQuery(newQuery)
                              setProjectQueryTemp(newQuery)
                            }}
                            placeholder={t("common:search_entity", {
                              entity: t("common:project")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:project")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {myProjectsQuery.data?.projects.data.map(
                              (project) =>
                                project && (
                                  <CommandItem
                                    value={`${project.id}`}
                                    key={project.id}
                                    onSelect={(value) => {
                                      form.setValue("projectId", value)
                                      setProjectDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        project.id === +field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {project.name}
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

              <FormField
                control={form.control}
                name="need_date"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>زمان نیاز</FormLabel>
                    <FormControl>
                      <DatePickerMulti
                        value={value ? new DateObject(new Date(value)) : ""}
                        onChange={(dateObject: DateObject) => {
                          onChange(
                            dateObject?.isValid
                              ? dateObject?.toDate?.().toString()
                              : ""
                          )
                        }}
                        render={(value, openCalendar) => {
                          return (
                            <Button
                              onClick={openCalendar}
                              noStyle
                              type="button"
                              role="combobox"
                              className="input-field flex w-full items-center"
                            >
                              <span className="inline-block max-w-full truncate">
                                {value || "زمان نیاز را وارد کنید"}
                              </span>
                              <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                            </Button>
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
                name="addressId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:address")}</FormLabel>
                    <Popover
                      open={addressDialog}
                      onOpenChange={setAddressDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={addresses?.length === 0}
                            noStyle
                            role="combobox"
                            className="input-field flex items-center"
                          >
                            <span className="inline-block max-w-full truncate">
                              {field.value
                                ? addresses?.find(
                                    (address) =>
                                      address && address.id === field.value
                                  )?.address?.address
                                : t("common:choose_entity", {
                                    entity: t("common:address")
                                  })}
                            </span>
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="!z-[9999]" asChild>
                        <Command>
                          <CommandInput
                            loading={addresses?.length === 0}
                            value={addressQueryTemp}
                            onValueChange={(newQuery) => {
                              // setProvinceQuery(newQuery)
                              setAddressQueryTemp(newQuery)
                            }}
                            placeholder={t("common:search_entity", {
                              entity: t("common:address")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:address")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {addresses?.map(
                              (address) =>
                                address && (
                                  <CommandItem
                                    value={`${address.address.id}`}
                                    key={address.id}
                                    onSelect={(value) => {
                                      form.setValue(
                                        "addressId",
                                        addresses?.find(
                                          (address) =>
                                            address?.address?.id &&
                                            String(
                                              address.address.id
                                            ).toLowerCase() === value
                                        )?.id || 0
                                      )
                                      setAddressDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        address.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {`${address.address.title} - ${address.address.address}`}
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

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:category")}</FormLabel>
                    <Popover
                      open={categoryDialog}
                      onOpenChange={setCategoryDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={
                              rootCategories?.data?.categories?.data?.length ===
                              0
                            }
                            noStyle
                            role="combobox"
                            className="input-field flex items-center"
                          >
                            <span className="inline-block max-w-full truncate">
                              {field.value
                                ? rootCategories?.data?.categories?.data?.find(
                                    (category) =>
                                      category && category.id === +field.value
                                  )?.title
                                : t("common:choose_entity", {
                                    entity: t("common:category")
                                  })}
                            </span>
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="!z-[9999]" asChild>
                        <Command>
                          <CommandInput
                            loading={
                              rootCategories?.data?.categories?.data?.length ===
                              0
                            }
                            value={categoryQueryTemp}
                            onValueChange={(newQuery) => {
                              // setProvinceQuery(newQuery)
                              setCategoryQueryTemp(newQuery)
                            }}
                            placeholder={t("common:search_entity", {
                              entity: t("common:category")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:category")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {rootCategories?.data?.categories?.data?.map(
                              (category) =>
                                category && (
                                  <CommandItem
                                    value={`${category?.id}`}
                                    key={category?.id}
                                    onSelect={(value) => {
                                      form.setValue(
                                        "categoryId",
                                        rootCategories?.data?.categories?.data?.find(
                                          (category) =>
                                            category?.id &&
                                            category?.id === +value
                                        )?.id || 0
                                      )
                                      setCategoryDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        category.id === +field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category?.title}
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
                    <FormLabel>روش پرداخت</FormLabel>
                    <FormControl toggleInputGroup="h-full" className="h-14">
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
                            form.watch("payment_methods") ===
                              PaymentMethodEnum.Cash &&
                              "!bg-alpha-white !text-alpha-black shadow-lg"
                          )}
                          value={PaymentMethodEnum.Cash}
                        >
                          نقدی
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
                          غیرنقدی
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
                  <FormItem className="col-span-3">
                    <FormLabel>توضیحات سفارش</FormLabel>
                    <FormControl>
                      <Textarea style={{ resize: "none" }} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContainer>
        </form>
      </Form>
    </>
  )
}

export default OrderInfoForm
