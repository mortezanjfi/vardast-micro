 
"use client"

import { PropsWithChildren } from "react"
import clsx from "clsx"

import MobileHomeSectionContainer, {
  IMobileHomeSectionContainer
} from "./MobileHomeSectionContainer"

enum HEIGHT {
  EIGHTY_EIGHT = "h-[88vw]",
  FORTY_SIX = "h-[46vw]",
  THIRTY_FOUR = "h-[34vw]",
  ONE_TWENTY_FIFE = "h-[125vw]",
  ONE_FORTY_SEVEN = "h-[147vw]"
}

enum ITEMS_COUNT {
  TWO = "grid-cols-2",
  THREE = "grid-cols-3"
}

type IHeight =
  | "EIGHTY_EIGHT"
  | "FORTY_SIX"
  | "THIRTY_FOUR"
  | "ONE_TWENTY_FIFE"
  | "ONE_FORTY_SEVEN"

type IItemsCount = "TWO" | "THREE"

interface IProps extends PropsWithChildren {
  title?: IMobileHomeSectionContainer["title"]
  itemsCount?: IItemsCount
  height?: IHeight
  bgWhite?: IMobileHomeSectionContainer["bgWhite"]
  viewAllHref?: IMobileHomeSectionContainer["viewAllHref"]
  customButton?: IMobileHomeSectionContainer["customButton"]
  block?: boolean
}

const MobileHomeSection: React.FC<IProps> = ({
  title,
  itemsCount,
  height,
  block,
  bgWhite,
  viewAllHref,
  customButton,
  children
}) => {
  return (
    <MobileHomeSectionContainer
      bgWhite={bgWhite}
      customButton={customButton}
      title={title}
      viewAllHref={viewAllHref}
    >
      <div
        className={clsx(
          "grid w-full gap",
          !block && "px-5 md:px-0",
          itemsCount && ITEMS_COUNT[itemsCount],
          height && HEIGHT[height]
        )}
      >
        {children}
      </div>
    </MobileHomeSectionContainer>
  )
}

export default MobileHomeSection
