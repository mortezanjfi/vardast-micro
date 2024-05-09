import Image from "next/image"

const Logo = () => {
  return (
    <Image
      src="/images/logo-type.png"
      alt="..."
      loading="lazy"
      width={1315}
      height={186}
      className="h-12 w-auto object-contain"
    />
  )
}

export default Logo
