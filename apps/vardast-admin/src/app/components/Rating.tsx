import { StarIcon } from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"

import { ITextSize } from "@/app/components/PriceTitle"

export const RatingSkeleton = () => {
  return (
    <div className="animated-card flex h-4 w-8 items-center gap-x-0.5 rounded py-1 text-xs"></div>
  )
}

const Rating = ({
  rating,
  size = "xs"
}: {
  rating: number
  size?: ITextSize
}) => {
  return (
    <div
      className={`flex items-center gap-x-0.5 rounded bg-warning-50 px-2 py-1 text-${size}`}
    >
      <span className={`text-${size}`}>{digitsEnToFa(+`${rating}`)}</span>
      <StarIcon className="h-4 w-4 text-warning-400" />
    </div>
  )
}

export default Rating
