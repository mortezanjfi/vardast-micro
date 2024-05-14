import Image from "next/image"
import logoTypeImage from "@vardast/asset/images/logo-type.png"

const Logo = () => {
  return (
    <Image
      src={logoTypeImage}
      alt="..."
      loading="lazy"
      width={1315}
      height={186}
      className="h-12 w-auto object-contain"
    />
  )
}

export default Logo
