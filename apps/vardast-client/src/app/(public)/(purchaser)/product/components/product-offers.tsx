"use client"

import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { Offer, Uom } from "@vardast/graphql/generated"

import DesktopProductOfferItem from "@/app/(public)/(purchaser)/product/components/DesktopProductOfferItem"
import MobileProductOfferItem from "@/app/(public)/(purchaser)/product/components/MobileProductOfferItem"
import ProductSectionContainer from "@/app/(public)/(purchaser)/product/components/ProductSectionContainer"

type ProductOffersProps = {
  isMobileView: boolean
  offers: Offer[]
  uom: Uom
}

const ProductOffers = ({ offers, uom, isMobileView }: ProductOffersProps) => {
  const [brandMoreFlag, setBrandMoreFlag] = useState(false)

  const onOpenCategories = () => {
    setBrandMoreFlag((prev) => !prev)
  }

  return (
    <ProductSectionContainer
      subtitle={
        offers.length > 1
          ? {
              onClick: onOpenCategories,
              text: brandMoreFlag
                ? " بستن "
                : `${digitsEnToFa(offers.length - 1)} فروشنده دیگر `
            }
          : undefined
      }
      title="فروشندگان"
      titleCostumClass="sm:!pb-0 !px-0"
    >
      <div className="relative flex w-full flex-col gap-0.5 bg-alpha-200">
        {offers.slice(0, brandMoreFlag ? offers.length : 1).map((offer) =>
          isMobileView ? (
            <MobileProductOfferItem key={offer.id} offer={offer} uom={uom} />
          ) : (
            <DesktopProductOfferItem
              key={offer.id}
              offer={offer}
              uom={uom}
              // hasContactButton={offers.length > 1}
            />
          )
        )}
        {/* {offers.length > 1 && (
          <Button
            onClick={onOpenCategories}
            variant="link"
            className="!mt-2 mr-auto !text-primary"
          >
            {brandMoreFlag
              ? " بستن "
              : `${digitsEnToFa(offers.length - 1)} فروشنده دیگر `}
          </Button>
        )} */}
      </div>
    </ProductSectionContainer>
  )
}

export default ProductOffers
