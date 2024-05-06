import { useRouter } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

type Props = {}

const LoadingFailed = (_: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="flex h-auto items-center justify-center py-8">
      <div className="text-center">
        <button className="mb-3" onClick={() => router.refresh()}>
          <RefreshCcw className="h-6 w-6 text-alpha-400" />
        </button>
        <h3 className="mb-1 font-bold text-alpha-700">
          {t("common:something_went_wrong")}
        </h3>
        <p className="text-alpha-500">{t("common:try_to_reload_the_page")}</p>
      </div>
    </div>
  )
}

export default LoadingFailed
