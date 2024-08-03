"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@vardast/component/Card"
import { usePaymentMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Checkbox } from "@vardast/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormLayout,
  FormMessage
} from "@vardast/ui/form"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import Orders from "@/app/(layout)/(bid)/orders/components/Orders"

type VerifyOfferProps = {
  uuid: string
  offerId: string
}

function VerifyOffer({ offerId }: VerifyOfferProps) {
  const { t } = useTranslation()

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
    <>
      <Orders />
      <FormLayout
        {...form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between"
      >
        <Card
          actionButton={{
            type: "submit",
            text: t("common:verify", { entity: t("common:price") }),
            loading: form.formState.isSubmitting,
            disabled: form.formState.isSubmitting || !form.watch("verify")
          }}
        >
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
        </Card>
      </FormLayout>
    </>
  )
}

export default VerifyOffer
