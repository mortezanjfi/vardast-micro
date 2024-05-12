"use server"

import { headers } from "next/headers"

export const CheckIsMobileView = async () => {
  // call the function and assign the headers to a constant
  const headersList = headers()
  const userAgent = headersList.get("user-agent")

  // Let's check if the device is a mobile device
  return !!userAgent!.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  )
}
