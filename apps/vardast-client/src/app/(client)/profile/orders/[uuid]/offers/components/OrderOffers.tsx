"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import Link from "@vardast/component/Link"
import {
  OfferLine,
  OfferOrder,
  OrderOfferStatuses,
  PreOrderStates,
  TypeOrderOffer,
  useCreateOrderOfferMutation,
  useFindPreOrderByIdQuery,
  useUpdateOrderOfferMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import OrderProductCard from "@/app/(client)/profile/orders/[uuid]/products/components/OrderProductCard"
import CollapsibleOfferCart from "@/app/(client)/profile/orders/components/CollapsibleOfferCart"
import VardastDialog from "@/app/(client)/profile/orders/components/VardastDialog"
import OfferCard from "@/app/(client)/profile/orders/OfferCard"

type OrderOffersProps = { uuid: string }

const OrderOffers = ({ uuid }: OrderOffersProps) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
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
        status: OrderOfferStatuses.Closed
      }
    })
  }

  return (
    <>
      <VardastDialog open={open} setOpen={setOpen} />
      <div className="flex h-full w-full flex-col gap-4 px-0.5">
        {findPreOrderByIdQuery.data?.findPreOrderById?.offers.map(
          (offerOrder, orderIndex) => (
            <CollapsibleOfferCart
              status={orderIndex === 0 ? "enable" : "disable"}
              key={offerOrder.id}
              offerOrder={offerOrder as OfferOrder}
              openDefault={false}
            >
              {offerOrder.offerLine.map((offer, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 py-5">
                  <div className="col-span-3">
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
                </div>
              ))}
              {!(
                offerOrder.type === TypeOrderOffer.Client &&
                session?.profile?.roles.some((role) => role?.name === "user")
              ) &&
                findPreOrderByIdQuery.data?.findPreOrderById.status ===
                  PreOrderStates.Verified && (
                  <div className="flex w-full flex-row-reverse gap-5 border-t py-5">
                    <Button
                      onClick={() => onFinishOrder(offerOrder.id)}
                      variant="primary"
                    >
                      خرید از این فروشنده
                    </Button>
                  </div>
                )}
            </CollapsibleOfferCart>
          )
        )}
      </div>
      <div className="my-5 flex justify-end gap border-t pt-5">
        <Link className="btn btn-md btn-secondary" href="/profile/orders/">
          بازگشت به سفارشات
        </Link>
        {findPreOrderByIdQuery.data?.findPreOrderById.status ===
          PreOrderStates.Verified && (
          <Button
            disabled={
              createOrderOfferMutation.isLoading ||
              findPreOrderByIdQuery.isLoading
            }
            loading={createOrderOfferMutation.isLoading}
            onClick={onCreateOffer}
            type="button"
            variant="full-secondary"
          >
            قیمت پایین تر دارم!
          </Button>
        )}
      </div>
    </>
  )
}

export default OrderOffers