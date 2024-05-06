import Image from "next/image"
import Link from "@vardast/component/Link"
import { Brand } from "@vardast/graphql/generated"
import { LucideWarehouse } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

type BrandHeaderProps = {
  brand: Brand
}

const BrandHeader = ({ brand }: BrandHeaderProps) => {
  const { t } = useTranslation()

  return (
    <Link href={`/brand/${brand.id}/${brand.name}`}>
      <div className="mb-8 flex items-end gap-2 md:mb-12 md:gap-6">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-md border border-alpha-200 bg-alpha-50 md:h-28 md:w-28">
          {brand.logoFile ? (
            <Image
              src={brand.logoFile?.presignedUrl.url}
              fill
              alt={brand.name}
              className="object-contain p-3"
            />
          ) : (
            <LucideWarehouse
              className="h-8 w-8 text-alpha-400 md:h-10 md:w-10"
              strokeWidth={1.5}
            />
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-base font-bold text-alpha-800 md:text-xl">
            {brand.name}
          </h2>
          <div className="flex items-center gap-6 text-xs text-alpha-500 md:text-sm">
            {t("common:producer_submitted_product")}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BrandHeader
