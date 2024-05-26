import AddSellerInfo from "@/app/(seller)/components/AddSellerInfo"

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  return <AddSellerInfo uuid={uuid} />
}

export default page
