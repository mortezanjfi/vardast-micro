import UserFinanceInfoForm from "./UserFinanceInfoForm"

export type UserBaseInfoPageProps = {
  uuid?: string
}

export default ({ uuid }: UserBaseInfoPageProps) => {
  return <UserFinanceInfoForm uuid={uuid} />
}
