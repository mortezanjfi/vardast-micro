"use client"

import { useState } from "react"
import { IFilterProps } from "@/table/type"
import { useDebouncedState } from "@mantine/hooks"
import {
  PreOrderStates,
  useGetAllProjectsQuery
} from "@vardast/graphql/generated"
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import { LucideCheck, LucideChevronsUpDown, LucideSearch } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { TypeOf, z } from "zod"

import { PreOrderStatesFa } from "../desktop/OrderCart"
import Filter from "../table/Filter"

export const OrdersFilterSchema = z.object({
  status: z.string().optional(),
  projectId: z.string().optional(),
  customerName: z.string().optional()
})
export type OrdersFilterType = TypeOf<typeof OrdersFilterSchema>

export const OrdersFilter = ({ form }: IFilterProps<OrdersFilterType>) => {
  const [projectDialog, setProjectDialog] = useState(false)
  const [projectQuery, setProjectQuery] = useDebouncedState<string>("", 500)
  const [projectQueryTemp, setProjectQueryTemp] = useState<string>("")

  const [statusDialog, setStatusDialog] = useState(false)

  const { t } = useTranslation()

  function getEnumValues<T>(enumObj: T): string[] {
    return Object.values(enumObj).filter(
      (value) => typeof value === "string"
    ) as string[]
  }

  // Get the values of PreOrderStates enum
  const orderStatus = [...getEnumValues(PreOrderStates)]

  const myProjectsQuery = useGetAllProjectsQuery(
    graphqlRequestClientWithToken,
    {
      indexProjectInput: {
        nameOrUuid: projectQuery
      }
    }
  )

  return (
    <Filter form={form}>
      <FormField
        control={form.control}
        name="customerName"
        render={(_) => (
          <FormItem>
            <FormLabel>{t("common:purchaser-name")}</FormLabel>
            <FormControl>
              <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 py-0.5 pr-2 transition-all">
                <LucideSearch className="h-6 w-6 text-primary" />

                <Input
                  autoFocus
                  onChange={(e) => {
                    form.setValue("customerName", e.target.value)
                  }}
                  type="text"
                  placeholder="نام خریدار"
                  className="flex h-full w-full items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                          py-3.5
                           focus:!ring-0 disabled:bg-alpha-100"
                  {...form.register("customerName")}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:status")}</FormLabel>
            <Popover open={statusDialog} onOpenChange={setStatusDialog}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    noStyle
                    role="combobox"
                    className="input-field flex items-center text-start"
                  >
                    <span>
                      {field.value
                        ? PreOrderStatesFa[
                            orderStatus.find((st) => st === field.value)
                          ]?.name_fa_admin
                        : t("common:choose_entity", {
                            entity: t("common:status")
                          })}
                    </span>
                    <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandEmpty>
                    {t("common:no_entity_found", {
                      entity: t("common:status")
                    })}
                  </CommandEmpty>
                  <CommandGroup>
                    {orderStatus.map((st) => (
                      <CommandItem
                        value={st}
                        key={st}
                        onSelect={(value) => {
                          setStatusDialog(false)
                          form.setValue("status", value.toUpperCase())
                        }}
                        {...form.register("status")}
                      >
                        <LucideCheck
                          className={mergeClasses(
                            "mr-2 h-4 w-4",
                            st === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {PreOrderStatesFa[st as PreOrderStates]?.name_fa_admin}
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
        name="projectId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:project")}</FormLabel>
            <Popover open={projectDialog} onOpenChange={setProjectDialog}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={
                      myProjectsQuery.isLoading || myProjectsQuery.isError
                    }
                    noStyle
                    role="combobox"
                    className="input-field flex items-center text-start"
                  >
                    <span className="inline-block max-w-full truncate">
                      {field.value
                        ? myProjectsQuery.data?.projects.data.find(
                            (project) => project && project.id === +field.value
                          )?.id
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
                    loading={myProjectsQuery.data?.projects.data.length === 0}
                    value={projectQueryTemp}
                    onValueChange={(newQuery) => {
                      setProjectQuery(newQuery)
                      setProjectQueryTemp(newQuery)
                    }}
                    placeholder={t("common:search_entity", {
                      entity: t("common:project")
                    })}
                    {...form.register("projectId")}
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
                              console.log(value)

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
    </Filter>
  )
}
