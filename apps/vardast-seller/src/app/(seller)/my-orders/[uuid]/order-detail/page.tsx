import MyOrdersDetail from "@/app/(seller)/components/MyOrdersDetail"

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  return <MyOrdersDetail uuid={uuid} />
}

export default page
