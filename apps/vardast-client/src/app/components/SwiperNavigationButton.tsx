import { useCallback } from "react"
import { Button } from "@vardast/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper as SwiperClass } from "swiper/types"

export enum SwiperButtonAction {
  // eslint-disable-next-line no-unused-vars
  HANDLE_PREVIOUS = "HANDLE_PREVIOUS",
  // eslint-disable-next-line no-unused-vars
  HANDLE_NEXT = " HANDLE_NEXT"
}

export enum SwiperButtonsDirection {
  // eslint-disable-next-line no-unused-vars
  LEFT = "LEFT",
  // eslint-disable-next-line no-unused-vars
  RIGHT = "RIGHT"
}

type SwiperNavigationButtonProps = {
  swiperRef: SwiperClass | undefined
  action: SwiperButtonAction
  direction: SwiperButtonsDirection
  iconSize: number
  className?: string
}

const SwiperNavigationButton = ({
  swiperRef,
  action,
  direction,
  iconSize = 20,
  className
}: SwiperNavigationButtonProps) => {
  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev()
  }, [swiperRef])

  const handleNext = useCallback(() => {
    swiperRef?.slideNext()
  }, [swiperRef])

  const handleClick = useCallback(() => {
    if (action === SwiperButtonAction.HANDLE_PREVIOUS) {
      handlePrevious()
    } else if (action === SwiperButtonAction.HANDLE_NEXT) {
      handleNext()
    }
  }, [action, handleNext, handlePrevious])

  return (
    <Button
      onClick={handleClick}
      variant="secondary"
      className={`absolute top-1/2 z-[25] h-fit w-fit -translate-y-1/2 transform rounded-full border-2 border-alpha-200 bg-white p-3 text-black
       ${
         direction === SwiperButtonsDirection.LEFT ? " left-4" : "right-4"
       } ${className}`}
    >
      {direction === SwiperButtonsDirection.LEFT ? (
        <ChevronLeft size={iconSize} />
      ) : (
        <ChevronRight size={iconSize} />
      )}
    </Button>
  )
}
export default SwiperNavigationButton
