"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import CardContainer from "@vardast/component/desktop/CardContainer"
import SellerAdminConfirmationModal from "@vardast/component/desktop/SellerAdminConfirmationModal"
import { usePickUpPreOrderMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Checkbox } from "@vardast/ui/checkbox"

type Props = {}

function AddToMyOrders({}: Props) {
  const router = useRouter()
  const params = useParams()

  const [isResponsible, setIsResponsible] = useState<boolean>(false)
  const [open, onOpenChange] = useState<boolean>(false)

  const pickUpPreOrderMutation = usePickUpPreOrderMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        toast({
          description: "عملیات با موفقیت انجام شد",
          duration: 2000,
          variant: "success"
        })
        router.push(`/my-orders/${+params.uuid}/offers`)
      }
    }
  )

  const submit = () => {
    pickUpPreOrderMutation.mutate({
      preOrderId: +params?.uuid
    })
  }

  return (
    <>
      <SellerAdminConfirmationModal
        onSubmit={submit}
        content="پس از تایید، این سفارش به لیست سفارشات شما اضافه می شود و می توانید قیمت پیشنهادی خود را به خریدار اعلام نمایید."
        open={open}
        onOpenChange={onOpenChange}
        setIsResponsible={setIsResponsible}
      />
      <CardContainer title="انتخاب سفارش">
        <div className="flex w-full flex-col justify-between gap-5 2xl:flex-row 2xl:items-center ">
          <p>
            در صورتی که مسئولیت این سفارش را می پذیرید، گزینه رو به رو را انتخاب
            کرده و تایید نمایید.
          </p>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={isResponsible}
              onCheckedChange={(checked) => {
                setIsResponsible((prev) => !prev)
                onOpenChange(true)
                return checked
              }}
            />
            <p>مسئولیت این سفارش را می پذیرم.</p>
          </div>
        </div>
      </CardContainer>
    </>
  )
}

export default AddToMyOrders
