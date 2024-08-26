import Image from "next/image"
import { Seller } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@vardast/ui/dialog"
import { LucideInfo, LucideMapPin, LucideWarehouse } from "lucide-react"

type SellerHeaderProps = {
  seller: Seller
}

const SellerHeader = ({ seller }: SellerHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center md:mb-12 md:flex-row md:items-end md:justify-start md:gap-6">
      <div className="relative flex h-16 w-full items-center justify-center rounded-md border border-alpha-200 bg-alpha-50 md:h-28 md:w-28">
        {seller.logoFile ? (
          <Image
            alt={seller.name}
            className="object-contain p-3"
            fill
            src={seller.logoFile.presignedUrl.url}
          />
        ) : (
          <LucideWarehouse
            className="h-8 w-8 text-alpha-400 md:h-10 md:w-10"
            strokeWidth={1.5}
          />
        )}
      </div>
      <div className="flex flex-col items-start gap-4">
        {/* <h2 className="text-base font-bold text-alpha-800 md:text-xl">
          {seller.name}
        </h2> */}
        <div className="flex items-center gap-2 md:gap-6">
          {seller.addresses && seller.addresses.length > 0 && (
            <div className="flex items-center gap-1 text-alpha-500">
              <LucideMapPin
                className="h-4 w-4 text-alpha-400"
                strokeWidth={1.5}
              />
              {seller.addresses.at(0)?.city.name}
            </div>
          )}

          {/* TODO */}
          {/* <div className="flex items-center gap-1">
          <span className="text-alpha-500">عملکرد</span>
          <span className="font-bold text-emerald-500">عالی</span>
        </div> */}
        </div>
      </div>
      {seller.bio && (
        <div className="mr-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="small" variant="secondary">
                <LucideInfo className="icon" />
                جزئیات
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>اطلاعات تکمیلی فروشنده</DialogTitle>
              </DialogHeader>
              <div>
                <h3 className="mb-2 font-bold text-alpha-800">معرفی فروشنده</h3>
                <div className="leading-relaxed text-alpha-700">
                  {seller.bio}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default SellerHeader
