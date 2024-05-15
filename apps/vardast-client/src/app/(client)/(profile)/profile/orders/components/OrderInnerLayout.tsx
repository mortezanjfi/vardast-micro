import { PropsWithChildren } from "react"

import OrderInfoCard from "@/app/(client)/(profile)/profile/orders/components/OrderInfoCard"

interface IOrderInnerLayoutLayout extends PropsWithChildren {
  uuid: string
  isMobileView: boolean
}

const OrderInnerLayout: React.FC<IOrderInnerLayoutLayout> = ({
  children,
  isMobileView,
  uuid
}) => {
  return (
    <>
      {!isMobileView && (
        <div className="hide-scrollbar flex flex-col-reverse gap-9 overflow-y-auto p-0.5 2xl:grid 2xl:grid-cols-4">
          <div className="col-span-3">{children}</div>
          <OrderInfoCard uuid={uuid} />
        </div>
      )}
    </>
  )
}

export default OrderInnerLayout
