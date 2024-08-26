import Image from "next/image"
import { cva } from "class-variance-authority"

const cardAvatarVariants = cva(
  "relative overflow-hidden rounded-full border border-alpha-400",
  {
    variants: {
      size: { small: " h-14 w-14", medium: "h-28 w-28" }
    }
  }
)

const CardAvatar = ({
  url = "",
  name,
  size = "small"
}: {
  url: string
  name?: string
  size?: "small" | "medium"
}) => {
  return (
    <div className="flex  items-center justify-start gap-x">
      <div className={cardAvatarVariants({ size })}>
        <Image
          alt="category"
          className="h-full w-full rounded-full object-contain"
          fill
          src={url}
        />
      </div>
      {name && <h5 className="text-right font-semibold">{name}</h5>}
    </div>
  )
}

export default CardAvatar
