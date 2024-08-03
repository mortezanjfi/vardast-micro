import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import useTranslation from "next-translate/useTranslation"

type ItemsCountProps = {
  countItemTitle: string
  itemCount: number
}

const ItemsCount = ({ countItemTitle, itemCount }: ItemsCountProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex gap-1 bg-alpha-white text-alpha-500 md:w-auto">
      <span>{t(`common:${countItemTitle}`)} : </span>
      <span className="text-primary-600">
        {digitsEnToFa(addCommas(itemCount))}
      </span>
    </div>
  )
}

export default ItemsCount
