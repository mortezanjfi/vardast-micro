import { Dispatch, SetStateAction, useEffect } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import {
  useCalculatePriceOfferLineMutation,
  useCreateOrderOfferLineMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
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
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type AddPriceModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  lineId: number
  offerId?: string
  fi_price?: string
}

const AddPriceModal = ({
  open,
  setOpen,
  fi_price,
  offerId: propsOfferId,
  lineId
}: AddPriceModalProps) => {
  const { t } = useTranslation()
  const params = useParams()
  const offerId = propsOfferId ?? params.offerId
  const queryClient = useQueryClient()

  const FormSchema = z.object({
    fi_price: z.string()
  })

  type FormSchemaType = TypeOf<typeof FormSchema>

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fi_price: fi_price ?? ""
    }
  })

  const createOrderOfferLineMutation = useCreateOrderOfferLineMutation(
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
        queryClient.invalidateQueries({
          queryKey: ["FindPreOrderById"]
        })
        setOpen(false)
        toast({
          title: "قیمت کالا با موفقیت به روزرسانی شد",
          duration: 5000,
          variant: "success"
        })
      }
    }
  )

  const calculatePriceOfferLineMutation = useCalculatePriceOfferLineMutation(
    graphqlRequestClientWithToken
  )

  const onSubmit = (data: FormSchemaType) => {
    calculatePriceOfferLineMutation.mutate({
      fi_price: data.fi_price,
      lineId: +lineId
    })
  }

  const onConfirmModal = () => {
    const { fi_price, tax_price, total_price } =
      calculatePriceOfferLineMutation.data?.calculatePriceOfferLine
    createOrderOfferLineMutation.mutate({
      createLineOfferInput: {
        offerOrderId: +offerId,
        lineId: +lineId,
        fi_price,
        tax_price,
        total_price
      }
    })
  }

  useEffect(() => {
    if (open && fi_price) {
      onSubmit({ fi_price })
    }
  }, [open, fi_price])

  useEffect(() => {
    const clearObject = Object.fromEntries(
      Object.keys(form.getValues()).map((key) => [key, ""])
    )
    form.reset(clearObject)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-7">
        <Form {...form}>
          <DialogHeader className="border-b pb">
            وارد کردن قیمت پیشنهادی
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex w-full flex-col gap-5"
          >
            <FormField
              control={form.control}
              name={"fi_price"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`common:fi_price`)}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        calculatePriceOfferLineMutation.isLoading ||
                        createOrderOfferLineMutation.isLoading
                      }
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col justify-center gap-5 rounded-lg border border-blue-300 bg-blue-50 px-5 py-7">
              <div className="flex gap">
                <h4>{t(`common:tax_price`)}:</h4>
                <p className="font-semibold">
                  {!calculatePriceOfferLineMutation.isLoading &&
                    calculatePriceOfferLineMutation.data
                      ?.calculatePriceOfferLine.tax_price &&
                    digitsEnToFa(
                      calculatePriceOfferLineMutation.data
                        ?.calculatePriceOfferLine.tax_price
                    )}
                  {` (${t(`common:toman`)})`}
                </p>
              </div>
              <div className="flex gap">
                <h4>{t(`common:total_price`)}:</h4>
                <p className="font-semibold">
                  {!calculatePriceOfferLineMutation.isLoading &&
                    calculatePriceOfferLineMutation.data
                      ?.calculatePriceOfferLine.total_price &&
                    digitsEnToFa(
                      calculatePriceOfferLineMutation.data
                        ?.calculatePriceOfferLine.total_price
                    )}
                  {` (${t(`common:toman`)})`}
                </p>
              </div>
            </div>
            <DialogFooter className="flex gap border-t pt-5">
              <Button
                disabled={
                  calculatePriceOfferLineMutation.isLoading ||
                  createOrderOfferLineMutation.isLoading
                }
                loading={calculatePriceOfferLineMutation.isLoading}
                type="submit"
                variant="full-secondary"
              >
                {t("common:calculate", { entity: t("common:price") })}
              </Button>
              <Button
                onClick={onConfirmModal}
                disabled={
                  !calculatePriceOfferLineMutation.data ||
                  calculatePriceOfferLineMutation.isLoading ||
                  createOrderOfferLineMutation.isLoading
                }
                loading={createOrderOfferLineMutation.isLoading}
                type="button"
              >
                {t("common:confirm", { entity: t("common:price") })}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPriceModal
