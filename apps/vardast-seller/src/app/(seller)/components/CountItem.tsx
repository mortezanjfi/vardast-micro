import { digitsEnToFa } from "@persian-tools/persian-tools"
import { ColorEnum } from "@vardast/type/Enums"
import { ISellerMobileAnalyzeProps } from "@vardast/type/Seller"
import clsx from "clsx"

export const CountItem = ({
  isMobileView,
  Icon,
  title,
  value,
  bgColor
}: ISellerMobileAnalyzeProps) => {
  return (
    <>
      {isMobileView ? (
        <div className="flex items-center justify-between rounded-lg bg-alpha-50 p">
          <div className="flex flex-col justify-center gap-y-0.5">
            <p className="text-sm text-alpha-600">{title}</p>
            <p className="font-semibold">{digitsEnToFa(value ?? "0")}</p>
          </div>
          <div>
            <Icon
              className={clsx(
                "h-12 w-12 rounded-lg p-2 text-alpha-white",
                `bg-${bgColor && ColorEnum[bgColor].toLocaleLowerCase()}`
              )}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg bg-alpha-white p-7">
          <div className="flex flex-col justify-center gap-y-2">
            <p className="text-sm text-alpha-600">{title}</p>
            <p className="font-semibold">{digitsEnToFa(value ?? "0")}</p>
          </div>
          <div>
            <Icon
              className={clsx(
                " h-12 w-12 rounded-lg p-2 text-alpha-white",
                `bg-${bgColor && ColorEnum[bgColor].toLocaleLowerCase()}`
              )}
            />
          </div>
        </div>
      )}
    </>
  )
}
