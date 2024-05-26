"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import PageHeader from "@vardast/component/PageHeader"
import {
  OfferLine,
  OfferOrder,
  OrderOfferStatuses,
  useCreateOrderOfferMutation,
  useFindPreOrderByIdQuery,
  useUpdateOrderOfferMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import OrderProductCard from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductCard"
import CollapsibleOfferCart from "@/app/(client)/(profile)/profile/orders/components/CollapsibleOfferCart"
import VardastDialog from "@/app/(client)/(profile)/profile/orders/components/VardastDialog"
import OfferCard from "@/app/(client)/(profile)/profile/orders/OfferCard"

type OrderOffersProps = { uuid: string; title: string }

const OrderOffers = ({ title, uuid }: OrderOffersProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const createOrderOfferMutation = useCreateOrderOfferMutation(
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
      onSuccess: (data) => {
        if (data?.createOrderOffer?.id) {
          queryClient.invalidateQueries({
            queryKey: ["FindPreOrderById"]
          })
          toast({
            title: "پیشنهاد شما با موفقیت ثبت شد",
            description:
              "لطفا برای قیمت گذاری بقر روی کالاها ادامه فرایند را انجام دهید.",
            duration: 8000,
            variant: "success"
          })
          router.push(
            `/profile/orders/${uuid}/offers/${data.createOrderOffer.id}`
          )
        }
      }
    }
  )

  const updateOrderOfferMutation = useUpdateOrderOfferMutation(
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
      onSuccess: (data) => {
        if (data?.updateOrderOffer?.id) {
          queryClient.invalidateQueries({
            queryKey: ["FindPreOrderById"]
          })
          toast({
            title: "قیمت گذاری با موفقیت به پایان رسید",
            duration: 8000,
            variant: "success"
          })
          router.push(`/profile/orders`)
        }
      }
    }
  )

  const onCreateOffer = () => {
    createOrderOfferMutation.mutate({
      createOrderOfferInput: {
        preOrderId: +uuid
      }
    })
  }

  const onFinishOrder = (id: number) => {
    updateOrderOfferMutation.mutate({
      updateOrderOfferInput: {
        id,
        status: OrderOfferStatuses.Confirmed
      }
    })
  }

  return (
    <>
      <VardastDialog open={open} setOpen={setOpen} />
      <div className="flex h-full w-full flex-col">
        <PageTitle title={title} backButtonUrl="/profile/orders" />
        <PageHeader
          pageHeaderClasses="border-b py-5 !mb-0"
          title={"برای سفارش خود قیمت پیشنهادی بگذارید."}
          titleClasses="text-[14px] font-normal"
          containerClass="items-center"
        >
          <Button
            disabled={
              createOrderOfferMutation.isLoading ||
              findPreOrderByIdQuery.isLoading
            }
            loading={createOrderOfferMutation.isLoading}
            onClick={onCreateOffer}
            type="button"
            variant="primary"
            size="medium"
          >
            {t("common:add_new_entity", {
              entity: t("common:offer")
            })}
          </Button>
        </PageHeader>
        <div className="flex w-full flex-col pt-5">
          {findPreOrderByIdQuery.data?.findPreOrderById.offers.map(
            (offerOrder) => (
              <CollapsibleOfferCart
                key={offerOrder.id}
                offerOrder={offerOrder as OfferOrder}
                openDefault={false}
              >
                {offerOrder.offerLine.map((offer, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 border-b py-5"
                  >
                    <div className="col-span-2">
                      <OrderProductCard
                        line={{
                          id: offer.line.id,
                          item_name: offer.line.item_name,
                          type: offer.line.type,
                          brand: offer.line.brand,
                          descriptions: offer.line.descriptions,
                          qty: offer.line.qty,
                          uom: offer.line.uom
                        }}
                      />
                    </div>
                    <OfferCard offerLine={offer as OfferLine} />
                    <OfferCard offerLine={offer as OfferLine} />
                  </div>
                ))}
                <div className="flex w-full flex-row-reverse gap-5 py-5">
                  <Button
                    onClick={() => onFinishOrder(offerOrder.id)}
                    variant="primary"
                  >
                    پایان سفارش
                  </Button>
                  {/* <Button
                    onClick={() => {
                      router.push(`/profile/orders/${uuid}/addOrderProducts`)
                    }}
                    variant="secondary"
                  >
                    {t("common:have-better-offer")}
                  </Button> */}
                </div>
              </CollapsibleOfferCart>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default OrderOffers
