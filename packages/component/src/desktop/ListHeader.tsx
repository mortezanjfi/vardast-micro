import useTranslation from "next-translate/useTranslation"

import ItemsCount from "../ItemsCount"

type Props = { total?: number; listName: string }

const ListHeader = ({ total, listName }: Props) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between border-b px md:px-0 md:pb-5">
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
