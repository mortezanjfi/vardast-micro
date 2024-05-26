"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Line,
  PreOrderStates,
  useFindPreOrderByIdQuery,
  useUpdatePreOrderMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import OrderProductCard, {
  OrderProductCardSkeleton
} from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductCard"
import OrderProductListContainer from "@/app/(client)/(profile)/profile/orders/components/OrderProductListContainer"
import { NotFoundItems } from "@/app/(client)/favorites/components/FavoritesPageIndex"

type OrderDetailPageProps = { uuid: string; title: string }

const OrderDetailPage = ({ uuid, title }: OrderDetailPageProps) => {
  const router = useRouter()
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const updatePreOrderMutation = useUpdatePreOrderMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        router.push(`/profile/orders`)
      }
    }
  )
  const onSubmit = () => {
    updatePreOrderMutation.mutate({
      updatePreOrderInput: { status: PreOrderStates.Verified, id: +uuid }
    })
  }

  return (
    <div className="flex h-full w-full flex-col gap-9">
      <PageTitle title={title} backButtonUrl="/profile/orders" />
      {!findPreOrderByIdQuery.data?.findPreOrderById?.lines?.length ? (
        <OrderProductListContainer>
          {() => (
            <>
              <OrderProductCardSkeleton />
              <OrderProductCardSkeleton />
              <OrderProductCardSkeleton />
            </>
          )}
        </OrderProductListContainer>
      ) : findPreOrderByIdQuery.data?.findPreOrderById?.lines?.length ? (
        <>
          <OrderProductListContainer>
            {({ selectedItemId, setSelectedItemId }) => (
              <>
                {findPreOrderByIdQuery.data?.findPreOrderById?.lines?.map(
                  (line) => (
                    <OrderProductCard key={line.id} line={line as Line} />
                  )
                )}
              </>
            )}
          </OrderProductListContainer>
          {findPreOrderByIdQuery.data?.findPreOrderById.files.map((file) => (
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
          تایید اطلاعات
        </Button>
      </div>
    </div>
  )
}

export default OrderDetailPage
