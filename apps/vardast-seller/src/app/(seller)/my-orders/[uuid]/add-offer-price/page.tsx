import AddOfferPrice from "@/app/(seller)/components/AddOfferPrice"

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  return <AddOfferPrice uuid={uuid} />
}

export default page
