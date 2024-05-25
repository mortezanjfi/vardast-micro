import { ReactNode } from "react"

import OrderInfoCard from "./OrderInfoCard"
import OrderProductsList from "./OrderProductsList"

type Props = {
  SellerChildren?: ReactNode
  isAdmin?: boolean
  Adminchildren?: ReactNode
  data: any
}

const OrderDetail: React.FC<Props> = ({
  isAdmin,
  Adminchildren,

  SellerChildren,
  data
}) => {
  return (
    <div className="flex w-full flex-col gap-9">
      <OrderInfoCard isAdmin={true} />
      <OrderProductsList data={data} />
      {isAdmin ? Adminchildren : SellerChildren}
    </div>
  )
}

export default OrderDetail
