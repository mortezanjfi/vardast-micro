"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@vardast/component/Card"
import Dropzone from "@vardast/component/Dropzone"
import Link from "@vardast/component/Link"
import { useBecomeASellerMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
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
import { ClientError } from "graphql-request"
import { LucideAlertOctagon, LucideTrash, LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

const ProfileSellerForm = ({ isMobileView }: { isMobileView: boolean }) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const logoFileFieldRef = useRef<HTMLInputElement>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const router = useRouter()
  const token = session?.accessToken || null

  const becomeASellerMutation = useBecomeASellerMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        ;(
          errors.response.errors?.at(0)?.extensions.displayErrors as string[]
        ).map((error) =>
          toast({
            description: error,
            duration: 5000,
            variant: "danger"
          })
        )
      },
      onSuccess: () => {
        form.reset()
        toast({
          title: "درخواست شما با موفقیت ثبت شد",
          description: "تیم پشتیبانی وردست به زودی با شما تماس خواهند گرفت.",
          duration: 8000,
          variant: "success"
        })
        router.refresh()
        router.replace("/")
      }
    }
  )

  const BecomeASellerSchema = z.object({
    name: z.string(),
    bio: z.string().optional(),
    logoFileUuid: z.string().optional()
  })
  type BecomeASeller = TypeOf<typeof BecomeASellerSchema>

  const form = useForm<BecomeASeller>({
    resolver: zodResolver(BecomeASellerSchema),
    defaultValues: {}
  })

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
        const uploadResult = await response.json()
        form.setValue("logoFileUuid", uploadResult.uuid)

        setLogoFile(fileToUpload)
        setLogoPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  function onSubmit(data: BecomeASeller) {
    const { name, bio, logoFileUuid } = data
    console.log(data)
    becomeASellerMutation.mutate({
      becomeASellerInput: {
        name,
        bio,
        logoFileUuid
      }
    })
  }

  return (
    <>
      {isMobileView ? (
        <Form {...form}>
          <form
            className="flex flex-1 flex-col gap-8"
            id="seller-form"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {" "}
            <Alert variant="warning">
              <LucideAlertOctagon className="h-6 w-6" />
              <AlertTitle>{t("common:notice")}</AlertTitle>
              <AlertDescription>
                شما در حال ثبت درخواست برای تبدیل کردن حساب کاربری خود به
                فروشنده هستید. این درخواست پس از بررسی توسط کارشناسان وردست
                اعمال خواهد شد.
              </AlertDescription>
            </Alert>
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
            <Input
              accept="image/*"
              className="hidden"
              ref={logoFileFieldRef}
              type="file"
              onChange={(e) => onLogoFileChange(e)}
            />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
              {logoPreview ? (
                <Image
                  alt="..."
                  className="object-contain p-3"
                  fill
                  src={logoPreview}
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
                {logoFile ? logoFile.name : "انتخاب فایل لوگو"}
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
          </form>
          <Link
            className="btn btn-secondary btn-md"
            href={"/profile?t=حساب کاربری"}
            type="button"
          >
            {t("common:back")}
          </Link>
          <Button
            disabled={form.formState.isSubmitting}
            form="seller-form"
            loading={form.formState.isSubmitting}
            type="submit"
          >
            {t("common:submit")}
          </Button>
        </Form>
      ) : (
        <Form {...form}>
          <Card className="mx-auto w-5/12">
            <form
              className="flex flex-1 flex-col gap-8"
              id="seller-form"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {" "}
              <Alert variant="warning">
                <LucideAlertOctagon className="h-6 w-6" />
                <AlertTitle>{t("common:notice")}</AlertTitle>
                <AlertDescription>
                  شما در حال ثبت درخواست برای تبدیل کردن حساب کاربری خود به
                  فروشنده هستید. این درخواست پس از بررسی توسط کارشناسان وردست
                  اعمال خواهد شد.
                </AlertDescription>
              </Alert>
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
              <Dropzone
                existingImages={undefined}
                maxFiles={1}
                uploadPath={uploadPaths.sellerLogo}
                withHeight={false}
                onAddition={(file) => {
                  form.setValue("logoFileUuid", file.uuid)
                }}
                onDelete={() => {
                  form.setValue("logoFileUuid", "")
                }}
                // existingImages={product && product.images}
                // uploadPath={uploadPaths.productImages}
                // onAddition={(file) => {
                //   setImages((prevImages) => [
                //     ...prevImages,
                //     {
                //       uuid: file.uuid as string,
                //       expiresAt: file.expiresAt as string
                //     }
                //   ])
                // }}
                // onDelete={(file) => {
                //   setImages((images) =>
                //     images.filter((image) => image.uuid !== file.uuid)
                //   )
                // }}
              />
              {/* <Input
                  type="file"
                  onChange={(e) => onLogoFileChange(e)}
                  className="hidden"
                  accept="image/*"
                  ref={logoFileFieldRef}
                /> */}
              {/* <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
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
              {/* <div className="flex items-center gap-2">
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
                </div> */}
            </form>
            <div className="mt-7 flex flex-col gap-2">
              <Link
                className="btn btn-secondary btn-md"
                href={"/profile?t=حساب کاربری"}
                type="button"
              >
                {t("common:back")}
              </Link>
              <Button
                disabled={form.formState.isSubmitting}
                form="seller-form"
                loading={form.formState.isSubmitting}
                type="submit"
              >
                {t("common:submit")}
              </Button>
            </div>
          </Card>
        </Form>
      )}
    </>
  )
}

export default ProfileSellerForm
