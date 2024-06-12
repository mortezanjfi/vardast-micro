"use client"

import { useCallback, useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
  Line,
  OrderOfferStatuses,
  PreOrderStates,
  useCreateOrderOfferMutation,
  useFindPreOrderByIdQuery,
  useUpdateOrderOfferMutation,
  useUpdatePreOrderMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ACTION_BUTTON_TYPE } from "@vardast/type/OrderProductTabs"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"

import OrderProductCard from "../desktop/OrderProductCard"
import OrderProductListContainer, {
  OrderProductCardSkeleton
} from "../desktop/OrderProductListContainer"
import Link from "../Link"
import NotFoundMessage from "../NotFound"
import PageTitle from "../project/PageTitle"

type OrderDetailPageProps = {
  isMobileView?: boolean
  uuid: string
  offerId?: string
}

const OrderDetailPage = ({
  isMobileView,
  uuid,
  offerId
}: OrderDetailPageProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const orderProducts = useMemo(
    () =>
      offerId
        ? findPreOrderByIdQuery?.data?.findPreOrderById.offers
            .find((offer) => offer.id === +offerId)
            ?.offerLine.map((item) => ({
              ...item.line,
              price: {
                fi_price: item.fi_price,
                tax_price: item.tax_price,
                total_price: item.total_price
              }
            }))
        : findPreOrderByIdQuery?.data?.findPreOrderById?.lines,
    [findPreOrderByIdQuery?.data, offerId]
  )

  const files = useMemo(
    () => findPreOrderByIdQuery?.data?.findPreOrderById?.files,
    [findPreOrderByIdQuery?.data]
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
              "لطفا برای قیمت گذاری بر روی کالاها ادامه فرایند را انجام دهید.",
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

  const onCreateOffer = () => {
    createOrderOfferMutation.mutate({
      createOrderOfferInput: {
        preOrderId: +uuid
      }
    })
  }

  const updatePreOrderMutation = useUpdatePreOrderMutation(
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
        onCreateOffer()
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
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindPreOrderById"]
        })
        toast({
          title: "پیشنهاد شما با موفقیت ثبت شد",
          duration: 8000,
          variant: "success"
        })
        router.push(`/profile/orders/${uuid}/offers`)
      }
    }
  )

  const onSubmit = useCallback(() => {
    if (offerId) {
      updateOrderOfferMutation.mutate({
        updateOrderOfferInput: {
          status: OrderOfferStatuses.PendingPrice,
          id: +offerId
        }
      })
    } else {
      updatePreOrderMutation.mutate({
        updatePreOrderInput: { status: PreOrderStates.Completed, id: +uuid }
      })
    }
  }, [offerId])

  useEffect(() => {
    if (
      findPreOrderByIdQuery?.data?.findPreOrderById.status ===
      PreOrderStates.Closed
    ) {
      router.push(`/profile/orders`)
    }
  }, [])

  return (
    <div className="flex h-full flex-col">
      {isMobileView && (
        <PageTitle
          className="pb"
          titleClass="text-sm"
          title={"لیست کالاهای سفارش"}
        />
      )}
      {findPreOrderByIdQuery.isLoading && findPreOrderByIdQuery.isFetching ? (
        <OrderProductListContainer>
          {() => (
            <>
              <OrderProductCardSkeleton />
              <OrderProductCardSkeleton />
              <OrderProductCardSkeleton />
            </>
          )}
        </OrderProductListContainer>
      ) : orderProducts?.length ? (
        <OrderProductListContainer>
          {() => (
            <>
              {orderProducts?.map((line) => (
                <OrderProductCard
                  key={line.id}
                  line={line as Line}
                  actionButtonType={
                    offerId ? ACTION_BUTTON_TYPE.ADD_PRODUCT_OFFER : undefined
                  }
                />
              ))}
              {!offerId &&
                files.map((file) => (
                  <div className="relative overflow-hidden rounded pt-5">
                    <Image
                      src={
                        (file?.file.presignedUrl.url as string) ??
                        "/images/seller-blank.png"
                      }
                      alt={`${file.id}`}
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
            </>
          )}
        </OrderProductListContainer>
      ) : (
        <NotFoundMessage text="کالایی به سفارش خود" />
      )}

      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] grid w-full !grid-cols-2 gap pt-4 md:relative md:bottom-0 md:mt-0 md:flex md:justify-end">
        <Link className="btn btn-md btn-secondary" href="/profile/orders">
          بازگشت به سفارشات
        </Link>
        <Button
          disabled={
            findPreOrderByIdQuery.isFetching ||
            findPreOrderByIdQuery.isLoading ||
            updatePreOrderMutation.isLoading
          }
          loading={updatePreOrderMutation.isLoading}
          onClick={onSubmit}
          type="button"
          variant="primary"
        >
          تایید و ادامه
        </Button>
      </div>
    </div>
  )
}

export default OrderDetailPage
