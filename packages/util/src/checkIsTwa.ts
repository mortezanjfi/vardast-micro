"use server"

import { headers } from "next/headers"

export const CheckIsTwa = async () => {
  // call the function and assign the headers to a constant
  const headersList = headers()
  const userAgent = headersList.get("user-agent")
  const isTWA = userAgent.toLowerCase().includes("twa")
  // Let's check if the device is a mobile device
  return { isTWA, userAgent }
}
