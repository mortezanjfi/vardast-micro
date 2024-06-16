import UserAddressInfoPage from "@vardast/component/legal/address-Info/UserAddressInfoPage"

type Props = {}

async function page({ params: { uuid } }: { params: { uuid: string } }) {
  return <UserAddressInfoPage uuid={uuid} />
}

export default page
