import clsx from "clsx"
import { RefreshCcw } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

type Props = {
  message?: string
  hideMessage?: boolean
}

const Loading = ({ message, hideMessage }: Props) => {
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        "flex h-auto items-center justify-center",
        !hideMessage && "py-8"
      )}
    >
      <div className="text-center">
        <RefreshCcw
          className={clsx(
            "mx-auto animate-spin text-alpha-400",
            !hideMessage && "mb-3 h-6 w-6"
          )}
        />
        {!hideMessage && (
          <h3 className="mb-1 font-bold text-alpha-700">
            {message ?? t("common:loading_please_wait")}
          </h3>
        )}
      </div>
    </div>
  )
}

export default Loading
