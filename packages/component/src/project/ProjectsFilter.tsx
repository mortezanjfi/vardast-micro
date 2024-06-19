"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import {
  MultiStatuses,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import { LucideCheck, LucideChevronsUpDown, LucideSearch } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { UseFormReturn } from "react-hook-form"

import Card from "../../src/Card"
import { ProjectsFilterType } from "./ProjectsPage"

type ProjectsFilterprops = {
  form: UseFormReturn<ProjectsFilterType>
  setOrdersQueryParams: Dispatch<SetStateAction<ProjectsFilterType>>
}

export const ProjectsFilter = ({
  form,
  setOrdersQueryParams
}: ProjectsFilterprops) => {
  const [statusDialog, setStatusDialog] = useState(false)
  const [projectQuery, setProjectQuery] = useDebouncedState<string>("", 500)
  const [projectQueryTemp, setProjectQueryTemp] = useState<string>("")
  const [projectDialog, setProjectDialog] = useState(false)

  const { t } = useTranslation()

  const statuses = [
    {
      status: "تایید شده",
      value: MultiStatuses.Confirmed
    },
    { status: "در انتظار تایید", value: MultiStatuses.Pending },
    {
      status: "رد شده",
      value: MultiStatuses.Rejected
    }
  ]

  const myProjectsQuery = useGetAllProjectsQuery(
    graphqlRequestClientWithToken,
    {
      indexProjectInput: {
        nameOrUuid: projectQuery
      }
    }
  )

  const submit = (data: ProjectsFilterType) => {
    console.log(data)
    setOrdersQueryParams({
      name: form.getValues("name"),
      nameEmployer: form.getValues("nameEmployer"),
      nameManager: form.getValues("nameManager"),
      status: form.getValues("status")
    })
  }
  const reset = () => {
    form.reset()
    setProjectQuery("")
    setProjectQueryTemp("")
    setOrdersQueryParams({})
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(submit)}>
        <Card>
          <div className="flex flex-col justify-between gap-6">
            <div className="grid grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="name"
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
                            disabled={
                              myProjectsQuery.isLoading ||
                              myProjectsQuery.isError
                            }
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            <span className="inline-block max-w-full truncate">
                              {field.value
                                ? myProjectsQuery.data?.projects.data.find(
                                    (project) =>
                                      project && project.name === field.value
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
                              setProjectQuery(newQuery)
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
                                    value={`${project.name}`}
                                    key={project.id}
                                    onSelect={(value) => {
                                      console.log(value)

                                      form.setValue("name", value)
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameManager"
                render={(_) => (
                  <FormItem>
                    <FormLabel>{t("common:project-manager")}</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 py-0.5 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />

                        <Input
                          autoFocus
                          onChange={(e) => {
                            form.setValue("nameManager", e.target.value)
                          }}
                          type="text"
                          placeholder={t("common:project-manager")}
                          className="flex h-full w-full items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                          py-3.5
                           focus:!ring-0 disabled:bg-alpha-100"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameEmployer"
                render={(_) => (
                  <FormItem>
                    <FormLabel>
                      {t("common:entity_name", { entity: t("common:users") })}
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 py-0.5 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />

                        <Input
                          autoFocus
                          onChange={(e) => {
                            form.setValue("nameEmployer", e.target.value)
                          }}
                          type="text"
                          placeholder={t("common:entity_name", {
                            entity: t("common:users")
                          })}
                          className="flex h-full w-full items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                          py-3.5
                           focus:!ring-0 disabled:bg-alpha-100"
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
                          {/* <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty> */}
                          <CommandGroup>
                            {statuses.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.value}
                                onSelect={(value) => {
                                  form.setValue("status", value.toUpperCase())
                                  setStatusDialog(false)
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
                  </FormItem>
                )}
              />
              <div className="col-start-4 flex justify-end gap-3">
                <Button
                  className="w-full"
                  variant="secondary"
                  type="reset"
                  onClick={reset}
                >
                  {t("common:remove_filter")}
                </Button>
                <Button className="w-full" variant="primary" type="submit">
                  {t("common:submit_filter")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  )
}
