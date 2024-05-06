import { PropsWithChildren } from "react"

import MobileBaseLayout from "@/app/components/MobileBaseLayout"

const Layout: React.FC<PropsWithChildren> = ({ children }) => (
  <MobileBaseLayout spaceLess>{children}</MobileBaseLayout>
)
export default Layout
