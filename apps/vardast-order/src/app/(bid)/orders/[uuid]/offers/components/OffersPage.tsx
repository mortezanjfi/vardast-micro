"use client"

import OrderOffers from "./OrderOffers"

type Props = {
  uuid: string
  isMobileView: boolean
}

export default ({ isMobileView, uuid }: Props) => {
  return <OrderOffers isMobileView={isMobileView} uuid={uuid} />
}
