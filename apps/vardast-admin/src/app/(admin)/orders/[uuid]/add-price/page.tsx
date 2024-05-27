import AddPricePage from "@/app/(admin)/orders/components/AddPricePage"

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  return <AddPricePage uuid={uuid} />
}

export default page
