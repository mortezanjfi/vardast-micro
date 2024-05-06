"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Offer,
  ThreeStateSupervisionStatuses,
  useCreateOfferMutation,
  useGetAllProductsWithoutPaginationQuery,
  useGetSellersWithoutPaginationQuery,
  useUpdateOfferMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@vardast/ui/select"
import { Switch } from "@vardast/ui/switch"
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import {
  LucideAlertOctagon,
  LucideCheck,
  LucideChevronsUpDown
} from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type OfferFormProps = {
  offer?: Offer
}

const OfferForm = ({ offer }: OfferFormProps) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()
  const [sellerOpen, setSellerOpen] = useState<boolean>(false)
  const [productsOpen, setProductsOpen] = useState<boolean>(false)

  const statuses = enumToKeyValueObject(ThreeStateSupervisionStatuses)

  const sellers = useGetSellersWithoutPaginationQuery(
    graphqlRequestClientAdmin,
    {
      indexSellerInput: {
        status: ThreeStateSupervisionStatuses.Confirmed
      }
    }
  )
  const products = useGetAllProductsWithoutPaginationQuery(
    graphqlRequestClientAdmin
  )

  const createOfferMutation = useCreateOfferMutation(
    graphqlRequestClientAdmin,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:offer")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/admin/offers")
      }
    }
  )
  const updateOfferMutation = useUpdateOfferMutation(
    graphqlRequestClientAdmin,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:offer")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/admin/offers")
      }
    }
  )

  z.setErrorMap(zodI18nMap)
  const CreateOfferSchema = z.object({
    sellerId: z.number(),
    productId: z.number(),
    status: z.nativeEnum(ThreeStateSupervisionStatuses).optional(),
    isPublic: z.boolean().default(true),
    isAvailable: z.boolean().default(true)
  })
  type CreateOfferType = TypeOf<typeof CreateOfferSchema>

  const form = useForm<CreateOfferType>({
    resolver: zodResolver(CreateOfferSchema),
    defaultValues: {
      sellerId: offer ? offer?.seller.id : session?.profile?.seller?.id,
      productId: offer?.product.id,
      status: offer?.status,
      isPublic: offer?.isPublic || true,
      isAvailable: offer?.isAvailable ?? undefined
    }
  })

  function onSubmit(data: CreateOfferType) {
    const { sellerId, productId, status, isPublic, isAvailable } = data

    if (offer) {
      updateOfferMutation.mutate({
        updateOfferInput: {
          id: offer.id,
          sellerId,
          productId,
          status,
          isPublic,
          isAvailable
        }
      })
    } else {
      createOfferMutation.mutate({
        createOfferInput: {
          sellerId,
          productId,
          status,
          isPublic,
          isAvailable
        }
      })
    }
  }

  return (
    <Form {...form}>
      {errors && (
        <Alert variant="danger">
          <LucideAlertOctagon />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>
            {(
              errors.response.errors?.at(0)?.extensions
                .displayErrors as string[]
            ).map((error) => (
              <p key={error}>{error}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="mb-6 mt-8 flex items-end justify-between">
          <h2 className="text-xl font-black text-alpha-800 lg:text-3xl">
            {t("common:new_entity", { entity: t("common:offer") })}
          </h2>
          <Button
            className="sticky top-0"
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {t("common:save_entity", { entity: t("common:offer") })}
          </Button>
        </div>
        <div className="flex flex-col gap-8">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:product")}</FormLabel>
                <Popover open={productsOpen} onOpenChange={setProductsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={products.isLoading || products.isError}
                        noStyle
                        role="combobox"
                        className="input-field flex items-center text-start"
                      >
                        {field.value
                          ? products.data?.productsWithoutPagination.find(
                              (product) => product && product.id === field.value
                            )?.name
                          : t("common:choose_entity", {
                              entity: t("common:product")
                            })}
                        <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput
                        placeholder={t("common:search_entity", {
                          entity: t("common:product")
                        })}
                      />
                      <CommandEmpty>
                        {t("common:no_entity_found", {
                          entity: t("common:product")
                        })}
                      </CommandEmpty>
                      <CommandGroup>
                        {products.data?.productsWithoutPagination.map(
                          (product) =>
                            product && (
                              <CommandItem
                                value={product.name}
                                key={product.id}
                                onSelect={(value) => {
                                  form.setValue(
                                    "productId",
                                    products.data?.productsWithoutPagination.find(
                                      (item) =>
                                        item &&
                                        item.name.toLowerCase() === value
                                    )?.id || 0
                                  )
                                  setProductsOpen(false)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    product.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {product.name}
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

          {session?.abilities?.includes("gql.products.offer.update") && (
            <FormField
              control={form.control}
              name="sellerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:seller")}</FormLabel>
                  <Popover open={sellerOpen} onOpenChange={setSellerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={sellers.isLoading || sellers.isError}
                          noStyle
                          role="combobox"
                          className="input-field flex items-center text-start"
                        >
                          {field.value
                            ? sellers.data?.sellersWithoutPagination.find(
                                (seller) => seller && seller.id === field.value
                              )?.name
                            : t("common:choose_entity", {
                                entity: t("common:seller")
                              })}
                          <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="z-[9999]">
                      <Command>
                        <CommandInput
                          placeholder={t("common:search_entity", {
                            entity: t("common:seller")
                          })}
                        />
                        <CommandEmpty>
                          {t("common:no_entity_found", {
                            entity: t("common:seller")
                          })}
                        </CommandEmpty>
                        <CommandGroup>
                          {sellers.data?.sellersWithoutPagination.map(
                            (seller) =>
                              seller && (
                                <CommandItem
                                  value={seller.name}
                                  key={seller.id}
                                  onSelect={(value) => {
                                    form.setValue(
                                      "sellerId",
                                      sellers.data?.sellersWithoutPagination.find(
                                        (item) =>
                                          item &&
                                          item.name.toLowerCase() === value
                                      )?.id || 0
                                    )
                                    setSellerOpen(false)
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
          )}

          {session?.abilities?.includes("gql.products.offer.update") && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:status")}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      form.setValue(
                        "status",
                        value as ThreeStateSupervisionStatuses
                      )
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("common:select_placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(statuses).map((type) => (
                        <SelectItem value={statuses[type]} key={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel noStyle>{t("common:visibility")}</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel noStyle>{t("common:is_available")}</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}

export default OfferForm
