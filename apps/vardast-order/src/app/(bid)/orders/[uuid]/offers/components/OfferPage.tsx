"use client"

import OrderProductsList from "../../products/components/OrderProductsList"

type Props = {
  uuid: string
  offerId: string
}

const OfferPage = ({ uuid }: Props) => {
  return <OrderProductsList uuid={uuid} />
}

export default OfferPage
