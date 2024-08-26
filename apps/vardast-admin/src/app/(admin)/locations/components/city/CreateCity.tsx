"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  CityTypesEnum,
  useCreateCityMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
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
import { Switch } from "@vardast/ui/switch"
import { slugify } from "@vardast/util/slugify"
import {
  englishInputSchema,
  persianInputSchema,
  slugInputSchema
} from "@vardast/util/zodValidationSchemas"
// import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = {
  provinceId: number
}

const CreateCity = ({ provinceId }: Props) => {
  const { t } = useTranslation()
  // const { data: session } = useSession()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()
  const createCityMutation = useCreateCityMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        form.reset()
        queryClient.invalidateQueries({ queryKey: ["GetProvince"] })
        setOpen(false)
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:city")
          }),
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  const CreateCitySchema = z.object({
    name: persianInputSchema,
    nameEn: englishInputSchema,
    slug: slugInputSchema,
    sort: z.number().optional().default(0),
    isActive: z.boolean().optional().default(true)
  })
  type CreateCity = TypeOf<typeof CreateCitySchema>

  const form = useForm<CreateCity>({
    resolver: zodResolver(CreateCitySchema),
    defaultValues: {
      sort: 0,
      isActive: true
    }
  })

  const nameEn = form.watch("nameEn")

  useEffect(() => {
    if (nameEn) {
      form.setValue("slug", slugify(nameEn))
    } else {
      form.setValue("slug", "")
    }
  }, [nameEn, form])

  function onSubmit(data: CreateCity) {
    const { name, nameEn, slug, sort, isActive } = data
    createCityMutation.mutate({
      createCityInput: {
        provinceId,
        name,
        nameEn,
        slug,
        sort,
        isActive,
        type: CityTypesEnum.City
      }
    })
  }

  return (
    <>
      <Button size="medium" onClick={() => setOpen(true)}>
        {t("common:add_entity", { entity: t("common:city") })}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("common:create_new_entity", {
                entity: t("common:city")
              })}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
              <>
                {createCityMutation.isError && <p>خطایی رخ داده</p>}
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:name")}</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:english_name")}</FormLabel>
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
              </>
              <DialogFooter>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    disabled={form.formState.isSubmitting}
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    {t("common:cancel")}
                  </Button>
                  <Button
                    disabled={form.formState.isSubmitting}
                    loading={form.formState.isSubmitting}
                    type="submit"
                  >
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

export default CreateCity
