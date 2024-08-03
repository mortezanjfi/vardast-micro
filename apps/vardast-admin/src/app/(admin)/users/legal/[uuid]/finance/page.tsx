import UserFinanceInfoPage from "@vardast/component/legal/finance-Info/UserFinanceInfoPage"

async function page({ params: { uuid } }: { params: { uuid: string } }) {
  return <UserFinanceInfoPage uuid={uuid} />
}

export default page
