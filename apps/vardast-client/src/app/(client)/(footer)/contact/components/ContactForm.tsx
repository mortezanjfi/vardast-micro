"use client"

import { MapIcon, PhoneIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Dropzone, { FilesWithPreview } from "@vardast/component/Dropzone"
import Link from "@vardast/component/Link"
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
import { persianInputSchema } from "@vardast/util/zodValidationSchemas"
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
  topic: persianInputSchema,
  username: persianInputSchema,
  // email: persianInputSchema,
  cellphone: persianInputSchema,
  // orderId: persianInputSchema,
  message: persianInputSchema
})

const topicEnum = enumToKeyValueObject(TopicEnum)

type FormType = TypeOf<typeof formSchema>

const ContactForm = ({ isMobileView }: { isMobileView: boolean }) => {
  const { t } = useTranslation()

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema)
  })

  function onSubmitStepOne(_: FormType) {
    // console.log("submit", data)
  }

  return (
    <Form {...form}>
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
            uploadPath={""}
            onAddition={function (_: FilesWithPreview): void {
              throw new Error("Function not implemented.")
            }}
            onDelete={function (_: FilesWithPreview): void {
              throw new Error("Function not implemented.")
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
