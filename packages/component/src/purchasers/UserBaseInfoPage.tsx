import UserBaseInfoForm from "./UserBaseInfoForm"

export type UserBaseInfoPageProps = {
  isMobileView: boolean
  uuid?: string
}

export default ({ isMobileView, uuid }: UserBaseInfoPageProps) => {
  return <UserBaseInfoForm isMobileView={isMobileView} uuid={uuid} />
}
