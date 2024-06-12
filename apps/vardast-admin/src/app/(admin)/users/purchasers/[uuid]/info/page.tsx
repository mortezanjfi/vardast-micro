import UserBaseInfoPage from "@vardast/component/purchasers/UserBaseInfoPage"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

type Props = {}

async function page({ params: { uuid } }: { params: { uuid: string } }) {
  const isMobileView = await CheckIsMobileView()

  return <UserBaseInfoPage uuid={uuid} isMobileView={false} />
}

export default page
