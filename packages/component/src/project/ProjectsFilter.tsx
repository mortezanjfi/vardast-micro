"use client"

import { FormControl, FormField, FormItem, FormLabel } from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { LucideSearch } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { TypeOf, z } from "zod"

import Filter from "../table/Filter"
import { IFilterProps } from "../table/type"

export const ProjectsFilterSchema = z.object({
  nameEmployer: z.string().nullish(),
  nameManager: z.string().nullish(),
  nameOrUuid: z.string().nullish()
})
export type ProjectsFilterType = TypeOf<typeof ProjectsFilterSchema>
export const ProjectsFilter = ({ form }: IFilterProps<ProjectsFilterType>) => {
  const { t } = useTranslation()

  return (
    <Filter form={form}>
      <FormField
        control={form.control}
        name="nameOrUuid"
        render={(_) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_name", { entity: t("common:project") })}
            </FormLabel>
            <FormControl>
              <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 py-0.5 pr-2 transition-all">
                <LucideSearch className="h-6 w-6 text-primary" />

                <Input
                  onChange={(e) => {
                    form.setValue("nameOrUuid", e.target.value)
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
                  {...form.register("nameOrUuid")}
                />
              </div>
            </FormControl>
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
                  {...form.register("nameManager")}
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
                  {...form.register("nameEmployer")}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </Filter>
  )
}
