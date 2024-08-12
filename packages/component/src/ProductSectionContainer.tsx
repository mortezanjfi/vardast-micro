import { PropsWithChildren } from "react"
import { ChevronLeftIcon } from "@heroicons/react/24/solid"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"

const ProductSectionContainer: React.FC<
  PropsWithChildren<{
    TitleTag?: keyof JSX.IntrinsicElements
    titleCostumClass?: string
    titlePadding?: boolean
    title?: string
    spaceless?: boolean
    bgTransparent?: boolean
    subtitle?: {
      text: string
      onClick: (_?: any) => void
    }
  }>
> = ({
  TitleTag = "h2",
  titleCostumClass,
  title = "",
  spaceless,
  subtitle,
  bgTransparent,
  children
}) => {
  return (
    <div
      className={`${spaceless ? "" : "p px-6"} ${
        bgTransparent ? "" : "bg-alpha-white"
      } flex flex-col py-4  md:px-0
      `}
    >
      {title && (
        <div
          className={clsx(
            "flex items-center justify-between px-6 py-3 sm:px-0",
            titleCostumClass
          )}
        >
          <TitleTag className="text-base font-medium sm:text-xl">
            {title}
          </TitleTag>

          {subtitle && (
            <Button
              onClick={subtitle.onClick}
              variant="link"
              // className="!text-primary"
              className="text-sm font-semibold !text-primary"
            >
              {subtitle.text}
              <ChevronLeftIcon className="h-4 w-4 text-primary" />
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default ProductSectionContainer
