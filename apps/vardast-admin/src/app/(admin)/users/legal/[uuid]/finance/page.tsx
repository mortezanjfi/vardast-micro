import UserFinanceInfoPage from "@vardast/component/purchasers/finance-Info/UserFinanceInfoPage"

type Props = {}

async function page({ params: { uuid } }: { params: { uuid: string } }) {
  return <UserFinanceInfoPage uuid={uuid} />
}

export default page
