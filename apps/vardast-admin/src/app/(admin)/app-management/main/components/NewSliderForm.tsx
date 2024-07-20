"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import CardContainer from "@vardast/component/desktop/CardContainer"
import Dropzone from "@vardast/component/Dropzone"
import {
  ThreeBannerStatuses,
  useCreateBannerMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
import { ClientError } from "graphql-request"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = {}

const statuses = [
  {
    status: "تایید شده",
    value: ThreeBannerStatuses.Confirmed
  },
  { status: "در انتظار تایید", value: ThreeBannerStatuses.Pending },
  {
    status: "رد شده",
    value: ThreeBannerStatuses.Rejected
  }
]

const SliderSchema = z.object({
  name: z.string().optional(),
  link: z.string().optional(),
  sort: z.string().optional(),
  status: z.string().optional(),
  smallUuid: z.string().optional(),
  mediumUuid: z.string().optional(),
  largeUuid: z.string().optional(),
  xlargeUuid: z.string().optional()
})
type CreateSliderType = TypeOf<typeof SliderSchema>

function NewSliderForm({}: Props) {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [statusDialog, setStatusDialog] = useState<boolean>(false)
  // const [smallUuid, setSmallUuid] = useState<string>("")
  // const [mediumUuid, setMediumUuid] = useState<string>("")
  // const [largeUuid, setLargeUuid] = useState<string>("")
  // const [xlargeUuid, setXlargeUuid] = useState<string>("")

  const form = useForm<CreateSliderType>({
    resolver: zodResolver(SliderSchema),
    defaultValues: {}
  })

  const createSliderMutation = useCreateBannerMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["GetSlidersQuery"]
        })
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:slider")
          }),
          duration: 2000,
          variant: "success"
        })
        // router.push("/brands")
      }
    }
  )

  const handleSubmit = (data: CreateSliderType) => {
    createSliderMutation.mutate({
      createBannerInput: {
        name: data.name,
        link_url: data.link,
        large_uuid: form.getValues("largeUuid"),
        medium_uuid: form.getValues("mediumUuid"),
        small_uuid: form.getValues("smallUuid"),
        xlarge_uuid: form.getValues("xlargeUuid")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContainer title="افزودن اسلایدر">
          <div className="grid w-full grid-cols-4 grid-rows-4 gap-7">
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
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:link")}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:display_sort")}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("common:entity_status", { entity: t("common:show") })}
                  </FormLabel>
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
                        <CommandEmpty>
                          {t("common:no_entity_found", {
                            entity: t("common:producer")
                          })}
                        </CommandEmpty>
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
            <ul className="col-span-4 list-disc  text-error-500">
              <li>فرمت فایل بایستی PNG و یا JPG باشد.</li>
              <li>حجم آن نباید بیشتر از 50 مگابایت باشد.</li>
              <li>امکان آپلود چند فایل به صورت همزمان وجود ندارد.</li>
            </ul>
            <div className="col-span-2 flex flex-col gap-2">
              <span>{t("common:entity_size", { entity: "Small" })}</span>
              <Dropzone
                maxFiles={1}
                withHeight={false}
                uploadPath={uploadPaths.brandCatalog}
                onAddition={(file) => {
                  form.setValue("smallUuid", file.uuid)
                }}
                onDelete={(file) => {
                  // setSmallUuid("")
                }}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <span>{t("common:entity_size", { entity: "Medium" })}</span>
              <Dropzone
                withHeight={false}
                uploadPath={uploadPaths.brandCatalog}
                onAddition={(file) => {
                  console.log("add")
                  // setMediumUuid(file.uuid)
                  form.setValue("mediumUuid", file.uuid)
                }}
                onDelete={(file) => {
                  console.log("delete")
                  // setMediumUuid("")
                }}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <span>{t("common:entity_size", { entity: "Large" })}</span>{" "}
              <Dropzone
                withHeight={false}
                uploadPath={uploadPaths.brandCatalog}
                onAddition={(file) => {
                  console.log("add")
                  form.setValue("largeUuid", file.uuid)

                  // setLargeUuid(file.uuid)
                }}
                onDelete={(file) => {
                  console.log("delete")
                  // setLargeUuid("")
                }}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <span>{t("common:entity_size", { entity: "Xlarge" })}</span>{" "}
              <Dropzone
                withHeight={false}
                uploadPath={uploadPaths.brandCatalog}
                onAddition={(file) => {
                  console.log("add")
                  form.setValue("xlargeUuid", file.uuid)
                  // setXlargeUuid(file.uuid)
                }}
                onDelete={(file) => {
                  console.log("delete")
                  // setXlargeUuid("")
                }}
              />
            </div>
          </div>
          <div className="col-span-3 row-start-2 flex items-center gap-5 py-7">
            <hr className="h-0.5 w-6 bg-alpha-200" />
            <span className="text-alpha-500">تصاویر</span>
            <hr className="h-0.5 w-full bg-alpha-200" />
          </div>
        </CardContainer>
        <div className="mt-7 flex justify-end gap-3 border-t py-7">
          <Button type="submit" variant="primary">
            {t("common:submit")}
          </Button>
          <Button variant="ghost">{t("common:cancel")}</Button>
        </div>
      </form>
    </Form>
  )
}

export default NewSliderForm
