"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import OrderProductsList from "@vardast/component/desktop/OrderProductsList"
import Link from "@vardast/component/Link"
import {
  PreOrderStates,
  useFindPreOrderByIdQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import OrderProductsInnerLayout from "./OrderInnerLayout"
import OrderProductsTabs from "./OrderProductsTabs"

type OrderProductsPageIndexProps = {
  isMobileView: boolean
  basket?: boolean
  uuid: string
}

function OrderProductsPageIndex({
  isMobileView,
  basket,
  uuid
}: OrderProductsPageIndexProps) {
  const router = useRouter()
  // const queryClient = useQueryClient()
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  // const createOrderOfferMutation = useCreateOrderOfferMutation(
  //   graphqlRequestClientWithToken,
  //   {
  //     onError: (errors: ClientError) => {
  //       ;(
  //         errors.response.errors?.at(0)?.extensions.displayErrors as string[]
  //       ).map((error) =>
  //         toast({
  //           description: error,
  //           duration: 5000,
  //           variant: "danger"
  //         })
  //       )
  //     },
  //     onSuccess: (data) => {
  //       if (data?.createOrderOffer?.id) {
  //         queryClient.invalidateQueries({
  //           queryKey: ["FindPreOrderById"]
  //         })
  //         toast({
  //           title: "پیشنهاد شما با موفقیت ثبت شد",
  //           description:
  //             "لطفا برای قیمت گذاری بر روی کالاها ادامه فرایند را انجام دهید.",
  //           duration: 8000,
  //           variant: "success"
  //         })
  //         router.push(
  //           `${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders/${uuid}/offers/${data.createOrderOffer.id}`
  //         )
  //       }
  //     }
  //   }
  // )

  // const onCreateOffer = () => {
  //   createOrderOfferMutation.mutate({
  //     createOrderOfferInput: {
  //       preOrderId: +uuid
  //     }
  //   })
  // }

  // const updatePreOrderMutation = useUpdatePreOrderMutation(
  //   graphqlRequestClientWithToken,
  //   {
  //     onError: (errors: ClientError) => {
  //       ;(
  //         errors.response.errors?.at(0)?.extensions.displayErrors as string[]
  //       ).map((error) =>
  //         toast({
  //           description: error,
  //           duration: 5000,
  //           variant: "danger"
  //         })
  //       )
  //     },
  //     onSuccess: () => {
  //       // onCreateOffer()
  //       router.push(`${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders/${uuid}/offers`)
  //     }
  //   }
  // )

  useEffect(() => {
    if (
      findPreOrderByIdQuery?.data?.findPreOrderById.status ===
      PreOrderStates.Closed
    ) {
      router.push(`${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders`)
    }
  }, [])

  // const onSubmit = () => {
  //   updatePreOrderMutation.mutate({
  //     updatePreOrderInput: { status: PreOrderStates.Completed, id: +uuid }
  //   })
  // }

  return (
    <OrderProductsInnerLayout
      findPreOrderByIdQuery={findPreOrderByIdQuery}
      isMobileView={isMobileView}
      uuid={uuid}
    >
      <OrderProductsTabs basket={basket} uuid={uuid} />
      <OrderProductsList
        isMobileView={isMobileView}
        findPreOrderByIdQuery={findPreOrderByIdQuery}
      />
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] mt-auto grid w-full !grid-cols-2 gap pt-4 md:relative md:bottom-0 md:mt-0 md:flex md:justify-end">
        <Link
          className="btn btn-md btn-secondary"
          href={`${process.env.NEXT_PUBLIC_BIDDIN_PATH}orders/${uuid}`}
        >
          بازگشت به سفارش
        </Link>
        {/* <Button
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
        </Button> */}
      </div>
    </OrderProductsInnerLayout>
  )
}

export default OrderProductsPageIndex
