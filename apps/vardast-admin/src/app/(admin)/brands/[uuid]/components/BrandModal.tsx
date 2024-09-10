"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { BrandModalEnum } from "@vardast/component/type"
import {
  Brand,
  CreateBrandInput,
  CreateBrandInputSchema,
  useCreateBrandMutation,
  useUpdateBrandMutation
} from "@vardast/graphql/generated"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { LucideTrash, LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

type BrandModalType = CreateBrandInput & {
  id?: number
  brand?: Brand
}

z.setErrorMap(zodI18nMap)

const BrandModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<BrandModalEnum, BrandModalType>) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()
  //logo
  const logoFileFieldRef = useRef<HTMLInputElement>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  const token = session?.accessToken || null

  const isEdit = modals?.data?.id

  const createBrandSchema = CreateBrandInputSchema()

  const form = useForm<CreateBrandInput>({
    resolver: zodResolver(createBrandSchema)
  })

  const createBrandMutation = useCreateBrandMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createBrand?.id) {
          router.push(`/brands/${data.createBrand.id}`)
        }
      }
    }
  )
  const updateBrandMutation = useUpdateBrandMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateBrand?.id) {
          onCloseModals(data)
        }
      }
    }
  )

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
        const uploadResult = await response.json()
        form.setValue("logoFileUuid", uploadResult.uuid)

        setLogoFile(fileToUpload)
        setLogoPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  const onSubmit = (data: BrandModalType) => {
    const body = {
      ...data
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateBrandMutation.mutate({
        updateBrandInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createBrandMutation.mutate({
        createBrandInput: body
      })
    }
  }

  useEffect(() => {
    if (isEdit) {
      const cloneData = { ...modals?.data }
      delete cloneData.brand
      setMultiFormValues(cloneData, form.setValue)
    }
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals?.data])

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: isEdit
      ? t("common:edit_entity", { entity: t("common:brand") })
      : t("common:new_entity", { entity: t("common:brand") }),
    action: {
      title: t("common:save"),
      loading: createBrandMutation.isLoading || updateBrandMutation.isLoading,
      disabled: createBrandMutation.isLoading || updateBrandMutation.isLoading
    },
    form: {
      formProps: form,
      onSubmit: form.handleSubmit(onSubmit)
    }
  }

  return (
    <Modal {...modalProps}>
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
      <FormField
        control={form.control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:rating")}</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="col-span-full flex items-end gap-6">
        <Input
          accept="image/*"
          className="hidden"
          ref={logoFileFieldRef}
          type="file"
          onChange={(e) => onLogoFileChange(e)}
        />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
          {logoPreview || modals?.data?.brand?.logoFile ? (
            <Image
              alt="..."
              className="object-contain p-3"
              fill
              src={
                logoPreview || modals?.data?.brand?.logoFile?.presignedUrl.url
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
              iconOnly
              variant="danger"
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
    </Modal>
  )
}

export default BrandModal
