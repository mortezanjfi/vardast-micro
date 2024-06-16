import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateLegalMutation } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
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
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }

export type CreateLegalUserInfoType = TypeOf<typeof CreateLegalUserSchema>

const CreateLegalUserSchema = z.object({
  name_company: z.string(),
  national_id: z.string()
})

const AddLegalUserModal = ({ open, setOpen }: Props) => {
  const { t } = useTranslation()

  const [errors, setErrors] = useState<ClientError>()
  const router = useRouter()

  const form = useForm<CreateLegalUserInfoType>({
    resolver: zodResolver(CreateLegalUserSchema)
  })

  const createLegalMutation = useCreateLegalMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: (data) => {
        if (data.createLegal.id) {
          router.push(`/users/legal/${data.createLegal.id}/address`)
        }
      }
    }
  )

  const onCreateLegal = (data: CreateLegalUserInfoType) => {
    createLegalMutation.mutate({
      createLegalInput: {
        national_id: data.national_id as string,
        name_company: data.name_company as string
      }
    })
  }
  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex h-full w-full flex-col gap-7">
          <DialogHeader className="h-fit border-b pb-9 pt-4 md:pb md:pt-0">
            <DialogTitle>
              {t("common:add_new_entity", { entity: t("common:user") })}
            </DialogTitle>
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
            <form
              className="flex flex-col"
              onSubmit={form.handleSubmit(onCreateLegal)}
            >
              <div className="grid w-full grid-cols-2 gap-7 ">
                <FormField
                  control={form.control}
                  name="name_company"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>
                        {t("common:entity_name", {
                          entity: t("common:company")
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t("common:enter")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="national_id"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>
                        {t("common:entity_uuid", {
                          entity: t("common:national")
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t("common:enter")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" mt-7 flex w-full flex-row-reverse gap border-t pt-6 ">
                <Button type="submit" variant="primary">
                  تایید و ادامه
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default AddLegalUserModal
