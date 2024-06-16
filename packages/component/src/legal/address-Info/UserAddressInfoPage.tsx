import UserAddressInfoForm from "./UserAddressInfoForm"

export type UserBaseInfoPageProps = {
  uuid?: string
}

export default ({ uuid }: UserBaseInfoPageProps) => {
  return <UserAddressInfoForm uuid={uuid} />
}
