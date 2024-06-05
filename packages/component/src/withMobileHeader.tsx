import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MobileHeader from "./header/MobileHeader"

function withMobileHeader<T>(Component: React.FC<T>, headerProps: any) {
  return async (props: any) => {
    const isMobileView = await CheckIsMobileView()
    const title =
      headerProps.title ||
      ((Object.values(props.params)?.at(0) as any)?.at(1) &&
        decodeURI((Object.values(props.params)?.at(0) as any)?.at(1)))

    return (
      <>
        {isMobileView && <MobileHeader {...{ ...headerProps, title }} />}
        <Component {...props} />
      </>
    )
  }
}
export default withMobileHeader
