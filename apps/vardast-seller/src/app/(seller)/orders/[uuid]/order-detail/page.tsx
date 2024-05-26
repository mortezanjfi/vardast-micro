import OrderDetail, {
  OrderDetailPageType
} from "@vardast/component/desktop/OrderDetail"

import AddToMyOrders from "@/app/(seller)/components/AddToMyOrders"

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
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

  return (
    <OrderDetail
      data={fakeData}
      SellerChildren={<AddToMyOrders />}
      type={OrderDetailPageType.SELLER_ORDERS_DETAIL}
      SellerAddOfferPriceChildren={""}
    />
  )
}

export default page