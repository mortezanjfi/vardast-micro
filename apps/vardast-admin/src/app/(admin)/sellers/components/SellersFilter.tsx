import { Dispatch, SetStateAction, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import Card from "@vardast/component/Card"
import { useGetAllBrandsWithoutPaginationQuery } from "@vardast/graphql/generated"
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
import { LucideCheck, LucideChevronsUpDown, LucideSearch } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { UseFormReturn } from "react-hook-form"

import {
  SellersFilterFields,
  SellersQueryParams
} from "@/app/(admin)/sellers/components/Sellers"

type SellersFilterProps = {
  form: UseFormReturn<SellersFilterFields>
  setSellersQueryParams: Dispatch<SetStateAction<SellersQueryParams>>
  sellersQueryParams: SellersQueryParams
}

const statusesOfAvailability = [
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

export const SellersFilter = ({
  form,
  setSellersQueryParams
}: SellersFilterProps) => {
  const { t } = useTranslation()
  const [brandsQuery, setBrandsQuery] = useDebouncedState("", 500)
  const [brandDialog, setBrandDialog] = useState(false)

  const brands = useGetAllBrandsWithoutPaginationQuery(
    graphqlRequestClientWithToken,
    {
      indexBrandInput: {
        name: brandsQuery
      }
    }
  )

  const handleSubmit = (data: any) => {
    console.log(data)

    setSellersQueryParams({ name: form.getValues("name") })
  }
  const handleReset = () => {
    form.reset()
    console.log(form.getValues("name"))
    setSellersQueryParams({ name: form.getValues("name") })
  }
  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <div className="flex flex-col justify-between gap-6">
            <div className="grid grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={() => (
                  <FormItem>
                    <FormLabel>{t("common:name")}</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />
                        <Input
                          autoFocus
                          defaultValue=""
                          onChange={(e) => {
                            form.setValue("name", e.target.value)
                          }}
                          type="text"
                          placeholder="فروشنده | فروشگاه | شناسه"
                          className="flex h-full w-full
                        items-center
                        gap-2
                        rounded-lg
                        bg-alpha-100
                        px-4
                         focus:!ring-0 disabled:bg-alpha-100"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:producer")}</FormLabel>
                    <Popover open={brandDialog} onOpenChange={setBrandDialog}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={brands.isLoading || brands.isError}
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? brands.data?.brandsWithoutPagination.find(
                                  (brand) => brand && brand.id === field.value
                                )?.name
                              : t("common:choose_entity", {
                                  entity: t("common:producer")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput
                            loading={brands.isLoading}
                            placeholder={t("common:search_entity", {
                              entity: t("common:producer")
                            })}
                            onValueChange={(newQuery) => {
                              setBrandsQuery(newQuery)
                            }}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {brands.data?.brandsWithoutPagination.map(
                              (brand) =>
                                brand && (
                                  <CommandItem
                                    value={brand.name}
                                    key={brand.id}
                                    onSelect={(value) => {
                                      form.setValue(
                                        "brandId",
                                        brands.data?.brandsWithoutPagination.find(
                                          (item) =>
                                            item &&
                                            item.name.toLowerCase() === value
                                        )?.id || 0
                                      )
                                      setBrandDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        brand.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {brand.name}
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
              />{" "}
              <FormField
                control={form.control}
                name="hasLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:logo")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {
                              statusesOfAvailability.find(
                                (st) => st.value === field.value
                              )?.status
                            }
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
                            {statusesOfAvailability.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("hasLogo", value)
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
            </div>{" "}
            <div className="grid grid-cols-4 gap-6">
              <div className="col-start-4 flex justify-end gap-3">
                <Button
                  className="w-full"
                  variant="secondary"
                  type="reset"
                  onClick={handleReset}
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
