import Card from "@vardast/component/Card"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ResetForm from "@/app/(authentication)/components/ResetForm"

const ResetPage = async () => {
  const isMobileView = await CheckIsMobileView()

  if (isMobileView) {
    return <ResetForm isMobileView={true} />
  }
  return (
    <Card className="gap-6 md:py-12">
      <ResetForm />
    </Card>
  )
}

export default ResetPage
