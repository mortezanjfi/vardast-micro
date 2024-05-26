"use client"

import { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PlusIcon } from "@heroicons/react/24/solid"
import Link from "@vardast/component/Link"
import {
  Line,
  OrderOfferStatuses,
  PreOrderStates,
  useFindPreOrderByIdQuery,
  useUpdateOrderOfferMutation,
  useUpdatePreOrderMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import VerifyOrderModal from "@/app/(client)/(profile)/profile/orders/[uuid]/components/VerifyOrderModal"
import OrderProductCard, {
  ACTION_BUTTON_TYPE,
  OrderProductCardSkeleton
} from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductCard"
import OrderProductListContainer from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductListContainer"
import { NotFoundItems } from "@/app/(client)/favorites/components/FavoritesPageIndex"

type OrderDetailPageProps = { uuid: string; offerId?: string; title: string }

const OrderDetailPage = ({ uuid, title, offerId }: OrderDetailPageProps) => {
  const [open, setOpen] = useState(false)
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
        ? findPreOrderByIdQuery.data?.findPreOrderById.offers
            .find((offer) => offer.id === +offerId)
            ?.offerLine.map((item) => ({
              ...item.line,
              price: {
                fi_price: item.fi_price,
                tax_price: item.tax_price,
                total_price: item.total_price
              }
            }))
        : findPreOrderByIdQuery.data?.findPreOrderById?.lines,
    [findPreOrderByIdQuery.data, offerId]
  )

  const files = useMemo(
    () => findPreOrderByIdQuery.data?.findPreOrderById?.files,
    [findPreOrderByIdQuery.data]
  )

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
        toast({
          title: "سفارش شما با موفقیت ثبت شد",
          description:
            "لطفا برای قیمت گذاری بقر روی کالاها ادامه فرایند را انجام دهید.",
          duration: 8000,
          variant: "success"
        })
        router.push(`/profile/orders`)
        setOpen(false)
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
        toast({
          title: "پیشنهاد شما با موفقیت ثبت شد",
          duration: 8000,
          variant: "success"
        })
        router.push(`/profile/orders/${uuid}/offers`)
        setOpen(false)
      }
    }
  )

  const onSubmit = () => {
    setOpen(true)
  }

  const onVerify = useCallback(() => {
    if (offerId) {
      updateOrderOfferMutation.mutate({
        updateOrderOfferInput: {
          status: OrderOfferStatuses.Confirmed,
          id: +offerId
        }
      })
    } else {
      updatePreOrderMutation.mutate({
        updatePreOrderInput: { status: PreOrderStates.Verified, id: +uuid }
      })
    }
  }, [offerId])

  return (
    <>
      <VerifyOrderModal open={open} setOpen={setOpen} onVerify={onVerify} />
      <div className="flex h-full w-full flex-col gap-9">
        <PageTitle
          title={title}
          backButtonUrl={`/profile/orders${offerId ? `/${uuid}/offers` : ""}`}
        />
        <div className="flex items-center justify-between border-b py-5">
          <div className="flex flex-col gap-2  ">
            <span className=" pb-2 text-lg font-semibold">
              لیست کالاهای سفارش
            </span>
            <p className="text-sm">
              کالاها و هزینه های جانبی درخواستی خود را از یک یا ترکیبی از روش
              های زیر انتخاب کرده و پس از تایید، قیمت گذاری کنید.
            </p>
          </div>
          <div className="grid items-center gap-2">
            <Link
              className="btn btn-md btn-outline-primary px-4 py-2"
              href={`/profile/orders/${uuid}/products`}
            >
              <PlusIcon width={20} height={20} />
              اضافه کردن کالا
            </Link>
          </div>
        </div>
        {!orderProducts?.length ? (
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
          <>
            <OrderProductListContainer>
              {({ selectedItemId, setSelectedItemId }) => (
                <>
                  {orderProducts?.map((line) => (
                    <OrderProductCard
                      key={line.id}
                      line={line as Line}
                      actionButtonType={
                        offerId
                          ? ACTION_BUTTON_TYPE.ADD_PRODUCT_OFFER
                          : undefined
                      }
                    />
                  ))}
                </>
              )}
            </OrderProductListContainer>
            {!offerId &&
              files.map((file) => (
                <div className="relative overflow-hidden rounded">
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
        ) : (
          <NotFoundItems text="کالا" />
        )}
        <div className="flex flex-row-reverse py-5">
          <Button
            disabled={
              findPreOrderByIdQuery.isFetching ||
              findPreOrderByIdQuery.isLoading ||
              updatePreOrderMutation.isLoading
            }
            loading={updatePreOrderMutation.isLoading}
            type="button"
            onClick={onSubmit}
            variant="primary"
          >
            {offerId ? "تایید نهایی قیمت" : "تایید اطلاعات"}
          </Button>
        </div>
      </div>
    </>
  )
}

export default OrderDetailPage
