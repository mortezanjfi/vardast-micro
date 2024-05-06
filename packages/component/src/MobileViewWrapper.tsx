import { ReactElement } from "react"
import { headers } from "next/headers"

type Props = {
  children(_: any): ReactElement
}

const MobileViewWrapper = ({ children }: Props) => {
  // call the function and assign the headers to a constant
  const headersList = headers()
  const userAgent = headersList.get("user-agent")

  // Let's check if the device is a mobile device
  let isMobileView = userAgent!.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  )

  return <>{children({ data: isMobileView })}</>
}

export default MobileViewWrapper
