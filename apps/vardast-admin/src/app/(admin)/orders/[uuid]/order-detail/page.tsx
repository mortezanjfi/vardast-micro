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
    // <OrderDetail
    //   type={OrderDetailPageType.ADMIN_ORDER_DETAIL_PAGE}
    //   data={fakeData}
    //   Adminchildren={
    //     <>
    //       <UploadedFiles />
    //       <OrderSubmit uuid={uuid} />
    //     </>
    //   }
    // />
    <div></div>
  )
}

export default page