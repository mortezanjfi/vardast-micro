"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useBecomeASellerMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientAdmin from "@vardast/query/queryClients/graphqlRequestClientWhitToken"
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
import { Textarea } from "@vardast/ui/textarea"
import { ClientError } from "graphql-request"
import {
  LucideAlertOctagon,
  LucideInfo,
  LucideTrash,
  LucideWarehouse
} from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

const BecomeSellerAlert = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [open, setOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<ClientError>()
  const logoFileFieldRef = useRef<HTMLInputElement>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  const token = session?.accessToken || null

  const becomeASellerMutation = useBecomeASellerMutation(
    graphqlRequestClientAdmin,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        form.reset()
        toast({
          description: "درخواست شما با موفقیت ثبت شد",
          duration: 2000,
          variant: "success"
        })
        setOpen(false)
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
        if (!response.ok) {
        }

        const uploadResult = await response.json()
        form.setValue("logoFileUuid", uploadResult.uuid)

        setLogoFile(fileToUpload)
        setLogoPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  function onSubmit(data: BecomeASeller) {
    const { name, bio, logoFileUuid } = data

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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>درخواست تبدیل حساب کاربری به فروشنده</DialogTitle>
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
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <Alert variant="warning">
                <LucideAlertOctagon className="h-6 w-6" />
                <AlertTitle>{t("common:notice")}</AlertTitle>
                <AlertDescription>
                  شما در حال ثبت درخواست برای تبدیل کردن حساب کاربری خود به
                  فروشنده هستید. این درخواست پس از بررسی توسط کارشناسان وردست
                  اعمال خواهد شد.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-6 py-8">
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
                <div className="flex items-end gap-6">
                  <Input
                    type="file"
                    onChange={(e) => onLogoFileChange(e)}
                    className="hidden"
                    accept="image/*"
                    ref={logoFileFieldRef}
                  />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
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
              </div>
              <DialogFooter>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    type="button"
                    disabled={form.formState.isSubmitting}
                    onClick={() => setOpen(false)}
                  >
                    {t("common:cancel")}
                  </Button>
                  <Button
                    type="submit"
                    loading={form.formState.isSubmitting}
                    disabled={form.formState.isSubmitting}
                  >
                    {t("common:submit")}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Alert variant="info">
        <LucideInfo />
        <AlertTitle>اطلاعیه</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col items-start gap-2">
            <p>
              در صورتی که قصد ارائه کالاهای خود در وردست را دارید می‌توانید
              درخواست تبدیل حساب کاربری خود به فروشنده را از این طریق اعلام کنید
            </p>
            <Button size="small" type="button" onClick={() => setOpen(true)}>
              درخواست تبدیل حساب کاربری به فروشنده
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </>
  )
}

export default BecomeSellerAlert
