"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Uom,
  useCreateUomMutation,
  useUpdateUomMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Switch } from "@vardast/ui/switch"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { slugInputSchema } from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type UOMFormProps = {
  uom?: Uom
}

const UOMForm = ({ uom }: UOMFormProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()

  const createUOMMutation = useCreateUomMutation(graphqlRequestClientAdmin, {
    onError: (errors: ClientError) => {
      setErrors(errors)
    },
    onSuccess: () => {
      toast({
        description: t("common:entity_added_successfully", {
          entity: t("common:uom")
        }),
        duration: 2000,
        variant: "success"
      })
      router.push("/uoms")
    }
  })
  const updateUOMMutation = useUpdateUomMutation(graphqlRequestClientAdmin, {
    onError: (errors: ClientError) => {
      setErrors(errors)
    },
    onSuccess: () => {
      toast({
        description: t("common:entity_updated_successfully", {
          entity: t("common:uom")
        }),
        duration: 2000,
        variant: "success"
      })
      router.push("/uoms")
    }
  })

  z.setErrorMap(zodI18nMap)
  const CreateUOMSchema = z.object({
    name: z.string(),
    symbol: z.string(),
    slug: slugInputSchema,
    isActive: z.boolean().optional().default(true)
  })
  type CreateUOMType = TypeOf<typeof CreateUOMSchema>

  const form = useForm<CreateUOMType>({
    resolver: zodResolver(CreateUOMSchema),
    defaultValues: {
      isActive: uom?.isActive,
      name: uom?.name,
      symbol: uom?.symbol,
      slug: uom?.slug
    }
  })

  const name = form.watch("name")

  function onSubmit(data: CreateUOMType) {
    const { name, slug, isActive, symbol } = data

    if (uom) {
      updateUOMMutation.mutate({
        updateUomInput: {
          id: uom.id,
          name,
          slug,
          isActive,
          symbol
        }
      })
    } else {
      createUOMMutation.mutate({
        createUomInput: {
          name,
          slug,
          isActive,
          symbol
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
            {name ? name : t("common:new_entity", { entity: t("common:uom") })}
          </h2>
          <Button
            className="sticky top-0"
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {t("common:save_entity", { entity: t("common:uom") })}
          </Button>
        </div>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:symbol")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:slug")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("common:is_active")}</FormLabel>
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

export default UOMForm
