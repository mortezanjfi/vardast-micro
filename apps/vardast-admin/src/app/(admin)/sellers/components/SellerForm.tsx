"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import {
  Seller,
  ThreeStateSupervisionStatuses,
  useCreateSellerMutation,
  useUpdateSellerMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@vardast/ui/avatar"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@vardast/ui/select"
import { Switch } from "@vardast/ui/switch"
import { Textarea } from "@vardast/ui/textarea"
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon, LucideTrash, LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type SellerFormProps = {
  seller?: Seller
}

const SellerForm = ({ seller }: SellerFormProps) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const logoFileFieldRef = useRef<HTMLInputElement>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [errors, setErrors] = useState<ClientError>()

  const token = session?.accessToken || null

  const statuses = enumToKeyValueObject(ThreeStateSupervisionStatuses)

  const createSellerMutation = useCreateSellerMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:seller")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/sellers")
      }
    }
  )
  const updateSellerMutation = useUpdateSellerMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:seller")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/sellers")
      }
    }
  )

  z.setErrorMap(zodI18nMap)
  const CreateSellerSchema = z.object({
    name: z.string(),
    status: z.nativeEnum(ThreeStateSupervisionStatuses),
    isPublic: z.boolean().optional(),
    logoFileUuid: z.string().optional(),
    bio: z.string().optional()
  })
  type CreateSellerType = TypeOf<typeof CreateSellerSchema>

  const form = useForm<CreateSellerType>({
    resolver: zodResolver(CreateSellerSchema),
    defaultValues: {
      name: seller?.name,
      status: seller?.status,
      isPublic: seller?.isPublic || true,
      bio: seller?.bio || "",
      logoFileUuid: seller?.logoFile?.uuid
    }
  })

  const name = form.watch("name")
  const admin =
    seller &&
    seller.representatives &&
    seller.representatives.length > 0 &&
    seller.representatives.at(0)

  const onLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.sellerLogo)
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

  function onSubmit(data: CreateSellerType) {
    const { name, logoFileUuid, status, isPublic, bio } = data

    if (seller?.name) {
      updateSellerMutation.mutate({
        updateSellerInput: {
          id: seller.id,
          name,
          logoFileUuid,
          status,
          isPublic,
          bio
        }
      })
    } else {
      createSellerMutation.mutate({
        createSellerInput: {
          name,
          logoFileUuid,
          status,
          isPublic,
          bio
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
            {name
              ? name
              : t("common:new_entity", { entity: t("common:seller") })}
          </h2>
          <Button
            className="sticky top-0"
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {t("common:save_entity", { entity: t("common:seller") })}
          </Button>
        </div>
        <div className="flex flex-col gap-8">
          <Card template="1/2" title={t("common:information")}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {admin && (
                <div className="col-span-full">
                  <Link
                    href={admin?.user?.uuid ? `/users/${admin.user.uuid}` : ""}
                  >
                    <div className="flex items-center">
                      <Avatar size="medium">
                        {admin?.user?.avatarFile ? (
                          <AvatarImage
                            src={admin.user.avatarFile.presignedUrl.url}
                            alt={admin.user.fullName}
                          />
                        ) : (
                          ""
                        )}
                        <AvatarFallback>
                          {admin?.user?.firstName && admin.user.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ms-2 flex flex-col gap-2">
                        <span className="font-medium text-alpha-800">
                          {admin?.user?.fullName}
                        </span>
                        <span className="text-sm text-alpha-600">
                          {admin?.user?.cellphone}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:status")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue(
                          "status",
                          value as ThreeStateSupervisionStatuses
                        )
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("common:select_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(statuses).map((type) => (
                          <SelectItem value={statuses[type]} key={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormControl>
                        <Switch
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
            </div>
          </Card>

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
                {logoPreview || seller?.logoFile ? (
                  <Image
                    src={
                      logoPreview ||
                      (seller?.logoFile?.presignedUrl.url as string)
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
                  {logoFile ? logoFile.name : "انتخاب فایل لوگو"}
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

          <Card template="1/2" title={t("common:about")}>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:bio")}</FormLabel>
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

export default SellerForm
