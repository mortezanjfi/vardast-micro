import UserLegalInfoPage from "@vardast/component/legal/legal-info/UserLegalInfoPage"

type Props = {}

async function page({ params: { uuid } }: { params: { uuid: string } }) {
  return <UserLegalInfoPage uuid={uuid} />
}

export default page
