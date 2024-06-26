"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@vardast/component/Card"
import OrderProductsList from "@vardast/component/desktop/OrderProductsList"
import {
  useFindPreOrderByIdQuery,
  usePaymentMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ACTION_BUTTON_TYPE } from "@vardast/type/OrderProductTabs"
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
  const { t } = useTranslation()
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
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
    <div className="flex flex-col gap-9">
      <OrderProductsList
        actionButtonType={ACTION_BUTTON_TYPE.ADD_PRODUCT_OFFER}
        isMobileView={isMobileView}
        offerId={offerId}
        findPreOrderByIdQuery={findPreOrderByIdQuery}
      />
      <Card>
        <Form {...form}>
          <form
            className="flex justify-between"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
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
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting || !form.watch("verify")}
            >
              تایید قیمت
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default VerifyOffer
