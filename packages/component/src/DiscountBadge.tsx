import { digitsEnToFa } from "@persian-tools/persian-tools"

type DiscountBadgeProps = { discount: string | number }

const DiscountBadge = ({ discount }: DiscountBadgeProps) => {
  const discountValue = discount ?? 0
  return (
    <div className="flex h-6 items-center justify-center rounded-[100px] bg-error-600 px-2 py-1 text-white">
      {digitsEnToFa(discountValue)}%
    </div>
  )
}

export default DiscountBadge
