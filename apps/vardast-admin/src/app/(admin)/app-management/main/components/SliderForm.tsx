"use client"

import { ChangeEvent, SetStateAction, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import CardContainer from "@vardast/component/desktop/CardContainer"
import {
  Banner,
  useCreateBannerMutation,
  useUpdateBannerMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
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
import { ClientError } from "graphql-request"
import { LucideTrash, LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = { slider?: Banner }

const SliderSchema = z.object({
  name: z.string().optional(),
  link: z.string().optional(),
  sort: z.coerce.number().optional(),
  status: z.string().optional(),
  smallUuid: z.string().optional(),
  mediumUuid: z.string().optional(),
  largeUuid: z.string().optional(),
  xlargeUuid: z.string().optional()
})
type CreateSliderType = TypeOf<typeof SliderSchema>

function SliderForm({ slider }: Props) {
  const { t } = useTranslation()
  const [_, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const token = session?.accessToken || null
  //small--------------->
  const smallFileRef = useRef<HTMLInputElement>(null)
  const [smallFile, setSmallFile] = useState<File | null>(null)
  const [smallPreview, setSmallPreview] = useState<string>("")

  //medium--------------->
  const mediumFileRef = useRef<HTMLInputElement>(null)
  const [mediumFile, setMediumFile] = useState<File | null>(null)
  const [mediumPreview, setMediumPreview] = useState<string>("")

  //large--------------->
  const largeFileRef = useRef<HTMLInputElement>(null)
  const [largeFile, setLargeFile] = useState<File | null>(null)
  const [largePreview, setLargePreview] = useState<string>("")

  //Xlarge--------------->
  const xlargeFileRef = useRef<HTMLInputElement>(null)
  const [xlargeFile, setXlargeFile] = useState<File | null>(null)
  const [xlargePreview, setXlargePreview] = useState<string>("")

  const form = useForm<CreateSliderType>({
    resolver: zodResolver(SliderSchema),
    defaultValues: {
      link: slider?.url,
      name: slider?.name,
      status: slider?.status
    }
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
        router.push("/app-management/main")
      }
    }
  )

  const updateSliderMutation = useUpdateBannerMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:slider")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/app-management/main")
      }
    }
  )
  const handleSubmit = (data: CreateSliderType) => {
    if (slider) {
      updateSliderMutation.mutate({
        updateBannerInput: {
          id: slider.id,
          name: data.name,
          link_url: data.link,
          large_uuid: form.getValues("largeUuid"),
          medium_uuid: form.getValues("mediumUuid"),
          small_uuid: form.getValues("smallUuid"),
          xlarge_uuid: form.getValues("xlargeUuid"),
          sort: +form.getValues("sort")
        }
      })
    } else {
      createSliderMutation.mutate({
        createBannerInput: {
          name: data.name,
          link_url: data.link,
          large_uuid: form.getValues("largeUuid"),
          medium_uuid: form.getValues("mediumUuid"),
          small_uuid: form.getValues("smallUuid"),
          xlarge_uuid: form.getValues("xlargeUuid"),
          sort: +form.getValues("sort")
        }
      })
    }
  }

  useEffect(() => {
    console.log(typeof form.getValues("sort"))
  }, [form.watch("sort")])

  const onSliderUpload = (
    event: ChangeEvent<HTMLInputElement>,
    formValue: "smallUuid" | "mediumUuid" | "largeUuid" | "xlargeUuid",
    setFile: (value: SetStateAction<File>) => void,
    setFilePreview: (value: SetStateAction<string>) => void
  ) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.brandCatalog)
      formData.append("file", fileToUpload)
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`
        },
        body: formData
      }).then(async (response) => {
        if (!response.ok) {
          toast({
            description: t("common:entity_added_successfully", {
              entity: t("common:catalog")
            }),
            duration: 2000,
            variant: "success"
          })
        }

        const uploadResult = await response.json()
        form.setValue(formValue, uploadResult.uuid)
        setFile(fileToUpload)
        setFilePreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContainer title="افزودن اسلایدر">
          <div className="grid w-full grid-cols-4 gap-7">
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
            {/* <FormField
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
            /> */}
            <ul className="col-span-4 list-disc  text-error-500">
              <li>فرمت فایل بایستی PNG و یا JPG باشد.</li>
              <li>حجم آن نباید بیشتر از 50 مگابایت باشد.</li>
              <li>امکان آپلود چند فایل به صورت همزمان وجود ندارد.</li>
            </ul>
            {/* divide----------------> */}
            <div className="col-span-4 row-start-2 flex items-center gap-5 py-7">
              <hr className="h-0.5 w-6 bg-alpha-200" />
              <span className="text-alpha-500">تصاویر</span>
              <hr className="h-0.5 w-full bg-alpha-200" />
            </div>

            {/* small------------------> */}
            <div className="col-span-2 flex items-end gap-6">
              <Input
                type="file"
                onChange={(e) =>
                  onSliderUpload(e, "smallUuid", setSmallFile, setSmallPreview)
                }
                className="hidden"
                accept="image/*"
                ref={smallFileRef}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {smallPreview || slider?.small ? (
                  <Image
                    src={
                      smallPreview ||
                      (slider?.small?.presignedUrl.url as string)
                    }
                    fill
                    alt="..."
                    className="object-contain p-3"
                  />
                ) : (
                  <LucideWarehouse
                    className="h-8 w-8 text-alpha-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    smallFileRef.current?.click()
                  }}
                >
                  {smallFile
                    ? smallFile.name
                    : t("common:entity_size", { entity: "Small" })}
                </Button>
                {smallPreview && (
                  <Button
                    variant="danger"
                    iconOnly
                    onClick={() => {
                      form.setValue("smallUuid", "")
                      setSmallFile(null)
                      setSmallPreview("")
                    }}
                  >
                    <LucideTrash className="icon" />
                  </Button>
                )}
              </div>
            </div>

            {/* medium------------------> */}
            <div className="col-span-2 flex items-end gap-6">
              <Input
                type="file"
                onChange={(e) =>
                  onSliderUpload(
                    e,
                    "mediumUuid",
                    setMediumFile,
                    setMediumPreview
                  )
                }
                className="hidden"
                accept="image/*"
                ref={mediumFileRef}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {mediumPreview || slider?.medium ? (
                  <Image
                    src={
                      mediumPreview ||
                      (slider?.medium?.presignedUrl.url as string)
                    }
                    fill
                    alt="..."
                    className="object-contain p-3"
                  />
                ) : (
                  <LucideWarehouse
                    className="h-8 w-8 text-alpha-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    mediumFileRef.current?.click()
                  }}
                >
                  {mediumFile
                    ? mediumFile.name
                    : t("common:entity_size", { entity: "Medium" })}
                </Button>
                {mediumPreview && (
                  <Button
                    variant="danger"
                    iconOnly
                    onClick={() => {
                      form.setValue("mediumUuid", "")
                      setMediumFile(null)
                      setMediumPreview("")
                    }}
                  >
                    <LucideTrash className="icon" />
                  </Button>
                )}
              </div>
            </div>

            {/* large------------------> */}
            <div className="col-span-2 flex items-end gap-6">
              <Input
                type="file"
                onChange={(e) =>
                  onSliderUpload(e, "largeUuid", setLargeFile, setLargePreview)
                }
                className="hidden"
                accept="image/*"
                ref={largeFileRef}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {largePreview || slider?.large ? (
                  <Image
                    src={
                      largePreview ||
                      (slider?.large?.presignedUrl.url as string)
                    }
                    fill
                    alt="..."
                    className="object-contain p-3"
                  />
                ) : (
                  <LucideWarehouse
                    className="h-8 w-8 text-alpha-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    largeFileRef.current?.click()
                  }}
                >
                  {largeFile
                    ? largeFile.name
                    : t("common:entity_size", { entity: "Large" })}
                </Button>
                {largePreview && (
                  <Button
                    variant="danger"
                    iconOnly
                    onClick={() => {
                      form.setValue("largeUuid", "")
                      setLargeFile(null)
                      setLargePreview("")
                    }}
                  >
                    <LucideTrash className="icon" />
                  </Button>
                )}
              </div>
            </div>

            {/* Xlarge------------------> */}
            <div className="col-span-2 flex items-end gap-6">
              <Input
                type="file"
                onChange={(e) =>
                  onSliderUpload(
                    e,
                    "xlargeUuid",
                    setXlargeFile,
                    setXlargePreview
                  )
                }
                className="hidden"
                accept="image/*"
                ref={xlargeFileRef}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {xlargePreview || slider?.xlarge ? (
                  <Image
                    src={
                      xlargePreview ||
                      (slider?.xlarge?.presignedUrl.url as string)
                    }
                    fill
                    alt="..."
                    className="object-contain p-3"
                  />
                ) : (
                  <LucideWarehouse
                    className="h-8 w-8 text-alpha-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    xlargeFileRef.current?.click()
                  }}
                >
                  {xlargeFile
                    ? xlargeFile.name
                    : t("common:entity_size", { entity: "Xlarge" })}
                </Button>
                {xlargePreview && (
                  <Button
                    variant="danger"
                    iconOnly
                    onClick={() => {
                      form.setValue("xlargeUuid", "")
                      setXlargeFile(null)
                      setXlargePreview("")
                    }}
                  >
                    <LucideTrash className="icon" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContainer>
        <div className="mt-7 flex justify-end gap-3 border-t py-7">
          <Button type="submit" variant="primary">
            {t("common:submit")}
          </Button>
          <Button
            onClick={() => {
              router.push("/app-management/main")
            }}
            type="button"
            variant="ghost"
          >
            {t("common:cancel")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SliderForm
