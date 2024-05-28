import MyOrdersOffers from "@/app/(seller)/components/MyOrdersOffers"

const OrderOffersPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  return <MyOrdersOffers uuid={uuid} />
}

export default OrderOffersPage
