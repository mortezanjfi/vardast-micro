"use client"

import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import {
  UpdateAttributeInput,
  useGetAllFilterableAdminAttributesQuery,
  useUpdateAttributeMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@vardast/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Switch } from "@vardast/ui/switch"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { notFound } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import {
  CategoryActionModalState,
  CategoryModalEnumType,
  OnOpenCategoryChangeProps
} from "@/app/(admin)/vocabularies/components/Categories"

type AttributeFormProps = {
  modalsOpen: CategoryActionModalState
  onOpenChange: (_: OnOpenCategoryChangeProps) => void
}

type AttributeItemFormProps = {
  category: {
    __typename?: "Attribute"
    id: number
    name: string
    isPublic: boolean
    isRequired: boolean
    isFilterable: boolean
    values?: {
      __typename?: "AttributeValues"
      options?: any | null
      defaults?: Array<string> | null
    } | null
  } | null
}

const EditCategoryAttributeModal = ({
  onOpenChange,
  modalsOpen
}: AttributeFormProps) => {
  const { t } = useTranslation()

  const uetAllFilterableAdminAttributesQuery =
    useGetAllFilterableAdminAttributesQuery(graphqlRequestClientAdmin, {
      filterableAttributesInput: {
        categoryId: modalsOpen?.category?.id ?? 0
      }
    })

  return (
    <>
      <Dialog
        open={modalsOpen[CategoryModalEnumType["EditAttribute"]]}
        onOpenChange={() =>
          onOpenChange({
            type: CategoryModalEnumType["EditAttribute"],
            currentCategory: modalsOpen.category
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("common:edit_entity", { entity: t("common:attributes") })}
            </DialogTitle>
            <Link
              className="flex justify-center"
              href={`/attributes/new/${
                modalsOpen?.category?.id ? modalsOpen?.category?.id : ""
              }`}
            >
              <Button size="medium">
                {t("common:add_entity", { entity: t("common:attribute") })}
              </Button>
            </Link>
          </DialogHeader>
          <div className="flex flex-col divide-y">
            {uetAllFilterableAdminAttributesQuery.isLoading ? (
              <Loading />
            ) : !!uetAllFilterableAdminAttributesQuery.error ? (
              <LoadingFailed />
            ) : !uetAllFilterableAdminAttributesQuery.data ? (
              notFound()
            ) : uetAllFilterableAdminAttributesQuery.data
                ?.filterableAdminAttributes.filters.length ? (
              uetAllFilterableAdminAttributesQuery.data?.filterableAdminAttributes.filters.map(
                (categoryItem) => (
                  <AttributeItem
                    category={categoryItem}
                    key={categoryItem?.id}
                  />
                )
              )
            ) : (
              <p className="text-center font-bold text-error">
                فیلتری یافت نشد
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

const AttributeItem = ({ category }: AttributeItemFormProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [errors, setErrors] = useState<ClientError>()

  z.setErrorMap(zodI18nMap)
  const CreateAttributeSchema = z.object({
    id: z.number(),
    isPublic: z.boolean().optional(),
    isFilterable: z.boolean().optional(),
    isRequired: z.boolean().optional()
  })

  type CreateAttributeType = TypeOf<typeof CreateAttributeSchema>

  const form = useForm<CreateAttributeType>({
    resolver: zodResolver(CreateAttributeSchema),
    defaultValues: {
      id: category?.id,
      isRequired: category?.isRequired,
      isFilterable: category?.isFilterable,
      isPublic: category?.isPublic
    }
  })

  const updateAttributeMutation = useUpdateAttributeMutation(
    graphqlRequestClientAdmin,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:attribute")
          }),
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  function onSubmit(data: CreateAttributeType) {
    updateAttributeMutation.mutate({
      updateAttributeInput: data as UpdateAttributeInput
    })
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
      <form className="py-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="flex items-center gap-6">
          <Link
            href={`/attributes/${category?.id}`}
            target="_blank"
            className="flex flex-1 flex-col"
          >
            <p className="font-bold">{category?.name}</p>
            <div className="pr pt">
              {category?.values?.options?.map(
                (value: string, idx: number) =>
                  value && (
                    <span key={idx} className="inline-block leading-none">
                      {value}
                    </span>
                  )
              )}
            </div>
          </Link>
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormControl>
                    <Switch
                      type="submit"
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
            name="isFilterable"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormControl>
                    <Switch
                      type="submit"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel noStyle>{t("common:filterable")}</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isRequired"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormControl>
                    <Switch
                      type="submit"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel noStyle>{t("common:required")}</FormLabel>
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

export default EditCategoryAttributeModal
