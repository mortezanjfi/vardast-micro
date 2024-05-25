import OrderDetail from "@vardast/component/desktop/OrderDetail"

import OrderSubmit from "@/app/(admin)/orders/components/OrderSubmit"
import UploadedFiles from "@/app/(admin)/orders/components/UploadedFIles"

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
      isAdmin={true}
      data={fakeData}
      Adminchildren={
        <>
          <UploadedFiles />
          <OrderSubmit uuid={uuid} />
        </>
      }
    />
  )
}

export default page
