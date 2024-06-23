"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useFindOfferPreOrderByIdQuery,
  usePaymentMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type VerifyOfferProps = {
  isMobileView: boolean
  uuid: string
  offerId: string
}

function VerifyOffer({ isMobileView, uuid, offerId }: VerifyOfferProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const findPreOrderByIdQuery = useFindOfferPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +offerId
    }
  )

  z.setErrorMap(zodI18nMap)
  const VerifyOfferFormSchema = z.object({
    verify: z.boolean().optional().default(false)
  })
  type VerifyOfferForm = TypeOf<typeof VerifyOfferFormSchema>

  const updateUserMutation = usePaymentMutation(graphqlRequestClientWithToken, {
    onError: (errors: ClientError) => {
      console.log(errors)
    },
    onSuccess: (data) => {
      toast({
        description: t("common:entity_updated_successfully", {
          entity: t("common:user")
        }),
        duration: 2000,
        variant: "success"
      })
      window.location.href = data?.payment?.callbackUrl
    }
  })

  const form = useForm<VerifyOfferForm>({
    resolver: zodResolver(VerifyOfferFormSchema)
  })

  function onSubmit() {
    updateUserMutation.mutate({
      offerId: +offerId
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div>
          پرداخت {findPreOrderByIdQuery.data?.findOfferPreOrderById?.status}با
          موفقیت انجام شد
        </div>
        <FormField
          control={form.control}
          name="verify"
          render={({ field }) => (
            <FormItem className="checkbox-field">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t("common:payment_has_been_done")}</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          loading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting || !form.watch("verify")}
        >
          پرداخت
        </Button>
      </form>
    </Form>
  )
}

export default VerifyOffer
