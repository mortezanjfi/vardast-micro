"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useCreateVocabularyMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Input } from "@vardast/ui/input"
import { slugify } from "@vardast/util/slugify"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = {}

const CreateVocavulary = (_: Props) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<ClientError>()

  const queryClient = useQueryClient()
  const createVocabularyMutation = useCreateVocabularyMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GetAllVocabularies"] })
        form.reset()
        setOpen(false)
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:vocabulary")
          }),
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  z.setErrorMap(zodI18nMap)
  const CreateVocabularySchema = z.object({
    title: z.string(),
    titleEn: z.string(),
    slug: z.string(),
    sort: z.number().optional().default(0)
  })
  type CreateVocavulary = TypeOf<typeof CreateVocabularySchema>

  const form = useForm<CreateVocavulary>({
    resolver: zodResolver(CreateVocabularySchema),
    defaultValues: {
      sort: 0
    }
  })

  const titleEn = form.watch("titleEn")

  useEffect(() => {
    if (titleEn) {
      form.setValue("slug", slugify(titleEn))
    } else {
      form.setValue("slug", "")
    }
  }, [titleEn, form])

  function onSubmit(data: CreateVocavulary) {
    const { title, titleEn, slug, sort } = data

    createVocabularyMutation.mutate({
      createVocabularyInput: {
        title,
        titleEn,
        slug,
        sort
      }
    })
  }

  return (
    <>
      <Button size="medium" onClick={() => setOpen(true)}>
        {t("common:add_entity", { entity: t("common:vocabulary") })}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("common:create_new_entity", {
                entity: t("common:vocabulary")
              })}
            </DialogTitle>
          </DialogHeader>
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
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6 py-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common:title")}</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common:english_title")}</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
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
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common:display_sort")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={form.formState.isSubmitting}
                    loading={form.formState.isSubmitting}
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    {t("common:cancel")}
                  </Button>
                  <Button disabled={form.formState.isSubmitting} type="submit">
                    {t("common:submit")}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateVocavulary
