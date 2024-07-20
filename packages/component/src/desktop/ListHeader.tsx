import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import ItemsCount from "../ItemsCount"

type Props = { borderBottom?: boolean; total?: number; listName: string }

const ListHeader = ({ borderBottom: borderBottom, total, listName }: Props) => {
  const { t } = useTranslation()
  return (
    <div
      className={clsx(
        "flex items-center justify-between  px md:px-0 md:pb-5",
        borderBottom && "border-b"
      )}
    >
      <span className="text-lg font-medium">
        {t("common:entity_list", { entity: t(`common:${listName}`) })}
      </span>
      {total && (
        <ItemsCount
          countItemTitle={listName}
          itemCount={total ? (total as number) : 0}
        />
      )}
    </div>
  )
}

export default ListHeader
