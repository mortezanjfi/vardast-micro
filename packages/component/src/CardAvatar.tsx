import Image from "next/image"

const CardAvatar = ({ url = "", name }: { url: string; name?: string }) => {
  return (
    <div className="flex items-center justify-start gap-x">
      <div className="relative h-14 w-14 overflow-hidden rounded-full border border-alpha-400">
        <Image
          src={url}
          alt="category"
          fill
          className="h-full w-full rounded-full object-contain"
        />
      </div>
      {name && <h5 className="text-right font-semibold">{name}</h5>}
    </div>
  )
}

export default CardAvatar
