import UserLegalInfoForm from "./UserLegalInfoForm"

export type UserBaseInfoPageProps = {
  uuid?: string
}

export default ({ uuid }: UserBaseInfoPageProps) => {
  return <UserLegalInfoForm uuid={uuid} />
}
