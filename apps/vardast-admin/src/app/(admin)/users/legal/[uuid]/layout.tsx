import { PropsWithChildren } from "react"
import LayoutWithStepper from "@vardast/component/template/LayoutWithStepper"
import { _legalSteppers, _legalUrlToStepMappers } from "@vardast/lib/stepper"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <LayoutWithStepper
      isMobileView={isMobileView}
      children={children}
      steppers={_legalSteppers}
      urlToStepMapper={_legalUrlToStepMappers}
    />
  )
}
export default Layout
