/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import "chart.js/auto"

import { useRouter } from "next/navigation"
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

type AddOrderInfoFormProps = { uuid: string }

const CreateOrderInfoSchema = z.object({
  projectId: z.number(),
  expire: z.string(),
  addressId: z.number(),
  pay: z.string(),
  payDescription: z.string(),
  orderDescription: z.string()
})

export enum PayMethod {
  CASH = "CASH",
  CREDIT = "CREDIT"
}

export type CreateOrderInfoType = TypeOf<typeof CreateOrderInfoSchema>

const AddOrderInfoForm = ({ uuid }: AddOrderInfoFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [projectDialog, setProjectDialog] = useState(false)
  const [projectQueryTemp, setProjectQueryTemp] = useState("")

  const [addressDialog, setAddressDialog] = useState(false)
  const [addressQueryTemp, setAddressQueryTemp] = useState("")

  const [expireDialog, setExpireDialog] = useState(false)
  const [expireQueryTemp, setExpireQueryTemp] = useState("")

  const [value, setValue] = useState<PayMethod>(PayMethod.CASH)

  const form = useForm<CreateOrderInfoType>({
    resolver: zodResolver(CreateOrderInfoSchema)
  })
  z.setErrorMap(zodI18nMap)

  const projects = [
    { id: 1, name: "test" },
    { id: 2, name: "test2" }
  ]
  const addresses = [
    { id: 1, name: "test" },
    { id: 2, name: "test2" }
  ]
  const expireTime = ["1 روز", "1 ماه", "1 هفته"]

  const submit = (data: any) => {
    console.log(data)

    router.push(`/profile/orders/${uuid}/addOrderProducts
    `)
  }

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
                        disabled={projects.length < 0}
                        noStyle
                        role="combobox"
                        className="input-field flex items-center text-start"
                      >
                        {field.value
                          ? projects.find(
                              (project) => project && project.id === field.value
                            )?.name
                          : t("common:choose_entity", {
                              entity: t("common:project")
                            })}
                        <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="!z-[9999]" asChild>
                    <Command>
                      <CommandInput
                        loading={projects.length < 0}
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
                        {projects.map(
                          (project) =>
                            project && (
                              <CommandItem
                                value={project.name}
                                key={project.id}
                                onSelect={(value) => {
                                  form.setValue(
                                    "projectId",
                                    projects.find(
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
            name="expire"
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
                        disabled={addresses.length < 0}
                        noStyle
                        role="combobox"
                        className="input-field flex items-center text-start"
                      >
                        {field.value
                          ? expireTime.find(
                              (time) => time && time === field.value
                            )
                          : "زمان اعتبار سفارش را انتخاب کنید"}
                        <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="!z-[9999]" asChild>
                    <Command>
                      <CommandInput
                        loading={expireTime.length < 0}
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
                        {expireTime.map(
                          (time, index) =>
                            time && (
                              <CommandItem
                                value={time}
                                key={index}
                                onSelect={(value) => {
                                  form.setValue(
                                    "expire",
                                    expireTime.find(
                                      (time) =>
                                        time && time.toLowerCase() === value
                                    ) || ""
                                  )
                                  setAddressDialog(false)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    time === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {time}
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
                        disabled={addresses.length < 0}
                        noStyle
                        role="combobox"
                        className="input-field flex items-center text-start"
                      >
                        {field.value
                          ? addresses.find(
                              (address) => address && address.id === field.value
                            )?.name
                          : t("common:choose_entity", {
                              entity: t("common:address")
                            })}
                        <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="!z-[9999]" asChild>
                    <Command>
                      <CommandInput
                        loading={addresses.length < 0}
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
                        {addresses.map(
                          (address) =>
                            address && (
                              <CommandItem
                                value={address.name}
                                key={address.id}
                                onSelect={(value) => {
                                  form.setValue(
                                    "addressId",
                                    addresses.find(
                                      (address) =>
                                        address &&
                                        address.name.toLowerCase() === value
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
                                {address.name}
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
            name="pay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>روش پرداخت</FormLabel>
                <FormControl toggleInputGroup="h-full" className="h-14">
                  <ToggleGroup
                    className="input-field grid grid-cols-2 p-0.5"
                    type="single"
                    value={field.value || value}
                    onValueChange={(value: PayMethod) => {
                      form.setValue("pay", value)
                      setValue(value)
                    }}
                    defaultValue={PayMethod.CASH}
                  >
                    <ToggleGroupItem
                      className={clsx(
                        "h-full rounded-xl p-0.5 text-alpha-500",
                        value === PayMethod.CASH &&
                          "!bg-alpha-white !text-alpha-black shadow-lg"
                      )}
                      value={PayMethod.CASH}
                    >
                      نقدی
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className={clsx(
                        "h-full rounded-xl p-0.5 text-alpha-500",
                        value === PayMethod.CREDIT &&
                          "!bg-alpha-white !text-alpha-black shadow-lg"
                      )}
                      value={PayMethod.CREDIT}
                    >
                      اعتباری
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="payDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات روش پرداخت</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            {" "}
            <FormField
              control={form.control}
              name="orderDescription"
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
          <Button type="submit" variant="primary">
            افزودن کالا به سفارش
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddOrderInfoForm
