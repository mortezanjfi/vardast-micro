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
        <div className="relative h-full w-full" key={id}>
          {Title && (
            <div className="absolute left-0 right-0 top-0 z-10">{Title}</div>
          )}
          <Image
            alt="slider"
            className="rounded-xl object-cover"
            fill
            src={url}
          />
        </div>
      ))}
    </>
  )
}

export default MobileHomeImage
