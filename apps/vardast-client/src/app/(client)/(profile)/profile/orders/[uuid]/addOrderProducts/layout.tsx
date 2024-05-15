import { PropsWithChildren } from "react"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderInnerLayout from "@/app/(client)/(profile)/profile/orders/components/OrderInnerLayout"

interface ILayout extends PropsWithChildren {
  params: { uuid: string }
}
const Layout: React.FC<ILayout> = async ({ children, params: { uuid } }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <>
      <OrderInnerLayout isMobileView={isMobileView} uuid={uuid}>
        {children}
      </OrderInnerLayout>
    </>
  )
}

export default Layout
