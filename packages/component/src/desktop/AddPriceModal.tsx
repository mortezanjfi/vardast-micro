import { Dispatch, SetStateAction, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
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
import zodI18nMap from "@vardast/util/zodErrorMap"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type AddPriceModalProps = {
  productId?: number
  submitFunction: (data: any) => void
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
const CreatePriceSchema = z.object({ price: z.coerce.number() })
type CreatePriceType = TypeOf<typeof CreatePriceSchema>
const AddPriceModal = ({
  productId,
  open,
  setOpen,
  submitFunction
}: AddPriceModalProps) => {
  const { t } = useTranslation()

  const form = useForm<CreatePriceType>({
    resolver: zodResolver(CreatePriceSchema)
  })
  z.setErrorMap(zodI18nMap)

  useEffect(() => {
    form.reset()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-7">
        <Form {...form}>
          <form
            className="flex flex-col gap-7"
            onSubmit={form.handleSubmit(submitFunction)}
          >
            <DialogHeader className="border-b pb">
              قیمت واحد (تومان)
            </DialogHeader>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:price")}</FormLabel>
                  <FormControl>
                    <Input placeholder="وارد کنید" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="border-t pt">
              <Button type="submit">{t("common:confirm")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPriceModal
