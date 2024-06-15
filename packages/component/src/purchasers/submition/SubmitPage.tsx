import { Button } from "../../../../ui/src/button"
import Link from "../../Link"
import UserAddressInfoForm from "../address-Info/UserAddressInfoForm"
import BaseInfoReadOnly from "../BaseInfoReadOnly"
import UsersDetail from "../collabs/UsersDetail"
import UserLegalInfoForm from "../legal-info/UserLegalInfoForm"

type Props = { uuid: string }
export const inputSectionClass = "flex flex-col gap-1"

export default ({ uuid }: Props) => {
  return (
    <div className="flex flex-col gap-7">
      <BaseInfoReadOnly uuid={uuid} />
      <UserAddressInfoForm uuid={uuid} readOnlyMode={true} />
      <UserLegalInfoForm uuid={uuid} readOnlyMode={true} />
      <UsersDetail uuid={uuid} readOnlyMode={true} />
      <div className=" mt-7 flex w-full flex-row-reverse gap border-t pt-6 ">
        <Button type="button" variant="primary">
          تایید و ادامه
        </Button>
        <Link className="btn btn-md btn-secondary" href={"/users/purchasers"}>
          بازگشت به کاربران
        </Link>
      </div>
    </div>
  )
}
