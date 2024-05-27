import AddOrderProduct from "@/app/(admin)/orders/components/AddOrderProduct"

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  return <AddOrderProduct uuid={uuid} />
}

export default page
