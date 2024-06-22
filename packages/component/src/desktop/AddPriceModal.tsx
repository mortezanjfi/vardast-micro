import { Dispatch, SetStateAction, useEffect } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import {
  Line,
  MultiTypeOrder,
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
import { Switch } from "@vardast/ui/switch"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type AddPriceModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  offerId?: string
  fi_price?: string
  line: Line
}

const AddPriceModal = ({
  open,
  setOpen,
  fi_price,
  offerId: propsOfferId,
  line
}: AddPriceModalProps) => {
  const { t } = useTranslation()
  const params = useParams()
  const offerId = propsOfferId ?? params.offerId
  const queryClient = useQueryClient()

  const FormSchema = z.object({
    fi_price: z.string(),
    with_tax: z.boolean()
  })

  type FormSchemaType = TypeOf<typeof FormSchema>

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
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
    graphqlRequestClientWithToken,
    {
      onSuccess: (data) => {
        form.setValue(
          "fi_price",
          data?.calculatePriceOfferLine?.fi_price || "0"
        )
        form.setValue("with_tax", +data?.calculatePriceOfferLine?.tax_price > 0)
      }
    }
  )

  const onSubmit = (data: FormSchemaType) => {
    calculatePriceOfferLineMutation.mutate({
      fi_price: data.fi_price,
      with_tax: data.with_tax || false,
      lineId: +line?.id
    })
  }

  const onConfirmModal = () => {
    const { fi_price, tax_price, total_price } =
      calculatePriceOfferLineMutation.data?.calculatePriceOfferLine
    createOrderOfferLineMutation.mutate({
      createLineOfferInput: {
        offerOrderId: +offerId,
        lineId: +line?.id,
        fi_price:
          line?.type === MultiTypeOrder.Product
            ? total_price
            : form.getValues("fi_price"),
        tax_price: line?.type === MultiTypeOrder.Product ? tax_price : "0",
        total_price:
          line?.type === MultiTypeOrder.Product
            ? total_price
            : form.getValues("fi_price")
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
            {line?.type === MultiTypeOrder.Product && (
              <>
                <FormField
                  control={form.control}
                  name="with_tax"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormControl>
                          <Switch
                            disabled={
                              calculatePriceOfferLineMutation.isLoading ||
                              createOrderOfferLineMutation.isLoading
                            }
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel noStyle>
                          %{digitsEnToFa(10)} {t("common:tax")}
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col justify-center gap-5 rounded-lg border border-blue-300 bg-blue-50 px-5 py-7">
                  {form.watch("with_tax") && (
                    <div className="flex gap">
                      <h4>{t(`common:tax_price`)}:</h4>
                      <p className="font-semibold">
                        {!calculatePriceOfferLineMutation.isLoading &&
                          calculatePriceOfferLineMutation.data
                            ?.calculatePriceOfferLine.tax_price &&
                          digitsEnToFa(
                            addCommas(
                              calculatePriceOfferLineMutation.data
                                ?.calculatePriceOfferLine.tax_price
                            )
                          )}
                        {` (${t(`common:toman`)})`}
                      </p>
                    </div>
                  )}
                  <div className="flex gap">
                    <h4>{t(`common:total_price`)}:</h4>
                    <p className="font-semibold">
                      {!calculatePriceOfferLineMutation.isLoading &&
                        calculatePriceOfferLineMutation.data
                          ?.calculatePriceOfferLine.total_price &&
                        digitsEnToFa(
                          addCommas(
                            calculatePriceOfferLineMutation.data
                              ?.calculatePriceOfferLine.total_price
                          )
                        )}
                      {` (${t(`common:toman`)})`}
                    </p>
                  </div>
                </div>
              </>
            )}
            <DialogFooter className="flex flex-col gap border-t pt-5 md:flex-row">
              {line?.type === MultiTypeOrder.Product && (
                <Button
                  disabled={
                    calculatePriceOfferLineMutation.isLoading ||
                    createOrderOfferLineMutation.isLoading ||
                    +form.watch("fi_price") < 1
                  }
                  loading={calculatePriceOfferLineMutation.isLoading}
                  type="submit"
                  variant="full-secondary"
                >
                  {t("common:calculate", { entity: t("common:price") })}
                </Button>
              )}
              <Button
                onClick={onConfirmModal}
                disabled={
                  line?.type === MultiTypeOrder.Product
                    ? !calculatePriceOfferLineMutation.data ||
                      calculatePriceOfferLineMutation.isLoading ||
                      createOrderOfferLineMutation.isLoading ||
                      !form.watch("fi_price") ||
                      form.watch("fi_price") !==
                        calculatePriceOfferLineMutation?.data
                          ?.calculatePriceOfferLine?.fi_price ||
                      form.watch("with_tax") !==
                        !!+calculatePriceOfferLineMutation?.data
                          ?.calculatePriceOfferLine?.tax_price
                    : false
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
