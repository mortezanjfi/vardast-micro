import UsersDetail from "@vardast/component/legal/collabs/UsersDetail"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()
  return <UsersDetail isMobileView={isMobileView} uuid={uuid} />
}

export default page
