"use client"

import { useContext, useEffect } from "react"
import { EventTrackerTypes, Price, Uom } from "@vardast/graphql/generated"
import { PublicContext } from "@vardast/provider/PublicProvider"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import { useSetAtom } from "jotai"

type SuggestedOfferProps = {
  offersCount: number
  offer: Price
  uom: Uom
}

// eslint-disable-next-line no-unused-vars
const SuggestedOffer = ({ offer }: SuggestedOfferProps) => {
  const { contactModalDataAtom } = useContext(PublicContext)
  const setContactModalData = useSetAtom(contactModalDataAtom)

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  useEffect(() => {
    setContactModalData({
      data: offer.seller,
      type: EventTrackerTypes.ViewBuyBox,
      title: "اطلاعات تماس"
    })
  }, [offer.seller, setContactModalData])

  return <></>
}

export default SuggestedOffer
