import { Database } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

interface Props {
  entity: string
}

const NoResult = ({ entity }: Props) => {
  const { t } = useTranslation()
  return (
    <div className="mx-auto mt-12 max-w-sm">
      <span className="mb-4 flex h-8 w-8 items-center justify-center rounded bg-alpha-300/50 text-alpha-500">
        <Database className="h-5 w-5" />
      </span>
      <h2 className="mb-2 text-3xl font-extrabold text-alpha-800">
        {t("common:no_entity_found", {
          entity: t(`common:${entity}`)
        })}
      </h2>
    </div>
  )
}

export default NoResult
