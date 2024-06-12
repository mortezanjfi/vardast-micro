"use client"

import { useState } from "react"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "../../desktop/CardContainer"
import Link from "../../Link"
import {
  SELECTED_ITEM,
  SELECTED_ITEM_TYPE
} from "../../project/user/ProjectUsersTab"
import { UserModal } from "../../project/user/UserModal"

type Props = { uuid: string; isMobileView: boolean }

function LegalUsers({ isMobileView, uuid }: Props) {
  const { t } = useTranslation()
  const [selectedUsers, setSelectedUsers] = useState<SELECTED_ITEM>()
  const onOpenModal = (selectedUsers: SELECTED_ITEM) => {
    console.log("open")

    setSelectedUsers(selectedUsers)
  }
  const onCloseModal = () => {
    setSelectedUsers(undefined)
  }
  return (
    <>
      <UserModal
        isMobileView={isMobileView}
        uuid={uuid}
        onCloseModal={onCloseModal}
        selectedUsers={selectedUsers}
        assignToProject={false}
      />
      <CardContainer
        button={{
          text: "افزودن همکار",
          variant: "primary",
          onClick: () =>
            onOpenModal({
              type: SELECTED_ITEM_TYPE.ADD,
              data: undefined
            })
        }}
        title="اطلاعات خواسته شده را وارد نمایید"
        titleClass="!border-0 font-normal"
      >
        <table className="table-hover table">
          <thead>
            <tr>
              <th>{t("common:row")}</th>
              <th>
                {t("common:entity_name", { entity: t("common:colleague") })}
              </th>
              <th>{t("common:cellphone")}</th>
              <th>{t("common:colleague-role")}</th>
              <th>{t("common:status")}</th>
              <th>{t("common:operation")}</th>
            </tr>
          </thead>

          <tbody className="border-collapse border">
            <tr>
              <td className="w-4">
                <span></span>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </CardContainer>
      <div className=" mt-7 flex w-full flex-row-reverse gap border-t pt-6 ">
        <Link
          className="btn btn-md btn-primary"
          href={`/users/purchasers/${uuid}/submition`}
        >
          تایید و ادامه
        </Link>
        <Link className="btn btn-md btn-secondary" href={"/users/purchasers"}>
          بازگشت به کاربران
        </Link>
      </div>
    </>
  )
}

export default LegalUsers
