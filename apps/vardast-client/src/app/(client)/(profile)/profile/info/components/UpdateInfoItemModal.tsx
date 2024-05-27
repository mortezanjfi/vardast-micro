import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  UpdateProfileInput,
  useUpdateProfileMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
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
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

export type UpdateInfoItemModalProps = {
  title: string
  value: UpdateProfileInput[keyof UpdateProfileInput]
  name: UpdateProfileInput[keyof UpdateProfileInput]
  open: boolean
  setOpen: (_?: any) => void
}

const UpdateInfoItemModal = ({
  value,
  title,
  name,
  open,
  setOpen
}: UpdateInfoItemModalProps) => {
  const { t } = useTranslation()
  const session = useSession()
  const [errors, setErrors] = useState<ClientError>()

  const createUserMutation = useUpdateProfileMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        session?.update()
        toast({
          description: `${title} با موفقیت به‌روزرسانی شد`,
          duration: 2000,
          variant: "success"
        })
        setOpen((prev) => !prev)
      }
    }
  )

  const FormSchema = z.object({
    [name]: z.string()
  })

  type UserEditForm = TypeOf<typeof FormSchema>

  const form = useForm<UserEditForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      [name]: value || ""
    }
  })

  function onSubmit(data: UserEditForm) {
    if (typeof data[name] === "string") {
      const updateProfileInput: UpdateProfileInput = {
        [name]: data[name]
      } as UpdateProfileInput

      createUserMutation.mutate({
        updateProfileInput
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-7">
        <Form {...form}>
          <DialogHeader className="border-b pb">{`${value ? "افزودن" : "ویرایش"} ${title}`}</DialogHeader>
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
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex w-full flex-col gap-1"
          >
            <FormField
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`common:${name}`)}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="border-t pt">
              <Button
                type="submit"
                loading={createUserMutation.isLoading}
                disabled={createUserMutation.isLoading}
              >
                {t("common:confirm")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateInfoItemModal
