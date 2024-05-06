import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Button } from "@vardast/ui/button"
import { Command, CommandGroup, CommandItem } from "@vardast/ui/command"
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
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import {
  ArrowUpFromLine,
  LucideCheck,
  LucideChevronsUpDown
} from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { NewBrandType } from "@/app/(admin)/brands/components/BrandForm"
import { FileObject } from "@/app/(admin)/brands/components/CatalogOrPriceNewFiles"

type BrandFilesModalProps = {
  setFilesList: Dispatch<SetStateAction<FileObject[]>>
  open: boolean
  activeTab: string
  onOpenChange: Dispatch<SetStateAction<boolean>>

  setNewBrandData: Dispatch<SetStateAction<NewBrandType | undefined>>
}
export const ModalSchema = z.object({
  fileUuid: z.string(),
  isVisible: z.string(),
  name: z.string()
})

export type CatalogModalType = TypeOf<typeof ModalSchema>

export const BrandFilesModal = ({
  setFilesList,
  onOpenChange,
  open,
  activeTab,
  setNewBrandData
}: BrandFilesModalProps) => {
  const [parentCategoryOpen, setParentCategoryOpen] = useState<boolean>(false)
  const { data: session } = useSession()
  const { t } = useTranslation()
  // const [errors, setErrors] = useState<ClientError | null>(null)

  const [file, setFile] = useState<File | null>()
  // const [filePreview, setfilePreview] = useState<string>("")

  const fileRef = useRef<HTMLInputElement>(null)
  const token = session?.accessToken || null
  //setting form
  const form = useForm<CatalogModalType>({
    resolver: zodResolver(ModalSchema),
    defaultValues: {}
  })

  const statuses = [
    { status: "فعال", value: "true" },
    {
      status: "غیرفعال",
      value: "false"
    }
  ]

  //upload catalog file
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target.files) {
      setFile(e.target.files[0])
      const fileToUpload = e.target.files[0]
      const formData = new FormData()

      //for price file upload
      if (activeTab === "price") {
        formData.append("directoryPath", uploadPaths.brandPriceList)
        formData.append("file", fileToUpload)
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file`, {
          method: "post",
          headers: {
            authorization: `Bearer ${token}`
          },
          body: formData
        }).then(async (response) => {
          if (!response.ok) {
          }

          const uploadResult = await response.json()

          form.setValue("fileUuid", uploadResult.uuid)

          setFile(fileToUpload)
          // setfilePreview(URL.createObjectURL(fileToUpload))
        })
      }

      //for catalog file upload
      if (activeTab === "catalog") {
        formData.append("directoryPath", uploadPaths.brandCatalog)
        formData.append("file", fileToUpload)
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file`, {
          method: "post",
          headers: {
            authorization: `Bearer ${token}`
          },
          body: formData
        }).then(async (response) => {
          if (!response.ok) {
          }

          const uploadResult = await response.json()

          form.setValue("fileUuid", uploadResult.uuid)

          setFile(fileToUpload)
          // setfilePreview(URL.createObjectURL(fileToUpload))
        })
      }
    }
  }

  const confirm = () => {
    //close the modal
    onOpenChange(false)

    if (file) {
      const newFile: FileObject = {
        file: file,
        isVisible: form.getValues("isVisible") as string,
        name: form.getValues("name") as string,
        size: file.size,
        fileUuid: form.getValues("fileUuid")
      }

      //set the uploaded file to the main state according to price or catalog
      if (activeTab === "price") {
        setNewBrandData((prev) => ({
          ...prev!,
          brandPriceUploadedInfo: [
            ...(prev?.brandPriceUploadedInfo ?? []),
            newFile
          ]
        }))
      }
      if (activeTab === "catalog") {
        setNewBrandData((prev) => ({
          ...prev!,
          brandCatalogUploadedInfo: [
            ...(prev?.brandCatalogUploadedInfo ?? []),
            newFile
          ]
        }))
      }

      //set the fileslist state for table data
      setFilesList((prev) => [...prev, newFile])
      //reset form
      form.reset()
      setFile(undefined)
    }
  }

  useEffect(() => {
    form.reset()
    setFile(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col">
          <DialogHeader className="mb-5">
            <DialogTitle>
              {" "}
              {t("common:add_new_entity", { entity: t(`common:${activeTab}`) })}
            </DialogTitle>
          </DialogHeader>
          {/* {errors && (
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
          )} */}
          <Form {...form}>
            <div className="flex flex-col pb-44 pt-7">
              <div className="mb-10 grid grid-cols-2 gap-7">
                {" "}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("common:entity_name", { entity: t("common:file") })}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="مثلا: کاتالوگ شیر آلات رو کار"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {" "}
                        {t("common:entity_status", {
                          entity: t("common:visibility")
                        })}
                      </FormLabel>
                      <Popover
                        modal
                        open={parentCategoryOpen}
                        onOpenChange={setParentCategoryOpen}
                      >
                        <PopoverTrigger asChild className="">
                          <FormControl>
                            <Button
                              noStyle
                              role="combobox"
                              className="input-field flex items-center text-start"
                            >
                              {statuses.find((st) => st.value === field.value)
                                ?.status || t("common:select_placeholder")}
                              <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent asChild className="!z-[9999]">
                          <Command>
                            <CommandGroup>
                              {statuses.map((st) => (
                                <CommandItem
                                  value={st.value}
                                  key={st.status}
                                  onSelect={(value) => {
                                    form.setValue("isVisible", value)
                                    setParentCategoryOpen(false)
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
              <div>
                <FormField
                  control={form.control}
                  name="fileUuid"
                  render={(_) => (
                    <div className="flex flex-col items-start gap-6">
                      <Input
                        type="file"
                        onChange={(e) => onFileChange(e)}
                        className="hidden"
                        accept="application/pdf"
                        ref={fileRef}
                      />
                      {/* <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                    {filePreview ? (
                      // eslint-disable-next-line react/jsx-no-undef
                      <Image
                        src={filePreview}
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
                  </div> */}
                      <div className="flex items-center gap-7">
                        <div>
                          {" "}
                          <Button
                            size="large"
                            className="flex flex-col gap-4 border-dashed"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              fileRef.current?.click()
                            }}
                          >
                            <ArrowUpFromLine />
                            {file
                              ? file.name
                              : t("common:upload_entity", {
                                  entity: t("common:file")
                                })}
                          </Button>
                        </div>
                        <div>
                          {" "}
                          <ul className=" list-disc text-alpha-500">
                            <li>فرمت فایل بایستی PDF باشد.</li>
                            <li>حجم آن نباید بیشتر از 50 مگابایت باشد.</li>
                            <li>
                              امکان آپلود چند فایل به صورت همزمان وجود ندارد.{" "}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </Form>

          <DialogFooter>
            <div className="flex items-center gap-2">
              <Button variant="primary" onClick={form.handleSubmit(confirm)}>
                {t("common:confirm")}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
