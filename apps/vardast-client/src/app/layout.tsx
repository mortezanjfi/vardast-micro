import { Metadata } from "next"
import startupImage from "@vardast/lib/startupImage"
import NextAppProvider from "@vardast/provider/NextAppProvider"

export const metadata: Metadata = {
  title: {
    template: `${process.env.NEXT_PUBLIC_TITLE} | %s`,
    default: process.env.NEXT_PUBLIC_TITLE as string
  },
  appleWebApp: {
    capable: true,
    title: process.env.NEXT_PUBLIC_TITLE,
    startupImage
  },
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
}
export default NextAppProvider
