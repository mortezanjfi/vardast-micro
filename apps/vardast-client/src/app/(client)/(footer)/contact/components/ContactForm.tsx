"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapIcon, PhoneIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Dropzone from "@vardast/component/Dropzone"
import Link from "@vardast/component/Link"
import { useCreateContactUsMutation } from "@vardast/graphql/generated"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@vardast/ui/select"
import { Textarea } from "@vardast/ui/textarea"
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import {
  cellphoneNumberSchema,
  persianInputSchema
} from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

// eslint-disable-next-line no-unused-vars
enum TopicEnum {
  // eslint-disable-next-line no-unused-vars
  BUG = "BUG",
  // eslint-disable-next-line no-unused-vars
  SALE = "SALE"
}

const formSchema = z.object({
  topic: z.string(),
  username: persianInputSchema,
  // email: persianInputSchema,
  cellphone: cellphoneNumberSchema,
  // orderId: persianInputSchema,
  message: persianInputSchema,
  fileUuid: z.string().optional()
})

const topicEnum = enumToKeyValueObject(TopicEnum)

type FormType = TypeOf<typeof formSchema>

const ContactForm = ({ isMobileView }: { isMobileView: boolean }) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const router = useRouter()
  const { toast } = useToast()
  const [fileUuid, setFileUuid] = useState<string>()
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema)
  })
  const createContactUsMutation = useCreateContactUsMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:ticket")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/")
      }
    }
  )
  function onSubmitStepOne(data: FormType) {
    // console.log("submit", data)
    createContactUsMutation.mutate({
      createContactInput: {
        cellphone: form.getValues("cellphone"),
        fullname: form.getValues("username"),
        text: form.getValues("message"),
        title: form.getValues("topic"),
        fileuuid: fileUuid
      }
    })
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
      <form
        onSubmit={form.handleSubmit(onSubmitStepOne)}
        noValidate
        className="flex flex-col gap-6 px pt md:grid md:grid-cols-2 md:px-0 md:pt-0"
      >
        {isMobileView && (
          <>
            <div className="h-[30vw] w-full overflow-hidden rounded-xl">
              <iframe
                // src="https://maps.google.com/maps?q=30.273250595532225,57.019030094151475&t=&z=13&ie=UTF8&iwloc=&output=embed"
                src="https://maps.google.com/maps?q=35.7808002,51.448611&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: "inline-block" }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            </div>
            <div className="flex flex-col gap-y border-b pb-6">
              <div className="flex items-center gap-x-7">
                <div className="flex items-center justify-center rounded-md bg-alpha-50 p">
                  <MapIcon className="h-4 w-4 text-primary" />
                </div>{" "}
                <p className="text-md">
                  {digitsEnToFa("بلوار کاوه، پلاک 12.1، طبقه 2، واحد 4")}
                </p>
              </div>
              <div className="flex items-center gap-x-7">
                <div className="flex items-center justify-center rounded-md bg-alpha-50 p">
                  <PhoneIcon className="h-4 w-4 text-primary" />
                </div>{" "}
                <Link
                  href="tel:+982187132501"
                  className="text-md text-info underline"
                >
                  {`${digitsEnToFa("5")} - ${digitsEnToFa(
                    "87132500"
                  )} - ${digitsEnToFa("021")}`}
                </Link>
              </div>
            </div>
          </>
        )}
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:topic")}</FormLabel>
              <Select
                onValueChange={(value) => {
                  form.setValue("topic", value as TopicEnum)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("common:select_placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(topicEnum).map((type) => (
                    <SelectItem value={topicEnum[type]} key={type}>
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام و نام خانوادگی</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:email")}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="cellphone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:cellphone")}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:orderId")}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>{t("common:message")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2">
          <Dropzone
            withHeight={false}
            existingImages={undefined}
            uploadPath={uploadPaths.brandCatalog}
            onAddition={(file) => {
              console.log(file)
              setFileUuid(file.uuid)
            }}
            onDelete={() => setFileUuid("")}
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
        </div>
        <div className="md:col-span-2 md:mr-auto">
          <Button type="submit" block={isMobileView}>
            ثبت و ارسال
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ContactForm
