import UserBaseInfoForm from "./UserBaseInfoForm"

export type UserBaseInfoPageProps = {
  uuid?: string
}

export default ({ uuid }: UserBaseInfoPageProps) => {
  return <UserBaseInfoForm uuid={uuid} />
}
