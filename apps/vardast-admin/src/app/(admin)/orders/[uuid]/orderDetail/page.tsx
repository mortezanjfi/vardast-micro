import OrderDetail from "@/app/(admin)/orders/components/OrderDetail"

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  return <OrderDetail uuid={uuid} />
}

export default page
