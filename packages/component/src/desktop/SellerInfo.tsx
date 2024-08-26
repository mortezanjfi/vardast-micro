import Image from "next/image"
import sellerBlankImage from "@vardast/asset/images/seller-blank.png"
import { Seller } from "@vardast/graphql/generated"
import { MapPinIcon } from "lucide-react"

import Link from "../Link"

type SellerInfoProps = { seller: Seller; classNames?: string | undefined }

const SellerInfo = ({ seller, classNames }: SellerInfoProps) => {
  return (
    <div className={`flex  flex-col justify-center ${classNames}`}>
      <div className="flex items-center gap-2">
        <div className="relative h-[66px] w-[66px]">
          <Image
            src={
              (seller?.logoFile?.presignedUrl.url) || sellerBlankImage
            }
            // src="/images/frame.png"
            alt={seller?.name}
            className="rounded-xl bg-white object-contain shadow-md"
            fill
          />
        </div>
        <div className="flex flex-col">
          <div className="flex h-9 items-center">
            <Link
              className=" text-base font-semibold text-blue-600"
              href={`/seller/${seller?.id}/${seller?.name}`}
            >
              {seller?.name}
            </Link>
          </div>
          <div className="flex h-9 items-center gap-x-2 text-alpha-600">
            {seller?.addresses && seller?.addresses.length > 0 && (
              <>
                <MapPinIcon className="h-4 w-4 text-alpha-600" />
                {seller?.addresses[0]?.province?.name}
              </>
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex gap-1 text-sm text-alpha-500">
        <Rating rating={seller?.rating || (0 as number)} />
        <hr className="h-full w-1 bg-alpha-200" />
        <span>رضایت مشتری:</span>
        <span className="text-success-600">90</span>
        <hr className="h-full w-1 bg-alpha-200" />
        <span>عملکرد:</span>
        <span className="text-success-600">عالی</span>
      </div> */}
    </div>
  )
}

export default SellerInfo
