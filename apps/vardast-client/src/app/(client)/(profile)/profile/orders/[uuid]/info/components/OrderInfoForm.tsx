/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  ExpireTypes,
  PaymentMethodEnum,
  PreOrderStates,
  UpdatePreOrderInput,
  useFindPreOrderByIdQuery,
  useMyProjectsQuery,
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
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import { Textarea } from "@vardast/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import zodI18nMap from "@vardast/util/zodErrorMap"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type OrderInfoFormProps = { uuid: string }
export type CreateOrderInfoType = TypeOf<typeof CreateOrderInfoSchema>

const CreateOrderInfoSchema = z.object({
  projectId: z.number(),
  expire_date: z.string(),
  addressId: z.number(),
  payment_methods: z.string(),
  descriptions: z.string().optional()
})

const ExpireTypesFa = {
  [ExpireTypes.OneDay]: {
    value: ExpireTypes.OneDay,
    name_fa: "یک روز"
  },
  [ExpireTypes.TwoDays]: {
    value: ExpireTypes.TwoDays,
    name_fa: "دو روز"
  },
  [ExpireTypes.ThreeDays]: {
    value: ExpireTypes.ThreeDays,
    name_fa: "سه روز"
  }
}

const OrderInfoForm = ({ uuid }: OrderInfoFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [projectDialog, setProjectDialog] = useState(false)
  const [projectQueryTemp, setProjectQueryTemp] = useState("")

  const [addressDialog, setAddressDialog] = useState(false)
  const [addressQueryTemp, setAddressQueryTemp] = useState("")

  const [expireDialog, setExpireDialog] = useState(false)
  const [expireQueryTemp, setExpireQueryTemp] = useState("")

  const [value, setValue] = useState<PaymentMethodEnum>(PaymentMethodEnum.Cash)

  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
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
        if (
          findPreOrderByIdQuery?.data?.findPreOrderById?.status ===
          PreOrderStates.Created
        ) {
          router.push(`/profile/orders/${uuid}/products`)
        } else {
          router.push(`/profile/orders`)
        }
        toast({
          title: "اطلاعات سفارش با موفقیت به سفارش اضافه شد",
          duration: 5000,
          variant: "success"
        })
      }
    }
  )

  const myProjectsQuery = useMyProjectsQuery(
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
      form.watch("projectId")
        ? myProjectsQuery.data?.myProjects.find(
            (project) => project.id === form.watch("projectId")
          )?.address
        : [],
    [form.watch("projectId"), form.watch("addressId")]
  )

  const submit = (data: CreateOrderInfoType) => {
    updatePreOrderMutation.mutate({
      updatePreOrderInput: { ...data, id: +uuid } as UpdatePreOrderInput
    })
  }

  useEffect(() => {
    if (findPreOrderByIdQuery.data?.findPreOrderById) {
      const defaultValue = findPreOrderByIdQuery?.data.findPreOrderById
      form.setValue("addressId", defaultValue?.address?.id)
      form.setValue("descriptions", defaultValue?.descriptions)
      form.setValue("expire_date", defaultValue?.expire_date)
      form.setValue("payment_methods", defaultValue?.payment_methods)
      form.setValue("projectId", defaultValue?.project?.id)
    }
  }, [findPreOrderByIdQuery.data, addresses])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <span className="py-5 pb-2 text-lg font-semibold">اطلاعات سفارش</span>
        <div className="grid grid-cols-3 grid-rows-3 gap-x-7 gap-y-5 border-b py-5">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:project")}</FormLabel>
                <Popover
                  modal
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
                            ? myProjectsQuery.data?.myProjects.find(
                                (project) =>
                                  project && project.id === field.value
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
                        loading={myProjectsQuery.data?.myProjects.length === 0}
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
                        {myProjectsQuery.data?.myProjects.map(
                          (project) =>
                            project && (
                              <CommandItem
                                value={project.name}
                                key={project.id}
                                onSelect={(value) => {
                                  form.setValue(
                                    "projectId",
                                    myProjectsQuery.data?.myProjects.find(
                                      (project) =>
                                        project &&
                                        project.name.toLowerCase() === value
                                    )?.id || 0
                                  )
                                  setProjectDialog(false)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    project.id === field.value
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
            name="expire_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>زمان اعتبار سفارش</FormLabel>
                <Popover
                  modal
                  open={expireDialog}
                  onOpenChange={setExpireDialog}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        noStyle
                        role="combobox"
                        className="input-field flex items-center text-start"
                      >
                        <span className="inline-block max-w-full truncate">
                          {field.value
                            ? ExpireTypesFa[field.value as ExpireTypes]?.name_fa
                            : "زمان اعتبار سفارش را انتخاب کنید"}
                        </span>
                        <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="!z-[9999]" asChild>
                    <Command>
                      <CommandInput
                        value={expireQueryTemp}
                        onValueChange={(newQuery) => {
                          // setProvinceQuery(newQuery)
                          setExpireQueryTemp(newQuery)
                        }}
                        placeholder="انتخاب کنید"
                      />
                      <CommandEmpty>
                        {t("common:no_entity_found", {
                          entity: t("common:address")
                        })}
                      </CommandEmpty>
                      <CommandGroup>
                        {Object.values(ExpireTypesFa).map((item, index) => (
                          <CommandItem
                            value={item.value}
                            key={index}
                            onSelect={(value) => {
                              form.setValue("expire_date", value?.toUpperCase())
                              setExpireDialog(false)
                            }}
                          >
                            <LucideCheck
                              className={mergeClasses(
                                "mr-2 h-4 w-4",
                                item.value === field.value?.toUpperCase()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.name_fa}
                          </CommandItem>
                        ))}
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
            name="addressId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:address")}</FormLabel>
                <Popover
                  modal
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
                              )?.address.address
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
                                {address.address.address}
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
            name="payment_methods"
            render={({ field }) => (
              <FormItem>
                <FormLabel>روش پرداخت</FormLabel>
                <FormControl toggleInputGroup="h-full" className="h-14">
                  <ToggleGroup
                    className="input-field grid grid-cols-2 p-0.5"
                    type="single"
                    value={field.value || value}
                    onValueChange={(value: PaymentMethodEnum) => {
                      form.setValue("payment_methods", value)
                      setValue(value)
                    }}
                    defaultValue={PaymentMethodEnum.Cash}
                  >
                    <ToggleGroupItem
                      className={clsx(
                        "h-full rounded-xl p-0.5 text-alpha-500",
                        value === PaymentMethodEnum.Cash &&
                          "!bg-alpha-white !text-alpha-black shadow-lg"
                      )}
                      value={PaymentMethodEnum.Cash}
                    >
                      نقدی
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className={clsx(
                        "h-full rounded-xl p-0.5 text-alpha-500",
                        value === PaymentMethodEnum.Credit &&
                          "!bg-alpha-white !text-alpha-black shadow-lg"
                      )}
                      value={PaymentMethodEnum.Credit}
                    >
                      اعتباری
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="descriptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات سفارش</FormLabel>
                  <FormControl>
                    <Textarea style={{ resize: "none" }} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row-reverse py-5">
          <Button
            disabled={
              findPreOrderByIdQuery.isFetching ||
              findPreOrderByIdQuery.isLoading ||
              updatePreOrderMutation.isLoading
            }
            loading={updatePreOrderMutation.isLoading}
            type="submit"
            variant="primary"
          >
            {findPreOrderByIdQuery?.data?.findPreOrderById?.status ===
            PreOrderStates.Created
              ? "افزودن"
              : "ویرایش"}{" "}
            اطلاعات سفارش
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default OrderInfoForm
