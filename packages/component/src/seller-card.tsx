import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import sellerBlankImage from "@vardast/asset/images/seller-blank.png"
import { Seller } from "@vardast/graphql/generated"

import Link from "./Link"
import Rating from "./Rating"

interface SellerCardProps {
  seller: Seller
}

const SellerCard = ({ seller }: SellerCardProps) => {
  const onLoadImage = () => {
    const div =
      typeof window !== "undefined" &&
      document?.getElementById(`seller-image-${seller?.id}`)
    if (div) {
      div.className = div.className + " opacity-100"
    }
  }

  return (
    <div className="relative px transition hover:z-10 md:h-auto md:hover:shadow-lg">
      <Link
        className="flex h-full w-full rounded-xl bg-alpha-white lg:px-4"
        href={`/seller/${seller?.id}/${seller?.name}`}
      >
        <div className="grid flex-1 grid-cols-3 gap-4 lg:flex lg:flex-col">
          <div
            className={`relative w-32 flex-shrink-0 bg-[url('/images/blank.png')] bg-[length:2em] bg-center bg-no-repeat align-middle duration-1000 ease-out lg:h-48 lg:w-full ${
              seller?.logoFile?.presignedUrl.url ? "opacity-0" : ""
            }`}
            id={`seller-image-${seller?.id}`}
          >
            {seller?.logoFile?.presignedUrl.url ? (
              <Image
                alt={seller?.name}
                className="object-contain"
                fill
                loading="eager"
                sizes="(max-width: 640px) 33vw, 10vw"
                src={seller?.logoFile?.presignedUrl.url}
                onError={onLoadImage}
                onLoad={onLoadImage}
              />
            ) : (
              <Image
                alt={seller?.name}
                className="object-contain"
                fill
                loading="eager"
                sizes="(max-width: 640px) 33vw, 10vw"
                src={sellerBlankImage}
              />
            )}
          </div>
          <div className="lg:col-span1 col-span-2 flex flex-1 flex-col items-start gap-2 border-r p-2 sm:border-r-0 md:gap-0">
            <h4 className="font-bold text-alpha-800" title={seller?.name}>
              {seller?.name}
            </h4>
            <p className="text-primary-500">
              {seller?.sum ? `${digitsEnToFa(seller?.sum)} محصول` : ""}
            </p>
            <div className="flex items-center gap-x-2 text-alpha-600">
              <MapPinIcon className="h-4 w-4 text-alpha-600" />
              {seller?.addresses.length > 0 &&
                seller?.addresses[0]?.province.name}
            </div>
            {seller?.rating && seller?.rating > 0 ? (
              <Rating rating={seller?.rating} />
            ) : (
              ""
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default SellerCard
