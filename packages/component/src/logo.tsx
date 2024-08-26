import Image from "next/image"
import logoTypeImage from "@vardast/asset/images/logo-type.png"

const Logo = () => {
  return (
    <Image
      alt="..."
      className="h-12 w-auto object-contain"
      height={186}
      loading="lazy"
      src={logoTypeImage}
      width={1315}
    />
  )
}

export default Logo
