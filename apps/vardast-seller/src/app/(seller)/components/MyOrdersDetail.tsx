"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import OrderDetail, {
  OrderDetailPageType
} from "@vardast/component/desktop/OrderDetail"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import SellersList from "@/app/(seller)/components/SellersList"

const AddOfferSchema = z.object({
  offerId: z.coerce.string(),
  confirmOffer: z.boolean()
})
export type ConfirmOffer = TypeOf<typeof AddOfferSchema>

type MyOrdersDetailProps = { uuid: string }
const MyOrdersDetail = ({ uuid }: MyOrdersDetailProps) => {
  // const form = useForm<ConfirmOffer>({ resolver: zodResolver(AddOfferSchema) })

  const fakeData = [
    {
      id: 3,
      product_sku: "Innovative AI Development",
      productName: "test",
      brand: "test brand",
      unit: "60",
      value: 4,
      attributes: ["test", "test2"],
      purchaserPrice: { basePrice: 300, tax: 40, total: 340 }
    }
  ]
  const sellersData = [
    {
      id: 3,
      sellerCode: "Innovative AI Development",
      sellerName: "test",
      invoiceNumber: "test brand",
      invoicePrice: "60"
    }
  ]

  return (
    <>
      <OrderDetail
        type={OrderDetailPageType.SELLER_MY_ORDERS_DETAIL}
        data={fakeData}
        AddOfferChildren={
          <>
            <SellersList sellersData={sellersData} uuid={uuid} />
          </>
        }
      />
    </>
  )
}

export default MyOrdersDetail
