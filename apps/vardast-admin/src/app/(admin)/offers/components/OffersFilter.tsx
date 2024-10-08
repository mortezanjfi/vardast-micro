import { Dispatch, SetStateAction, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import Card from "@vardast/component/Card"
import {
  ThreeStateSupervisionStatuses,
  useGetAllSellersQuery
} from "@vardast/graphql/generated"
import { statusesOfAvailability } from "@vardast/lib/AvailabilityStatus"
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

  const sellers = useGetAllSellersQuery(graphqlRequestClientWithToken, {
    indexSellerInput: {
      name: sellersQuery
    }
  })

  const handleSubmit = () => {
    setOffersQueryParams({
      sellerId: form.getValues("sellerId"),
      isPublic: form.getValues("isPublic"),
      status: form.getValues("status"),
      isAvailable: form.getValues("isAvailable")
    })
  }
  const handleReset = () => {
    form.setValue("status", undefined)
    form.reset()

    setOffersQueryParams({
      sellerId: form.getValues("sellerId"),
      isPublic: form.getValues("isPublic"),
      status: form.getValues("status"),
      isAvailable: form.getValues("isAvailable")
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
                            className="input-field flex items-center text-start"
                            disabled={sellers.isLoading || sellers.isError}
                            noStyle
                            role="combobox"
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
                                    key={seller.id}
                                    value={seller.name}
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
                            className="input-field flex items-center text-start"
                            noStyle
                            role="combobox"
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
                                key={st.status}
                                value={st.value}
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
                            className="input-field flex items-center text-start"
                            noStyle
                            role="combobox"
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
                                key={statuses[type]}
                                value={type}
                                onSelect={() => {
                                  form.setValue(
                                    "status",
                                    statuses[type]
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
                            className="input-field flex items-center text-start"
                            noStyle
                            role="combobox"
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
                                key={st.status}
                                value={st.value}
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
                  type="reset"
                  variant="secondary"
                  onClick={handleReset}
                >
                  {t("common:remove_filter")}
                </Button>
                <Button className="w-full" type="submit" variant="primary">
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
