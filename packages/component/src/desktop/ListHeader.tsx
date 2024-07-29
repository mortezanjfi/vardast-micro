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
        "flex items-center justify-between  px py-4  md:px-0 md:pb-5 md:pt-0",
        borderBottom && "border-b"
      )}
    >
      <span className="text-sm font-medium text-alpha-500 md:text-lg md:text-alpha-800">
        {t("common:entity_list", { entity: t(`common:${listName}`) })}
      </span>
      {total && (
        <div className="flex gap-1 bg-alpha-white text-sm text-alpha-500 md:w-auto md:text-base">
          <span>{digitsEnToFa(addCommas(total))}</span>
          <span>{t(`common:${secondTitle}`)} </span>
        </div>
      )}
    </div>
  )
}

export default ListHeader
