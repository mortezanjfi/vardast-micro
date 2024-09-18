"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@vardast/component/Card"
import { Brand } from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import { Button } from "@vardast/ui/button"
import { Input } from "@vardast/ui/input"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { LucideTrash, LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type OldBrandFormProps = {
  brand?: Brand
}

const OldBrandForm = ({ brand }: OldBrandFormProps) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const { toast } = useToast()
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

  const token = session?.accessToken || null

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

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-8">
        {/* catalog ----------------------> */}
        {brand && (
          <Card template="1/2" title={t("common:catalog")}>
            <div className="flex items-end gap-6">
              <Input
                accept="image/*"
                className="hidden"
                ref={CatalogFileRef}
                type="file"
                onChange={(e) => onCatalogFileChange(e)}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {catalogPreview || brand?.catalog ? (
                  <Image
                    alt="..."
                    className="object-contain p-3"
                    fill
                    src={catalogPreview || brand?.catalog?.presignedUrl.url}
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
                  type="button"
                  variant="secondary"
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
                    iconOnly
                    variant="danger"
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
                accept="image/*"
                className="hidden"
                ref={priceListFileRef}
                type="file"
                onChange={(e) => onPriceListfileChange(e)}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {priceListPreview || brand?.priceList ? (
                  <Image
                    alt="..."
                    className="object-contain p-3"
                    fill
                    src={priceListPreview || brand?.priceList?.presignedUrl.url}
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
                  type="button"
                  variant="secondary"
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
                    iconOnly
                    variant="danger"
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
                accept="image/*"
                className="hidden"
                ref={bannerFileRef}
                type="file"
                onChange={(e) => onBannerfileChange("desktop", e)}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {bannerPreview || brand?.bannerDesktop ? (
                  <Image
                    alt="..."
                    className="object-contain p-3"
                    fill
                    src={
                      bannerPreview || brand?.bannerDesktop?.presignedUrl.url
                    }
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
                  type="button"
                  variant="secondary"
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
                    iconOnly
                    variant="danger"
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
                accept="image/*"
                className="hidden"
                ref={mobileBannerFileRef}
                type="file"
                onChange={(e) => onBannerfileChange("mobile", e)}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {mobileBannerPreview || brand?.bannerMobile ? (
                  <Image
                    alt="..."
                    className="object-contain p-3"
                    fill
                    src={
                      mobileBannerPreview ||
                      brand?.bannerMobile?.presignedUrl.url
                    }
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
                  type="button"
                  variant="secondary"
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
                    iconOnly
                    variant="danger"
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
    </div>
  )
}

export default OldBrandForm
