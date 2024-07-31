import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

type Props = {
  borderBottom?: boolean
  total?: number
  listName: string
  secondTitle?: string
}

const ListHeader = ({
  borderBottom: borderBottom,
  total,
  listName,
  secondTitle
}: Props) => {
  const { t } = useTranslation()
  return (
    <div
      className={clsx(
        "flex items-center justify-between  px py-4  sm:px-0 sm:pb-5 sm:pt-0",
        borderBottom && "border-b"
      )}
    >
      <span className="text-sm font-medium text-alpha-500 sm:text-lg sm:text-alpha-800">
        {t("common:entity_list", { entity: t(`common:${listName}`) })}
      </span>
      {total && (
        <div className="flex gap-1 bg-alpha-white text-sm text-alpha-500 sm:w-auto sm:text-base">
          <span>{digitsEnToFa(addCommas(total))}</span>
          <span>{t(`common:${secondTitle}`)} </span>
        </div>
      )}
    </div>
  )
}

export default ListHeader
