import { ReactNode } from "react"
import Image from "next/image"

const MobileHomeImage = ({
  images
}: {
  images: { Title?: ReactNode; url: string; id: string }[]
}) => {
  return (
    <>
      {images.map(({ url, Title, id }) => (
        <div key={id} className="relative h-full w-full">
          {Title && (
            <div className="absolute left-0 right-0 top-0 z-10">{Title}</div>
          )}
          <Image
            src={url}
            alt="slider"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      ))}
    </>
  )
}

export default MobileHomeImage
