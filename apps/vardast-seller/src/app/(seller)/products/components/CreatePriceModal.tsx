"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebouncedState } from "@mantine/hooks"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import {
  Product,
  useCalculatePriceQuery,
  useCreatePriceMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
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
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type CreatePriceModalProps = {
  product: Product
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}
const CreatePriceSchema = z.object({
  amount: z.number(),
  discount: z.number().optional()
})
const CreatePriceModal = ({
  open,
  onOpenChange,
  product
}: CreatePriceModalProps) => {
  const form = useForm<CreatePrice>({
    resolver: zodResolver(CreatePriceSchema)
  })

  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const [discountTemp, setDiscountTemp] = useDebouncedState<number>(0, 200)
  const [tempAmount, setTempAmount] = useState<string>(
    (product?.myPrice?.amount?.toString() as string) || ""
  )

  const queryClient = useQueryClient()

  const createPriceMutation = useCreatePriceMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        form.reset()
        queryClient.invalidateQueries({
          queryKey: [QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER]
        })
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:price")
          }),
          duration: 2000,
          variant: "success"
        })
        onOpenChange(false)
      }
    }
  )

  const amountAfterDiscount = useCalculatePriceQuery(
    graphqlRequestClientWithToken,
    {
      amount: form.getValues("amount")?.toString() || (tempAmount as string),
      valueDiscount: discountTemp.toString()
    },
    { queryKey: [{ valueDiscount: discountTemp.toString() }] }
  )

  type CreatePrice = TypeOf<typeof CreatePriceSchema>

  const onClose = () => {
    form.reset()
    onOpenChange(false)
  }

  function onSubmit(data: CreatePrice) {
    const { amount } = data

    createPriceMutation.mutate({
      createPriceInput: {
        amount,
        productId: product.id,
        valueDiscount: discountTemp.toString() as string
      }
    })
  }

  // function onSubmit() {
  //   console.log(form.getValues("amount"))

  //   createPriceMutation.mutate({
  //     createPriceInput: {
  //       productId: product.id,
  //       amount: Number(amountAfterDiscount.data?.calculatePrice)
  //     }
  //   })
  // }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("common:pricing")}</DialogTitle>
        </DialogHeader>
        {errors && (
          <Alert variant="danger">
            <LucideAlertOctagon />
            <AlertTitle>خطا</AlertTitle>
            <AlertDescription>
              {(
                errors?.response?.errors?.at(0)?.extensions
                  ?.displayErrors as string[]
              )?.map((error) => <p key={error}>{error}</p>)}
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6 py-8">
              <FormField
                control={form.control}
                defaultValue={
                  product?.myPrice?.amount || ("" as unknown as number)
                }
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:initial_price")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) => {
                          field.onChange(+event.target.value)
                          setTempAmount(event.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:discount_percent")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثلا ۱۰"
                        type="number"
                        {...field}
                        onChange={(event) => {
                          setDiscountTemp(+event.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center gap-7 border border-blue-200 bg-blue-50 py-7 text-blue-600">
                <span>{t("common:final_amount")}:</span>
                <span className="font-semibold">
                  {digitsEnToFa(
                    addCommas(
                      amountAfterDiscount?.data?.calculatePrice || tempAmount
                    )
                  )}
                  &nbsp; {t("common:toman")}
                </span>
              </div>
            </div>
            <DialogFooter>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  block
                  type="button"
                  disabled={createPriceMutation.isLoading}
                  onClick={() => onClose()}
                >
                  {t("common:cancel")}
                </Button>
                <Button
                  type="submit"
                  block
                  loading={createPriceMutation.isLoading}
                  disabled={createPriceMutation.isLoading}
                >
                  {t("common:submit")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePriceModal
