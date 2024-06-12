import CollabInfoPage from "@vardast/component/purchasers/collabs/CollabInfoPage"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

type Props = {}

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()
  return <CollabInfoPage isMobileView={isMobileView} uuid={uuid} />
}

export default page
