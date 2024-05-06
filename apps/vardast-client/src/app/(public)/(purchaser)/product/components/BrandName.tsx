import Link from "@vardast/component/Link"
import { Brand } from "@vardast/graphql/generated"
import useTranslation from "next-translate/useTranslation"

type BrandNameProps = { brand: Brand }

const BrandName = ({ brand }: BrandNameProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex bg-alpha-white pb-6 pt-9 md:pb-0 xl:pt-0">
      <span>{t("common:brand")}:</span>
      <Link
        className="pr-1 text-base font-semibold text-blue-600"
        href={`/brand/${brand.id}/${brand.name}`}
      >
        {brand.name}
      </Link>
    </div>
  )
}

export default BrandName
