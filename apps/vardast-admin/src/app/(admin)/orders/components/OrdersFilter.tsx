"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import CardContainer from "@vardast/component/desktop/CardContainer"
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
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import clsx from "clsx"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { UseFormReturn } from "react-hook-form"

type OrdersFilterProps = {
  form: UseFormReturn<
    {
      projectCode?: string
      purchaserName?: string
      projectName?: string
      personInChargeId?: number

      fileStatus?: string
      orderStatus?: string
    },
    any,
    undefined
  >
  setOrderQUeryParams: Dispatch<
    SetStateAction<{
      projectCode: string
      purchaserName: string
      projectName: string
      personInChargeId: number
      fileStatus: string
      orderStatus: string
    }>
  >
}
export enum FileStatus {
  HAS = "HAS",
  HASNOT = "HASNOT"
}

export const OrdersFilter = ({
  form,
  setOrderQUeryParams
}: OrdersFilterProps) => {
  const [query, setQuery] = useDebouncedState<string>("", 500)
  const [queryTemp, setQueryTemp] = useState<string>("")
  const [personInchargeDialog, setPersonInchargeDialog] = useState(false)
  const [personInchargeQueryTemp, setPersonInchargeQueryTemp] = useState("")
  const [value, setValue] = useState<FileStatus>(FileStatus.HAS)

  const { t } = useTranslation()
  // useEffect(() => {
  //   form.setValue("brand", query)
  // }, [form, query])
  const handleSubmit = (data: any) => {
    console.log(data)

    setOrderQUeryParams({
      projectCode: form.getValues("projectCode"),
      purchaserName: form.getValues("purchaserName"),
      projectName: form.getValues("projectName"),
      personInChargeId: form.getValues("personInChargeId"),
      fileStatus: form.getValues("fileStatus"),
      orderStatus: form.getValues("orderStatus")
    })
  }
  const handleReset = () => {
    form.reset()
    setQuery("")
    setQueryTemp("")
    setOrderQUeryParams({
      projectCode: form.getValues("projectCode"),
      purchaserName: form.getValues("purchaserName"),
      projectName: form.getValues("projectName"),
      personInChargeId: form.getValues("personInChargeId"),
      fileStatus: form.getValues("fileStatus"),
      orderStatus: form.getValues("orderStatus")
    })
  }
  const statuses = [
    {
      status: "دارد",
      value: "true"
    },
    { status: "ندارد", value: "false" },
    {
      status: "همه",
      value: ""
    }
  ]

  const personsInCharge = [
    { id: 1, name: "person1" },
    { id: 2, name: "person2" }
  ]

  return (
    <CardContainer title="جستجو">
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex  flex-col justify-between gap-6">
            <div className="grid grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="projectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      {t("common:entity_code", { entity: t("common:order") })}
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="purchaserName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common:entity_name", {
                        entity: t("common:purchaser")
                      })}
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      {t("common:entity_name", { entity: t("common:project") })}
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personInChargeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مسوول سفارش</FormLabel>
                    <Popover
                      modal
                      open={personInchargeDialog}
                      onOpenChange={setPersonInchargeDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={personsInCharge.length < 0}
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? personsInCharge.find(
                                  (person) =>
                                    person && person.id === field.value
                                )?.name
                              : t("common:choose_entity", {
                                  entity: t("common:person")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="!z-[9999]" asChild>
                        <Command>
                          <CommandInput
                            loading={personsInCharge.length < 0}
                            value={personInchargeQueryTemp}
                            onValueChange={(newQuery) => {
                              // setProvinceQuery(newQuery)
                              setPersonInchargeQueryTemp(newQuery)
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
                            {personsInCharge.map(
                              (person) =>
                                person && (
                                  <CommandItem
                                    value={person.name}
                                    key={person.id}
                                    onSelect={(value) => {
                                      form.setValue(
                                        "personInChargeId",
                                        personsInCharge.find(
                                          (person) =>
                                            person &&
                                            person.name.toLowerCase() === value
                                        )?.id || 0
                                      )
                                      setPersonInchargeDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        person.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {person.name}
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
                name="fileStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:file")}</FormLabel>
                    <FormControl toggleInputGroup="h-full" className="h-14">
                      <ToggleGroup
                        className="input-field grid grid-cols-2 p-0.5"
                        type="single"
                        value={field.value || value}
                        onValueChange={(value: FileStatus) => {
                          form.setValue("fileStatus", value)
                          setValue(value)
                        }}
                        defaultValue={FileStatus.HAS}
                      >
                        <ToggleGroupItem
                          className={clsx(
                            "h-full rounded-xl p-0.5 text-alpha-500",
                            value === FileStatus.HAS &&
                              "!bg-alpha-white !text-alpha-black shadow-lg"
                          )}
                          value={FileStatus.HAS}
                        >
                          دارد
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          className={clsx(
                            "h-full rounded-xl p-0.5 text-alpha-500",
                            value === FileStatus.HASNOT &&
                              "!bg-alpha-white !text-alpha-black shadow-lg"
                          )}
                          value={FileStatus.HASNOT}
                        >
                          ندارد
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:status")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? statuses.find((st) => st.value === field.value)
                                  ?.status
                              : t("common:choose_entity", {
                                  entity: t("common:status")
                                })}

                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {statuses.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("orderStatus", value)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    st.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {st.status}
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
            </div>
            <div className="flex flex-row-reverse gap-3">
              <Button
                className="py-2"
                variant="secondary"
                type="reset"
                onClick={handleReset}
              >
                {t("common:remove_filter")}
              </Button>
              <Button className="py-2" variant="primary" type="submit">
                {t("common:submit_filter")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </CardContainer>
  )
}
