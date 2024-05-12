import { Dispatch, SetStateAction, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import Card from "@vardast/component/Card"
import {
  ThreeStateSupervisionStatuses,
  useGetAllSellersQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientAdmin from "@vardast/query/queryClients/graphqlRequestClientWhitToken"
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
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { UseFormReturn } from "react-hook-form"

import {
  OfferFilterFields,
  OffersQueryParams
} from "@/app/(admin)/offers/components/Offers"

type OffersFilterProps = {
  form: UseFormReturn<OfferFilterFields, any, undefined>
  setOffersQueryParams: Dispatch<SetStateAction<OffersQueryParams>>
}

export const OffersFilter = ({
  form,
  setOffersQueryParams
}: OffersFilterProps) => {
  const [sellersQuery, setSellersQuery] = useDebouncedState("", 500)
  const [sellerDialog, setSellerDialog] = useState(false)
  const [isPublicDialog, setIsPublicDialog] = useState(false)
  const [statusDialog, setStatusDialog] = useState(false)

  const { t } = useTranslation()

  const sellers = useGetAllSellersQuery(graphqlRequestClientAdmin, {
    indexSellerInput: {
      name: sellersQuery
    }
  })

  const handleSubmit = () => {
    setOffersQueryParams({
      sellerId: form.getValues("sellerId") as number,
      isPublic: form.getValues("isPublic") as string,
      status: form.getValues("status") as string,
      isAvailable: form.getValues("isAvailable") as string
    })
  }
  const handleReset = () => {
    form.setValue("status", undefined)
    form.reset()

    setOffersQueryParams({
      sellerId: form.getValues("sellerId") as number,
      isPublic: form.getValues("isPublic") as string,
      status: form.getValues("status") as string,
      isAvailable: form.getValues("isAvailable") as string
    })
  }
  const statuses = enumToKeyValueObject(ThreeStateSupervisionStatuses)

  const statusesOfActivation = [
    { status: "فعال", value: "true" },
    {
      status: "غیرفعال",
      value: "false"
    }
  ]

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

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <div className="flex flex-col justify-between gap-6">
            <div className="grid grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="sellerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:seller")}</FormLabel>
                    <Popover open={sellerDialog} onOpenChange={setSellerDialog}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={sellers.isLoading || sellers.isError}
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? sellers.data?.sellers.data.find(
                                  (seller) =>
                                    seller && seller.id === field.value
                                )?.name
                              : t("common:choose_entity", {
                                  entity: t("common:seller")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput
                            loading={sellers.isLoading}
                            placeholder={t("common:search_entity", {
                              entity: t("common:seller")
                            })}
                            onValueChange={(newQuery) => {
                              setSellersQuery(newQuery)
                            }}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:seller")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {sellers.data?.sellers.data.map(
                              (seller) =>
                                seller && (
                                  <CommandItem
                                    value={seller.name}
                                    key={seller.id}
                                    onSelect={(value: string) => {
                                      form.setValue(
                                        "sellerId",
                                        sellers.data.sellers.data.find(
                                          (item) =>
                                            item &&
                                            item.name.toLowerCase() === value
                                        )?.id || 0
                                      )
                                      setSellerDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        seller.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {seller.name}
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
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common:entity_status", {
                        entity: t("common:visibility")
                      })}
                    </FormLabel>
                    <Popover
                      open={isPublicDialog}
                      onOpenChange={setIsPublicDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {statusesOfActivation.find(
                              (st) => st.value === field.value
                            )?.status || t("common:select_placeholder")}
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
                            {statusesOfActivation.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("isPublic", value)
                                  setIsPublicDialog(false)
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common:entity_status", {
                        entity: t("common:visibility")
                      })}
                    </FormLabel>
                    <Popover open={statusDialog} onOpenChange={setStatusDialog}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {Object.keys(statuses).find(
                              (type) => statuses[type] === field.value
                            ) || t("common:select_placeholder")}

                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandGroup>
                            {Object.keys(statuses).map((type) => (
                              <CommandItem
                                value={type}
                                key={statuses[type]}
                                onSelect={() => {
                                  form.setValue(
                                    "status",
                                    statuses[type] as string
                                  )
                                  setStatusDialog(false)
                                }}
                              >
                                {type}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:stock")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? statusesOfAvailability.find(
                                  (st) => st.value === field.value
                                )?.status
                              : t("common:select_placeholder")}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:stock")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {statusesOfAvailability.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("isAvailable", value)
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
