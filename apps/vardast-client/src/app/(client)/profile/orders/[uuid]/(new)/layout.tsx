import { PropsWithChildren } from "react"
import LayoutWithStepper from "@vardast/component/template/LayoutWithStepper"
import { _orderSteppers, _orderUrlToStepMappers } from "@vardast/lib/stepper"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <LayoutWithStepper
      isMobileView={isMobileView}
      children={children}
      steppers={_orderSteppers}
      urlToStepMapper={_orderUrlToStepMappers}
    />
  )
}
export default Layout
