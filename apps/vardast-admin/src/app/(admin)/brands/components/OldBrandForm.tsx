"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import Card from "@vardast/component/Card"
import {
  Brand,
  useCreateBrandMutation,
  useUpdateBrandMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
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
import { Textarea } from "@vardast/ui/textarea"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon, LucideTrash, LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type BrandFormProps = {
  brand?: Brand
}

const BrandForm = ({ brand }: BrandFormProps) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()
  //logo
  const logoFileFieldRef = useRef<HTMLInputElement>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  //catalog
  const CatalogFileRef = useRef<HTMLInputElement>(null)
  const [catalogFile, setCatalogFile] = useState<File | null>(null)
  const [catalogPreview, setCatalogPreview] = useState<string>("")
  //priceList
  const priceListFileRef = useRef<HTMLInputElement>(null)
  const [priceListFile, setPriceListFile] = useState<File | null>(null)
  const [priceListPreview, setPriceListPreview] = useState<string>("")

  //banner
  const bannerFileRef = useRef<HTMLInputElement>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string>("")

  //mobile banner
  const mobileBannerFileRef = useRef<HTMLInputElement>(null)
  const [mobileBannerFile, setMobileBannerFile] = useState<File | null>(null)
  const [mobileBannerPreview, setMobileBannerPreview] = useState<string>("")

  const queryClient = useQueryClient()
  const token = session?.accessToken || null

  const createBrandMutation = useCreateBrandMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["GetAllBrands"]
        })
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:producer")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/brands")
      }
    }
  )
  const updateBrandMutation = useUpdateBrandMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:producer")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/brands")
      }
    }
  )

  z.setErrorMap(zodI18nMap)
  const CreateBrandSchema = z.object({
    name_fa: z.string(),
    name_en: z.string(),
    email: z.string().email().optional(),
    logoFileUuid: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
    about: z.string().optional(),
    social: z.string().optional(),
    catalogFileUuid: z.string().optional(),
    priceListUuid: z.string().optional(),
    bannerUuid: z.string().optional(),
    mobileBannerUuid: z.string().optional()
  })
  type CreateBrandType = TypeOf<typeof CreateBrandSchema>

  const form = useForm<CreateBrandType>({
    resolver: zodResolver(CreateBrandSchema),
    defaultValues: {
      name_fa: brand?.name_fa,
      name_en: brand?.name_en || undefined
      // logoFileUuid: brand?.logoFile?.uuid
    }
  })

  const name_fa = form.watch("name_fa")

  const onLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.brandLogo)
      formData.append("file", fileToUpload)
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`
        },
        body: formData
      }).then(async (response) => {
        if (!response.ok) {
        }

        const uploadResult = await response.json()
        form.setValue("logoFileUuid", uploadResult.uuid)

        setLogoFile(fileToUpload)
        setLogoPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  const onCatalogFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.brandCatalog)
      formData.append("file", fileToUpload)
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file/brand/catalogue/${brand?.id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`
          },
          body: formData
        }
      ).then(async (response) => {
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
        form.setValue("catalogFileUuid", uploadResult.uuid)

        setCatalogFile(fileToUpload)
        setCatalogPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  const onPriceListfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.brandPriceList)
      formData.append("file", fileToUpload)
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file/brand/priceList/${brand?.id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`
          },
          body: formData
        }
      ).then(async (response) => {
        if (!response.ok) {
          toast({
            description: t("common:entity_added_successfully", {
              entity: t("common:price-list")
            }),
            duration: 2000,
            variant: "success"
          })
        }

        const uploadResult = await response.json()
        form.setValue("priceListUuid", uploadResult.uuid)

        setPriceListFile(fileToUpload)
        setPriceListPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  const onBannerfileChange = (
    type: "mobile" | "desktop",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.brandBanner)
      formData.append("file", fileToUpload)
      formData.append("type", type)
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file/brand/banner/${brand?.id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`
          },
          body: formData
        }
      ).then(async (response) => {
        if (!response.ok) {
          toast({
            description: t("common:entity_added_successfully", {
              entity:
                type === "desktop"
                  ? t("common:banner")
                  : t("common:mobile-banner")
            }),
            duration: 2000,
            variant: "success"
          })
        }

        const uploadResult = await response.json()

        console.log(uploadResult.uuid)

        if (type === "desktop") {
          form.setValue("bannerUuid", uploadResult.uuid)
          setBannerFile(fileToUpload)
          setBannerPreview(URL.createObjectURL(fileToUpload))
        } else {
          form.setValue("mobileBannerUuid", uploadResult.uuid)
          setMobileBannerFile(fileToUpload)
          setMobileBannerPreview(URL.createObjectURL(fileToUpload))
        }
      })
    }
  }

  function onSubmit(data: CreateBrandType) {
    const { name_fa, name_en, logoFileUuid } = data

    if (brand) {
      updateBrandMutation.mutate({
        updateBrandInput: {
          id: brand.id,
          name_fa,
          name_en,
          logoFileUuid
        }
      })
    } else {
      createBrandMutation.mutate({
        createBrandInput: {
          name_fa,
          name_en,
          logoFileUuid
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
            {name_fa
              ? name_fa
              : t("common:new_entity", { entity: t("common:producer") })}
          </h2>
          <Button
            className="sticky top-0"
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {t("common:save_entity", { entity: t("common:producer") })}
          </Button>
        </div>
        <div className="flex flex-col gap-8">
          <Card template="1/2" title={t("common:title")}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="name_fa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:name_fa")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:name_en")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-8">
            {brand && (
              <Card template="1/2" title={t("common:logo")}>
                <div className="flex items-end gap-6">
                  <Input
                    type="file"
                    onChange={(e) => onLogoFileChange(e)}
                    className="hidden"
                    accept="image/*"
                    ref={logoFileFieldRef}
                  />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                    {logoPreview || brand?.logoFile ? (
                      <Image
                        src={
                          logoPreview ||
                          (brand?.logoFile?.presignedUrl.url as string)
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
                        logoFileFieldRef.current?.click()
                      }}
                    >
                      {logoFile
                        ? logoFile.name
                        : t("common:choose_entity_file", {
                            entity: t("common:logo")
                          })}
                    </Button>
                    {logoPreview && (
                      <Button
                        variant="danger"
                        iconOnly
                        onClick={() => {
                          form.setValue("logoFileUuid", "")
                          setLogoFile(null)
                          setLogoPreview("")
                        }}
                      >
                        <LucideTrash className="icon" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
            {/* catalog ----------------------> */}
            {brand && (
              <Card template="1/2" title={t("common:catalog")}>
                <div className="flex items-end gap-6">
                  <Input
                    type="file"
                    onChange={(e) => onCatalogFileChange(e)}
                    className="hidden"
                    accept="image/*"
                    ref={CatalogFileRef}
                  />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                    {catalogPreview || brand?.catalog ? (
                      <Image
                        src={
                          catalogPreview ||
                          (brand?.catalog?.presignedUrl.url as string)
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
                        CatalogFileRef.current?.click()
                      }}
                    >
                      {catalogFile
                        ? catalogFile.name
                        : t("common:choose_entity_file", {
                            entity: t("common:catalog")
                          })}
                    </Button>
                    {catalogPreview && (
                      <Button
                        variant="danger"
                        iconOnly
                        onClick={() => {
                          form.setValue("catalogFileUuid", "")
                          setCatalogFile(null)
                          setCatalogPreview("")
                        }}
                      >
                        <LucideTrash className="icon" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
            {/* priceList ----------------------> */}
            {brand && (
              <Card template="1/2" title={t("common:price_list")}>
                <div className="flex items-end gap-6">
                  <Input
                    type="file"
                    onChange={(e) => onPriceListfileChange(e)}
                    className="hidden"
                    accept="image/*"
                    ref={priceListFileRef}
                  />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                    {priceListPreview || brand?.priceList ? (
                      <Image
                        src={
                          priceListPreview ||
                          (brand?.priceList?.presignedUrl.url as string)
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
                        priceListFileRef.current?.click()
                      }}
                    >
                      {priceListFile
                        ? priceListFile.name
                        : t("common:choose_entity_file", {
                            entity: t("common:price_list")
                          })}
                    </Button>
                    {priceListPreview && (
                      <Button
                        variant="danger"
                        iconOnly
                        onClick={() => {
                          form.setValue("priceListUuid", "")
                          setPriceListFile(null)
                          setPriceListPreview("")
                        }}
                      >
                        <LucideTrash className="icon" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
            {/* banner ----------------------> */}
            {brand && (
              <Card template="1/2" title={t("common:banner")}>
                <div className="flex items-end gap-6">
                  <Input
                    type="file"
                    onChange={(e) => onBannerfileChange("desktop", e)}
                    className="hidden"
                    accept="image/*"
                    ref={bannerFileRef}
                  />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                    {bannerPreview || brand?.bannerDesktop ? (
                      <Image
                        src={
                          bannerPreview ||
                          (brand?.bannerDesktop?.presignedUrl.url as string)
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
                        bannerFileRef.current?.click()
                      }}
                    >
                      {bannerFile
                        ? bannerFile.name
                        : t("common:choose_entity_file", {
                            entity: t("common:banner")
                          })}
                    </Button>
                    {bannerPreview && (
                      <Button
                        variant="danger"
                        iconOnly
                        onClick={() => {
                          form.setValue("bannerUuid", "")
                          setBannerFile(null)
                          setBannerPreview("")
                        }}
                      >
                        <LucideTrash className="icon" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
            {/* Mobile Banner ----------------------> */}
            {brand && (
              <Card template="1/2" title={t("common:mobile-banner")}>
                <div className="flex items-end gap-6">
                  <Input
                    type="file"
                    onChange={(e) => onBannerfileChange("mobile", e)}
                    className="hidden"
                    accept="image/*"
                    ref={mobileBannerFileRef}
                  />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                    {mobileBannerPreview || brand?.bannerMobile ? (
                      <Image
                        src={
                          mobileBannerPreview ||
                          (brand?.bannerMobile?.presignedUrl.url as string)
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
                        mobileBannerFileRef.current?.click()
                      }}
                    >
                      {mobileBannerFile
                        ? mobileBannerFile.name
                        : t("common:choose_entity_file", {
                            entity: t("common:mobile-banner")
                          })}
                    </Button>
                    {mobileBannerPreview && (
                      <Button
                        variant="danger"
                        iconOnly
                        onClick={() => {
                          form.setValue("mobileBannerUuid", "")
                          setMobileBannerFile(null)
                          setMobileBannerPreview("")
                        }}
                      >
                        <LucideTrash className="icon" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
          <Card template="1/2" title={t("common:about")}>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:about")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
        </div>
      </form>
    </Form>
  )
}

export default BrandForm
